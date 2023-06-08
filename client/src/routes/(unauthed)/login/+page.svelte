<script lang="ts">
  import LoadingSplash from '$components/LoadingSplash.svelte'
  import { env$, user$ } from '$services/store'
  import ApiAuthService from '$services/api/api-auth.service'
  import CookiesService from '$services/cookies.service'
  import type { Env } from '$models/data/env.model'
  import type en from '$assets/language/en'
  import { goto } from '$app/navigation'
  import type fr from '$assets/language/fr'

  const apiAuth = new ApiAuthService()
  const cookies = new CookiesService()

  let env!: Env
  let l: typeof en | typeof fr

  env$.subscribe((value) => {
    if (value && value.language && typeof value.language !== 'string') {
      env = value
      l = value.language
    }
  })

  let name: string = ''
  let password = ''
  let splash: boolean = false

  async function submit() {
    splash = true
    ;(await apiAuth.getAuth(name + '', password + '')).subscribe({
      next: async (res) => {
        cookies.add({
          name: 'JWT',
          value: res.body?.data?.jwt + '',
          expireDays: 30,
        })
        user$.set(res.body?.data?.user!)
        goto('/dashboard')
      },
      error: () => {
        splash = false
      },
    })
  }
</script>

<svelte:head>
  <title>{l.auth.login} • {env.name} AdminTool</title>
</svelte:head>

<form on:submit|preventDefault={submit}>
  {#if splash}
    <LoadingSplash transparent={true} />
  {/if}

  <h2>{l.auth.login}</h2>
  <p>{env.name} AdminTool</p>
  <input type="text" placeholder={l.main.username} name="name" bind:value={name} />
  <input type="password" placeholder={l.main.password} name="password" bind:value={password} />
  <button class="primary">{l.auth.login}</button>
  <p class="center">
    <a class="small-link" href="/register">{l.auth.createAccount}</a>
  </p>
</form>

<style lang="scss">
  @import 'login.scss';
</style>
