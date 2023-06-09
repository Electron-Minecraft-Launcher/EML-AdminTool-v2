<script lang="ts">
  import LeftPanel from '$components/LeftPanel.svelte'
  import Footer from '$components/Footer.svelte'
</script>

<LeftPanel />

<div class="container">
  <slot />
  <Footer />
</div>

<style>
  div.container {
    margin-left: 260px;
    padding: 30px 100px;
  }
</style>
