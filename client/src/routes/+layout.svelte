<script lang="ts">
  import '$assets/scss/styles.scss'
  import Notification from '$components/Notification.svelte'
  // import LoadingSplash from '$components/LoadingSplash.svelte'
  import type { LayoutData } from './$types'
  import { goto } from '$app/navigation'

  export let data: LayoutData

  if (data.to !== '') {
    goto(data.to)
    data.to = ''
  }  
</script>

<div class="app">
  <Notification />

  {#if data.to == ''}
    <slot />
  {/if}
</div>
