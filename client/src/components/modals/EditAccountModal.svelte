<script lang="ts">
  import ModalTemplate from './ModalTemplate.svelte'
  import { user, l } from '../../services/store'
  import apiAdminService from '../../services/api/api-admin.service'

  interface Props {
    show: boolean
  }

  let { show = $bindable() }: Props = $props()

  let name: string = $state('')
  let password: string = $state('')
  let passwordCfr: string = $state('')

  async function submit(e: SubmitEvent) {
    e.preventDefault()
    ;(await apiAdminService.putUser('me', { name, password })).subscribe({
      next: (res) => {
        user.set(res.body.data?.user!)
        show = false
      }
    })
  }
</script>

<ModalTemplate size={'s'} bind:show>
  <form onsubmit={submit}>
    <h2>{$l.dashboard.account.editAccount}</h2>

    <p>{$l.dashboard.account.leaveBlank}</p>

    <label for="name">{$l.dashboard.account.newNameOrPseudo}</label>
    <input type="text" id="name" placeholder={$l.dashboard.account.newNameOrPseudo} bind:value={name} />

    <label for="password">{$l.dashboard.account.newPassword}</label>
    <input type="password" id="password" placeholder={$l.dashboard.account.newPassword} bind:value={password} />

    <label for="password-cfr">{$l.auth.confirmPassword}</label>
    <input type="password" id="password-cfr" placeholder={$l.auth.confirmPassword} bind:value={passwordCfr} />

    <div class="actions">
      <button class="secondary" onclick={() => (show = false)} type="button">{$l.main.cancel}</button>
      <button class="primary" disabled={password != passwordCfr}>{$l.main.save}</button>
    </div>
  </form>
</ModalTemplate>

<style lang="scss">
  @use '../../assets/scss/modals.scss';

  p.label {
    margin-top: 15px;
  }
</style>
