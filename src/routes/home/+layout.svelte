<script lang="ts">
</script>

<div class="flex h-screen w-screen flex-col">
	<!-- Top Navbar -->
	<div class="bg-primary p-4">
		<!-- Content for top navbar -->
		Top Navbar
	</div>

	<!-- Content Area with Sidebar -->
	<div class="flex flex-1 overflow-hidden">
		<!-- Sidebar -->
		<div class="h-full w-1/6 bg-gray-100 p-4">
			<!-- Content for sidebar -->
			Sidebar
		</div>

		<!-- Main Content -->
		<div class="flex-1 overflow-auto p-4">
			<!-- Content for main area -->
			<slot />
		</div>
	</div>
</div>
