<script lang="ts">
  import '../assets/scss/styles.scss'
  import Notification from '../components/layouts/Notification.svelte'
  
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<div class="app">
  <Notification />
  {@render children?.()}
</div>
