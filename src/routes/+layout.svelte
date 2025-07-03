<script lang="ts">
  import '../../assets/scss/styles.scss'
  // import Notification from '../components/layouts/Notification.svelte'
  import fav from '../../assets/images/favicon.png'
  import type { LayoutData } from './$types'
  import { setContext } from 'svelte'
  import type { Env } from '$lib/utils/types'

  interface Props {
    data: LayoutData
    children?: import('svelte').Snippet
  }

  let { data, children }: Props = $props()

  setContext<Env>('env', data.env)
</script>

<svelte:head>
  <link rel="icon" type="image/png" href={fav} />
</svelte:head>

<div class="app">
  <!-- <Notification /> -->
  {@render children?.()}
</div>
