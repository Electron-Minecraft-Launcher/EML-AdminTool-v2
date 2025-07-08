<script lang="ts">
  import '../../assets/scss/styles.scss'
  import fav from '../../assets/images/favicon.png'
  import type { LayoutData } from './$types'
  import { setContext } from 'svelte'
  import type { Env } from '$lib/utils/types'
  import Notifications from '../components/layouts/Notifications.svelte'

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

<Notifications />
{@render children?.()}
