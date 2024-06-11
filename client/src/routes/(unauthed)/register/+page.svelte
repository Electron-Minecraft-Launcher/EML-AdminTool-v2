<script lang="ts">
  import LoadingSplash from '$components/layouts/LoadingSplash.svelte'
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
    env = value
    l = value.language
  })

  let name: string = ''
  let password = ''
  let passwordCfr = ''
  let pin = ['', '', '']
  let splash: boolean = false

  async function submit() {
    splash = true
    ;(await apiAuth.postRegister(name + '', password + '', pin[0] + '' + pin[1] + '' + pin[2])).subscribe({
      next: async (res) => {
        cookies.add({
          name: 'JWT',
          value: res.body?.data?.jwt + '',
          expireDays: 30,
        })
        user$.set(res.body?.data?.user!)
        goto('/dashboard')
      },
      error: (err) => {
        splash = false
      },
    })
  }

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
  <title>{l.auth.register} • {env.name} AdminTool</title>
</svelte:head>

<form on:submit|preventDefault={submit}>
  {#if splash}
    <LoadingSplash transparent={true} />
  {/if}

  <h2>{l.auth.register}</h2>
  <p>{env.name} AdminTool</p>

  <label for="name">{l.main.username}</label>
  <input type="text" id="name" placeholder={l.main.username} bind:value={name} />
  
  <label for="password">{l.main.password}</label>
  <input type="password" id="password" placeholder={l.main.password} bind:value={password} />
  
  <label for="password-cfr">{l.auth.confirmPassword}</label>
  <input type="password" id="password-cfr" placeholder={l.auth.confirmPassword} bind:value={passwordCfr} />

  <label for="pin-1">{@html l.main.pin + (l.l == 'fr' ? ' :&nbsp;&nbsp;' : ':&nbsp;&nbsp')}</label>
  <input type="text" maxlength="1" size="1" id="pin-1" on:keyup={focusNext} bind:value={pin[0]} />
  <input type="text" maxlength="1" size="1" id="pin-2" on:keyup={focusNext} bind:value={pin[1]} />
  <input type="text" maxlength="1" size="1" id="pin-3" on:keyup={focusNext} bind:value={pin[2]} />

  <button class="primary" disabled={!name || !password || password != passwordCfr || !pin[0] || !pin[1] || !pin[2]}>
    {l.auth.register}
  </button>
  <p class="center">
    <a class="small-link" href="/login">{l.auth.alreadyAnAccount}</a>
  </p>
</form>

<style lang="scss">
  @import '../../../assets/scss/login.scss';
</style>
