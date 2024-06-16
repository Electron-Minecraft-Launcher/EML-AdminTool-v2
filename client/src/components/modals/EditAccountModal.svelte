<script lang="ts">
  import ModalTemplate from './ModalTemplate.svelte'
  import type en from '../../assets/language/en'
  import type fr from '../../assets/language/fr'
  import type { Env } from '../../../../shared/models/data/env.model'
  import { env$, user$ } from '../../services/store'
  import type { User } from '../../../../shared/models/features/user.model'
  import apiAdminService from '../../services/api/api-admin.service'

  export let show: boolean

  let env!: Env
  let l: typeof en | typeof fr
  let user: User

  let name: string = ''
  let password: string = ''
  let passwordCfr: string = ''

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

  async function closeModal() {
    show = false
  }

  async function submit() {
    ;(await apiAdminService.putUser('me', { name, password })).subscribe({
      next: (res) => {
        user$.set(res.body.data?.user!)
        closeModal()
      },
    })
  }
</script>

<ModalTemplate size={'s'} bind:show>
  <form on:submit|preventDefault={submit}>
    <h2>Edit account information</h2>

    <p>Leave blank if you don't want to change.</p>

    <label for="name">{l.dashboard.account.newNameOrPseudo}</label>
    <input type="text" id="name" placeholder={l.dashboard.account.newNameOrPseudo} bind:value={name} />
    
    <label for="password">{l.dashboard.account.newPassword}</label>
    <input type="password" id="password" placeholder={l.dashboard.account.newPassword} bind:value={password} />
    
    <label for="password-cfr">{l.auth.confirmPassword}</label>
    <input type="password" id="password-cfr" placeholder={l.auth.confirmPassword} bind:value={passwordCfr} />

    <div class="actions">
      <button class="secondary" on:click={closeModal} type="button">{l.main.cancel}</button>
      <button class="primary" disabled={password != passwordCfr}>{l.main.save}</button>
    </div>
  </form>
</ModalTemplate>

<style lang="scss">
  @import '../../assets/scss/modals.scss';

  p.label {
    margin-top: 15px;
  }
</style>
