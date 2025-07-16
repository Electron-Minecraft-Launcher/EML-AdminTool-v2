<script lang="ts">
  import { l } from '$lib/stores/language'
  import type { PageProps } from './$types'
  import LoadingSplash from '../../../components/layouts/LoadingSplash.svelte'
  import getEnv from '$lib/utils/env'
  import { applyAction, enhance } from '$app/forms'
  import type { SubmitFunction } from '@sveltejs/kit'
  import { addNotification } from '$lib/stores/notifications'
  import type { NotificationCode } from '$lib/utils/notifications'
  import Footer from '../../../components/layouts/Footer.svelte'

  let { data }: PageProps = $props()

  const env = getEnv()

  let showLoader = $state(false)

  let password = $state('')
  let username = $state('')

  const enhanceForm: SubmitFunction = ({ formData }) => {
    showLoader = true

    return async ({ result, update }) => {
      update({ reset: false })
      showLoader = false

      if (result.type === 'failure') {
        const message = $l.notifications[result.data?.failure as NotificationCode] ?? $l.notifications.INTERNAL_SERVER_ERROR
        addNotification('ERROR', message)
        password = ''
      }

      await applyAction(result)
    }
  }
</script>

<svelte:head>
  <title>{$l.auth.login} • {env.name} AdminTool</title>
</svelte:head>

<form method="POST" action="?/login" use:enhance={enhanceForm}>
  {#if showLoader}
    <LoadingSplash transparent />
  {/if}

  <h2>{$l.auth.login}</h2>
  <p>{env.name} AdminTool</p>

  <label for="username">{$l.main.username}</label>
  <input type="text" id="username" name="username" autocomplete="username" bind:value={username} />

  <label for="password">{$l.main.password}</label>
  <input type="password" id="password" name="password" autocomplete="current-password" bind:value={password} />

  <button type="submit" class="primary">{$l.auth.login}</button>
  <p class="center">
    <a class="small-link" href="/register">{$l.auth.createAccount}</a>
  </p>
</form>

<div class="footer-container">
  <Footer />
</div>

<style lang="scss">
  @use '../../../../static/scss/login.scss';
</style>
