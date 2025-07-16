<script lang="ts">
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

<Notifications />
{@render children?.()}

<style lang="scss" global>
  @use '../../static/scss/styles.scss';
</style>
