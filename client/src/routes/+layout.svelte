<script lang="ts">
  import '$assets/scss/styles.scss'
  import Notification from '$components/Notification.svelte'
</script>

<div class="app">
  <Notification />
  <slot />
</div>
