import * as msClient from 'mediasoup-client';
import * as socket from 'socket.io-client';
import { ALLOCATE_MEDIA_SERVER_FOR_CHANNEL, GraphQLClient } from '$lib/business';
import type {
	AllocateMediaServerMutation,
	AllocateMediaServerMutationVariables
} from '$lib/business.generated';
import { getAuthHeader } from '$lib/store/user';
import { browser } from '$app/environment';
import createLazyStore from '$lib/store/lazy';

interface MediaServerToClientEvents {
	required_authorize: () => void;
	critical_failure: (reason: { reason: string }) => void;
	operation_error: (reason: { reason: string; operation: string }) => void;
	user_audio_producer_updated: (data: {
		userId: string;
		oldProducerId?: string;
		newProducerId: string;
	}) => void;
}

interface MediaClientToServerEvents {
	authorize: (token: { token: string }, callback: () => void) => void;
	request_connection_info: (
		callback: (data: {
			id: string;
			routerRtpCapabilities: msClient.types.RtpCapabilities;
			iceParameters: msClient.types.IceParameters;
			iceCandidates: msClient.types.IceCandidate[];
			dtlsParameters: msClient.types.DtlsParameters;
		}) => void
	) => void;
	request_connect: (
		data: {
			dtlsParameters: msClient.types.DtlsParameters;
		},
		callback: (ok: boolean) => void
	) => void;
	place_audio_producer: (
		producerInfo: {
			kind: msClient.types.MediaKind;
			rtpParameters: msClient.types.RtpParameters;
		},
		callback: (
			data?: {
				producerId: string;
			},
			error?: {
				requireRenewTransport?: boolean;
			}
		) => void
	) => void;
	place_video_producer: (
		producerInfo: {
			kind: msClient.types.MediaKind;
			rtpParameters: msClient.types.RtpParameters;
		},
		callback: (
			data?: {
				producerId: string;
			},
			error?: {
				requireRenewTransport?: boolean;
			}
		) => void
	) => void;
	request_change_name: (newName: string) => void;
}

export const getDefaultMicrophone = async () => {
	if (!browser) throw new Error('Nerve call getDefaultMicrophone from server env');

	const devices = await navigator.mediaDevices.enumerateDevices();
	return devices.find(
		(device) =>
			device.kind === 'audioinput' &&
			(device.deviceId === 'default' || device.deviceId === 'communications')
	);
};

export const allocateMediaServer = async (channelId: string) => {
	const result = await GraphQLClient.mutate<
		AllocateMediaServerMutation,
		AllocateMediaServerMutationVariables
	>({
		mutation: ALLOCATE_MEDIA_SERVER_FOR_CHANNEL,
		variables: {
			channelId
		},
		context: {
			headers: getAuthHeader()
		}
	});

	return result.data!.allocateMediaServer;
};

class MediaContext {
	private mediaSeverInfo?: Awaited<ReturnType<typeof allocateMediaServer>>;

	device: msClient.types.Device;
	dataSocket?: socket.Socket<MediaServerToClientEvents, MediaClientToServerEvents>;

	sendTransport?: msClient.types.Transport;
	recvTransport?: msClient.types.Transport;

	audioProducer?: msClient.types.Producer;
	audioConsumers: msClient.types.Consumer[];

	constructor() {
		try {
			this.device = new msClient.Device();
		} catch (error) {
			if (error instanceof msClient.types.UnsupportedError) {
				alert(`Unsupported browser: ${error.message}`);
			}
			throw error;
		}
		this.audioConsumers = [];
	}

	async initialize(channelId: string) {
		await this.createSignalConnection(channelId);
		await this.tryConnect();
	}

	async dispose() {
		this.sendTransport?.close();
		this.recvTransport?.close();
		this.dataSocket?.disconnect();

		this.sendTransport = undefined;
		this.recvTransport = undefined;
		this.audioProducer = undefined;
		this.audioConsumers = [];
		this.dataSocket = undefined;
	}

	private async createSignalConnection(channelId: string) {
		this.mediaSeverInfo = await allocateMediaServer(channelId);

		if (!this.mediaSeverInfo) {
			throw 'Failed to allocate media server';
		}

		this.dataSocket = socket.io(
			`${this.mediaSeverInfo.hostname}:${this.mediaSeverInfo.port}/media`,
			{
				autoConnect: false
			}
		);

		this.dataSocket.onAny(console.log);

		this.dataSocket.connect();

		await new Promise<void>((resolve) => {
			this.dataSocket!.on('required_authorize', () => {
				this.dataSocket!.emit(
					'authorize',
					{
						token: this.mediaSeverInfo!.token
					},
					() => resolve()
				);
			});
		});
	}

	private requestConnectionInfo(): Promise<{
		id: string;
		routerRtpCapabilities: msClient.types.RtpCapabilities;
		iceParameters: msClient.types.IceParameters;
		iceCandidates: msClient.types.IceCandidate[];
		dtlsParameters: msClient.types.DtlsParameters;
	}> {
		return new Promise((resolve) => {
			this.dataSocket!.emit('request_connection_info', (result) => {
				resolve(result);
			});
		});
	}

	private async tryConnect() {
		const { id, routerRtpCapabilities, iceParameters, iceCandidates, dtlsParameters } =
			await this.requestConnectionInfo();

		if (!this.device.loaded) {
			await this.device.load({
				routerRtpCapabilities: routerRtpCapabilities
			});
		}

		this.sendTransport = this.device.createSendTransport({
			id,
			iceParameters,
			iceCandidates,
			dtlsParameters
		});

		this.recvTransport = this.device.createSendTransport({
			id,
			iceParameters,
			iceCandidates,
			dtlsParameters
		});

		this.setupTransport(this.sendTransport);
		this.setupTransport(this.recvTransport);
	}

	private setupTransport(transport: msClient.types.Transport) {
		transport.on('connect', async ({ dtlsParameters }, callback) => {
			this.dataSocket!.emit(
				'request_connect',
				{
					dtlsParameters
				},
				callback
			);
		});

		transport.on('produce', async (parameters, callback, reject) => {
			if (parameters.kind === 'video') {
				reject(new Error("We don't support video stream yet"));
			}
			this.dataSocket!.emit(
				'place_audio_producer',
				{
					kind: parameters.kind,
					rtpParameters: parameters.rtpParameters
				},
				(id) => callback({ id: id!.producerId })
			);
		});

		transport.on('connectionstatechange', console.log);
	}

	async createAudioProducer() {
		if (!browser) {
			return;
		}

		const device = await navigator.mediaDevices.getUserMedia({
			audio: true
		});

		const track = device.getAudioTracks()[0];
		this.audioProducer = await this.sendTransport!.produce({
			track
		});
	}
}

const createMediaContext = (): MediaContext => {
	return new MediaContext();
};

export const mediaContext = createLazyStore<MediaContext>(
	createMediaContext,
	null,
	async (value) => {
		await value.dispose();
	}
);
