<script lang="ts">
  import '$assets/scss/styles.scss'
  import Notification from '$components/Notification.svelte'
  // import LoadingSplash from '$components/LoadingSplash.svelte'
  import type { LayoutData } from './$types'
  import { goto } from '$app/navigation'
  import { redirect$ } from '$services/store'
  import utils from '$services/utils'

  export let data: LayoutData

  // redirect$.subscribe(async (value) => {
  //   if (value !== null) {
  //     await utils.sleep(10)
  //     goto(value + '')
  //     data.redirect = false
  //   }
  // })
</script>

<div class="app">
  <Notification />

  <!-- {#if !data.redirect} -->
    <slot />
  <!-- {/if} -->
</div>
