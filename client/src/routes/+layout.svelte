<script>
  import '$assets/scss/styles.scss'
  import Notification from '$components/Notification.svelte'
  import LoadingSplash from '$components/LoadingSplash.svelte'
</script>

<div class="app">
  <Notification />
  <LoadingSplash transparent={false} />

  <main>
    <slot />
  </main>
</div>
