<script lang="ts">
  import LoadingSplash from '../../../components/layouts/LoadingSplash.svelte'
  import { env, user, l } from '../../../services/store'
  import apiAuthService from '../../../services/api/api-auth.service'
  import cookiesService from '../../../services/cookies.service'
  import { goto } from '$app/navigation'

  let name: string = $state('')
  let password: string = $state('')
  let splash: boolean = $state(false)

  async function submit(e: SubmitEvent) {
    e.preventDefault()
    splash = true
    ;(await apiAuthService.getAuth(name + '', password + '')).subscribe({
      next: async (res) => {
        cookiesService.add({
          name: 'JWT',
          value: res.body?.data?.jwt + '',
          expireDays: 30
        })
        user.set(res.body?.data?.user!)
        goto('/dashboard')
      },
      error: () => {
        splash = false
      }
    })
  }
</script>

<svelte:head>
  <title>{$l.auth.login} • {$env.name} AdminTool</title>
</svelte:head>

<form onsubmit={submit}>
  {#if splash}
    <LoadingSplash transparent={true} />
  {/if}

  <h2>{$l.auth.login}</h2>
  <p>{$env.name} AdminTool</p>

  <label for="name">{$l.main.username}</label>
  <input type="text" id="name" placeholder={$l.main.username} bind:value={name} />

  <label for="username">{$l.main.password}</label>
  <input type="password" id="username" placeholder={$l.main.password} bind:value={password} />

  <button class="primary">{$l.auth.login}</button>
  <p class="center">
    <a class="small-link" href="/register">{$l.auth.createAccount}</a>
  </p>
</form>

<style lang="scss">
  @use '../../../assets/scss/login.scss';
</style>
