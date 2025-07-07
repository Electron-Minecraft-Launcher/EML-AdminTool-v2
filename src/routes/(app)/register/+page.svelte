<script lang="ts">
  import { l } from '$lib/stores/language'
  import LoadingSplash from '../../../components/layouts/LoadingSplash.svelte'
  import type { PageProps } from './$types'
  import getEnv from '$lib/utils/env'
  import Footer from '../../../components/layouts/Footer.svelte'

  let { data }: PageProps = $props()

  const env = getEnv()

  let showLoader = $state(false)

  let username = $state('')
  let password = $state('')
  let passwordCfr = $state('')
  let pin = $state(['', '', ''])

  function focusNext(e: KeyboardEvent) {
    const input = e.target as HTMLInputElement
    const n = +input.id.split('-')[1]

    if (!/^[0-9]+$/.test(input.value) && input.value != '') {
      input.value = ''
      return
    }
    if (input.value.length == 1) {
      var nextInput = document.querySelector<HTMLInputElement>('input#pin-' + (n + 1))
      if (nextInput) {
        nextInput.focus()
      }
      return
    }
    if (e.keyCode == 8 || e.keyCode == 46) {
      if (input.value == '') {
        var previousInput = document.querySelector<HTMLInputElement>('input#pin-' + (n - 1))
        if (previousInput) {
          previousInput.focus()
        }
      }
      return
    }
  }
</script>

<svelte:head>
  <title>{$l.auth.register} • {env.name} AdminTool</title>
</svelte:head>

<form>
  {#if showLoader}
    <LoadingSplash transparent={true} />
  {/if}

  <h2>{$l.auth.register}</h2>
  <p>{env.name} AdminTool</p>

  <label for="name">{$l.main.username}</label>
  <input type="text" id="name" bind:value={username} />

  <label for="password">{$l.main.password}</label>
  <input type="password" id="password" bind:value={password} autocomplete="new-password" />

  <label for="password-cfr">{$l.auth.confirmPassword}</label>
  <input type="password" id="password-cfr" bind:value={passwordCfr} autocomplete="new-password" />

  <div class="pin-inputs">
    <label for="pin-1" style="display: inline-block">{@html $l.main.pin + ($l.l == 'fr' ? ' :&nbsp;&nbsp;' : ':&nbsp;&nbsp')}</label>
    <input type="text" maxlength="1" size="1" id="pin-1" onkeyup={focusNext} bind:value={pin[0]} />
    <input type="text" maxlength="1" size="1" id="pin-2" onkeyup={focusNext} bind:value={pin[1]} />
    <input type="text" maxlength="1" size="1" id="pin-3" onkeyup={focusNext} bind:value={pin[2]} />
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
