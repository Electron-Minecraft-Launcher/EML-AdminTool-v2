<script lang="ts">
  import type { LayoutData } from './$types'
  import LeftPanel from '$components/LeftPanel.svelte'

  export let data: LayoutData
</script>

<LeftPanel />

<div class="container">
  <slot />
</div>

<style>
  div.container {
    margin-left: 260px;
    padding: 30px 100px;
  }
</style>
