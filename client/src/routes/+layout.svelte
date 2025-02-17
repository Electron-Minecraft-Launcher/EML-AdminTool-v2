<script lang="ts">
  import '../assets/scss/styles.scss'
  import Notification from '../components/layouts/Notification.svelte'
  import fav from '../assets/images/favico.png'

  interface Props {
    children?: import('svelte').Snippet
  }

  let { children }: Props = $props()
</script>

<svelte:head>
  <link rel="icon" type="image/png" href={fav} />
</svelte:head>

<div class="app">
  <Notification />
  {@render children?.()}
</div>
