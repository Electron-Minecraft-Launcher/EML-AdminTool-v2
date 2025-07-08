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

  /**
   * @link From https://codepen.io/oxcakmak/pen/QWeBKWj
   */
  function handlePinInput(e: KeyboardEvent) {
    const input = e.target as HTMLInputElement
    const key = e.keyCode

    if ((key < 48 || key > 57) && ![8, 46, 37, 39].includes(key)) {
      e.preventDefault()
      return false
    }

    if (key >= 48 && key <= 57) {
      // Numeric keys
      input.value = String.fromCharCode(key)
      const nextInput = input.nextElementSibling as HTMLInputElement | null
      if (nextInput) nextInput.focus()
      e.preventDefault()
    } else if (key === 8) {
      // Backspace
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
    } else if (key === 46) {
      // Delete
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
    } else if (key === 37) {
      const previousInput = input.previousElementSibling as HTMLInputElement | null
      if (previousInput) previousInput.focus()
      e.preventDefault()
    } else if (key === 39) {
      // Right arrow key
      const nextInput = input.nextElementSibling as HTMLInputElement | null
      if (nextInput) nextInput.focus()
      e.preventDefault()
    }

    const pinInputs = Array.from(document.querySelectorAll<HTMLInputElement>('div.pin-inputs input[type="text"]'))
    if (pinInputs.every((input) => input.value !== '')) {
      pinInputs.forEach((input) => input.blur())
    }
  }

  const enhanceForm: SubmitFunction = ({ formData }) => {
    showLoader = true

    return async ({ result, update }) => {
      update({ reset: false })
      showLoader = false

      if (result.type === 'failure') {
        const message = $l.notifications[result.data?.failure as NotificationCode] ?? $l.notifications.INTERNAL_SERVER_ERROR
        addNotification('ERROR', message)
      } else if (result.type === 'success') {
        showLoader = false
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
    <LoadingSplash transparent={true} />
  {/if}

  <h2>{$l.auth.register}</h2>
  <p>{env.name} AdminTool</p>

  <input type="hidden" name="form-token" value={data.formToken} style="display: none" />

  <label for="name">{$l.main.username}</label>
  <input type="text" id="name" bind:value={username} />

  <label for="password">{$l.main.password}</label>
  <input type="password" id="password" name="password" bind:value={password} autocomplete="new-password" />

  <label for="password-cfr">{$l.auth.confirmPassword}</label>
  <input type="password" id="password-cfr" name="password-cfr" bind:value={passwordCfr} autocomplete="new-password" />

  <div class="pin-inputs">
    <label for="pin-1" style="display: inline-block">{@html $l.main.pin + ($l.l == 'fr' ? ' :&nbsp;&nbsp;' : ':&nbsp;&nbsp')}</label>
    <input type="text" maxlength="1" size="1" id="pin-1" name="pin-1" onkeydown={handlePinInput} bind:value={pin[0]} />
    <input type="text" maxlength="1" size="1" id="pin-2" name="pin-2" onkeydown={handlePinInput} bind:value={pin[1]} />
    <input type="text" maxlength="1" size="1" id="pin-3" name="pin-3" onkeydown={handlePinInput} bind:value={pin[2]} />
  </div>

  <button class="primary" disabled={!username || !password || password != passwordCfr || !pin[0] || !pin[1] || !pin[2]}>
    {$l.auth.register}
  </button>
  <p class="center">
    <a class="small-link" href="/login">{$l.auth.alreadyAnAccount}</a>
  </p>
</form>

<style lang="scss">
  @use '../../../../assets/scss/login.scss';

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
