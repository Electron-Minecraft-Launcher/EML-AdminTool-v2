<script lang="ts">
  import type en from '$assets/language/en'
  import type fr from '$assets/language/fr'
  import LeftPanel from '$components/LeftPanel.svelte'
  import Skeleton from '$components/Skeleton.svelte'
  import type { Env } from '$models/data/env.model'
  import type { User } from '$models/features/user.model'
  import { env$, user$ } from '$services/store'

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

<h2>{l.main.home}</h2>

{#if !user}
  <Skeleton randomWidth={{ times: 100, min: 200 }} />
{:else}
  <h3>{l.dashboard.welcome}, {user.name + (l.l == 'fr' ? ' ' : '')}!</h3>
{/if}

<div class="wip">
  <p class="wip">We are still building this area!</p>
  <p class="sub-wip">You will be able to use it in a future update.</p>
</div>

<style lang="scss">
  h2 {
    margin-top: 0;
    font-size: 32px;
  }

  div.wip {
    border-radius: 10px;
    width: calc(100% - 10px);
    // box-shadow: 0 0 0 5px #090909;
    position: relative;
    margin-top: 50px;
    padding: 100px 0;
    text-align: center;
    background: #fafafa;
    opacity: 0.6;
    transition: opacity 0.3s, box-shadow 0.3s;

    &:hover {
      opacity: 1;
      box-shadow: 0 0 50px #00000008
    }

    p.wip {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 0;
    }

    p.sub-wip {
      font-size: 14px;
      margin-top: 5px;
    }
  }
</style>
