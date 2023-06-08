<script lang="ts">
  import type en from '$assets/language/en'
  import type fr from '$assets/language/fr'
  import LeftPanel from '$components/LeftPanel.svelte'
  import Skeleton from '$components/Skeleton.svelte'
  import type { Env } from '$models/data/env.model'
  import type { User } from '$models/features/user.model'
  import { env$, user$ } from '$services/store'
  //   import type { PageData } from './$types'

  //   export let data: PageData

  let env!: Env
  let l: typeof en | typeof fr
  let user: User

  env$.subscribe((value) => {
    if (value && value.language && typeof value.language !== 'string') {
      env = value
      l = value.language
    }
  })

  user$.subscribe((value) => {
    if (value) {
      user = value
    }
  })
</script>

<svelte:head>
  <title>{env.name} AdminTool</title>
</svelte:head>

<h2>Home</h2>

{#if !user}
  <Skeleton randomWidth={{ times: 100, min: 200 }} />
{:else}
  <h3>Welcome, {user.name}!</h3>
{/if}

<style lang="scss">
  h2 {
    margin-top: 0;
    font-size: 32px;
  }
</style>
