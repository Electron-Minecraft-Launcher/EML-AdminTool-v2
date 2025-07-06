<script lang="ts">
  import { currentLanguage, l } from '$lib/store/language'
  import { getContext } from 'svelte'
  import type { PageProps } from './$types'
  import type { Env } from '$lib/utils/types'
  import LoadingSplash from '../../../components/layouts/LoadingSplash.svelte'

  let { data }: PageProps = $props()

  const env = getContext<Env>('env')

  let showSplash = $state(false)

  let password = $state('')
  let username = $state('')

  currentLanguage.set(env.language || 'en')
</script>

<svelte:head>
  <title>{$l.auth.login} • {env.name} AdminTool</title>
</svelte:head>

<form>
  {#if showSplash}
    <LoadingSplash transparent={true} />
  {/if}

  <h2>{$l.auth.login}</h2>
  <p>{env.name} AdminTool</p>

  <label for="name">{$l.main.username}</label>
  <input type="text" id="name" bind:value={username} />

  <label for="username">{$l.main.password}</label>
  <input type="password" id="username" bind:value={password} />

  <button class="primary">{$l.auth.login}</button>
  <p class="center">
    <a class="small-link" href="/register">{$l.auth.createAccount}</a>
  </p>
</form>

<style lang="scss">
  @use '../../../../assets/scss/login.scss';
</style>
