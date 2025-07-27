<script lang="ts">
  import { l } from '$lib/stores/language'
  import LoadingSplash from '../../../components/layouts/LoadingSplash.svelte'
  import type { PageProps } from './$types'
  import getEnv from '$lib/utils/env'
  import Footer from '../../../components/layouts/Footer.svelte'
  import { applyAction, enhance } from '$app/forms'
  import type { SubmitFunction } from '@sveltejs/kit'
  import type { NotificationCode } from '$lib/utils/notifications'
  import { addNotification } from '$lib/stores/notifications'

  let { data }: PageProps = $props()

  const env = getEnv()

  let showLoader = $state(false)

  let username = $state('')
  let password = $state('')
  let passwordCfr = $state('')
  let pin = $state(['', '', ''])

  let disabled = $derived.by(() => {
    return !username || !password || password !== passwordCfr || pin.some((p) => p === '')
  })

  /**
   * @link From https://codepen.io/oxcakmak/pen/QWeBKWj
   */
  function handlePinInput(e: KeyboardEvent) {
    const input = e.target as HTMLInputElement
    const key = e.key

    if (isNaN(Number(key)) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(key)) {
      e.preventDefault()
      return
    }

    if (key.length === 1 && !isNaN(Number(key))) {
      input.value = key
      const nextInput = input.nextElementSibling as HTMLInputElement | null
      if (nextInput) nextInput.focus()
      e.preventDefault()
    } else if (key === 'Backspace') {
      if (input.value === '') {
        const previousInput = input.previousElementSibling as HTMLInputElement | null
        if (previousInput) {
          previousInput.focus()
          previousInput.value = ''
        }
      } else {
        input.value = ''
      }
      e.preventDefault()
    } else if (key === 'Delete') {
      let nextInput = input as HTMLInputElement | null

      while (nextInput) {
        const followingInput = nextInput.nextElementSibling as HTMLInputElement | null
        nextInput.value = followingInput ? followingInput.value : ''
        nextInput = followingInput
      }

      if (input.value === '') {
        let prevInput = input.previousElementSibling as HTMLInputElement | null
        if (prevInput) {
          prevInput.focus()
          prevInput.value = ''
        }
      }

      e.preventDefault()
    } else if (key === 'ArrowLeft') {
      const previousInput = input.previousElementSibling as HTMLInputElement | null
      if (previousInput) previousInput.focus()
      e.preventDefault()
    } else if (key === 'ArrowRight') {
      const nextInput = input.nextElementSibling as HTMLInputElement | null
      if (nextInput) nextInput.focus()
      e.preventDefault()
    }

    // const pinInputs = Array.from(document.querySelectorAll<HTMLInputElement>('div.pin-inputs input[type="text"]'))
    // if (pinInputs.every((input) => input.value !== '') && input.id === 'pin-3') {
    //   pinInputs.forEach((input) => input.blur())
    // }

    pin = [
      (document.getElementById('pin-1') as HTMLInputElement)?.value || '',
      (document.getElementById('pin-2') as HTMLInputElement)?.value || '',
      (document.getElementById('pin-3') as HTMLInputElement)?.value || ''
    ]
  }

  const enhanceForm: SubmitFunction = ({ formData }) => {
    showLoader = true

    return async ({ result, update }) => {
      await update({ reset: false })
      showLoader = false

      if (result.type === 'failure') {
        const message = $l.notifications[result.data?.failure as NotificationCode] ?? $l.notifications.INTERNAL_SERVER_ERROR
        addNotification('ERROR', message)
      }

      await applyAction(result)
    }
  }
</script>

<svelte:head>
  <title>{$l.auth.register} • {env.name} AdminTool</title>
</svelte:head>

<form method="POST" action="?/register" use:enhance={enhanceForm}>
  {#if showLoader}
    <LoadingSplash transparent />
  {/if}

  <h2>{$l.auth.register}</h2>
  <p>{env.name} AdminTool</p>

  <label for="username">{$l.main.username}</label>
  <input type="text" id="username" name="username" bind:value={username} />

  <label for="password">{$l.main.password}</label>
  <input type="password" id="password" name="password" bind:value={password} autocomplete="new-password" />

  <label for="password-cfr">{$l.auth.confirmPassword}</label>
  <input type="password" id="password-cfr" name="password-cfr" bind:value={passwordCfr} autocomplete="new-password" />

  <div class="pin-inputs">
    <label for="pin-1" style="display: inline-block">{@html $l.main.pin + ($l.l == 'fr' ? ' :&nbsp;&nbsp;' : ':&nbsp;&nbsp')}</label>
    <input type="text" maxlength="1" size="1" id="pin-1" name="pin-1" onkeydown={handlePinInput} />
    <input type="text" maxlength="1" size="1" id="pin-2" name="pin-2" onkeydown={handlePinInput} />
    <input type="text" maxlength="1" size="1" id="pin-3" name="pin-3" onkeydown={handlePinInput} />
  </div>

  <button type="submit" class="primary" {disabled}>{$l.auth.register}</button>
  <p class="center">
    <a class="small-link" href="/login">{$l.auth.alreadyAnAccount}</a>
  </p>
</form>

<div class="footer-container">
  <Footer />
</div>

<style lang="scss">
  @use '../../../../static/scss/login.scss';

  div.pin-inputs {
    display: flex;
    align-items: center;
    margin-top: 20px;

    label {
      margin-right: 0.5rem;
      margin-bottom: 0;
    }

    input {
      margin-top: 0 !important;
    }
  }
</style>
