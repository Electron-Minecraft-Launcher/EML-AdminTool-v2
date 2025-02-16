<script lang="ts">
  import LeftPanel from '../../components/layouts/LeftPanel.svelte'
  import Footer from '../../components/layouts/Footer.svelte'
  
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  let leftPanelOpen = $state(true)
</script>

<div class="container">
  <div class="nav" class:closed={!leftPanelOpen}>
    <LeftPanel bind:leftPanelOpen />
  </div>

  <div class="content">
    {@render children?.()}
    <Footer />
  </div>
</div>

<style lang="scss">
  div.container {
    display: flex;
    flex-direction: row;
    min-height: 100vh;
    flex: 1;
  }

  div.nav {
    width: 260px;
    transition: all 0.3s;
    z-index: 10;

    &.closed {
      width: 106px;
    }
  }

  div.content {
    padding: 30px 100px;
    flex: 1;
  }
</style>
