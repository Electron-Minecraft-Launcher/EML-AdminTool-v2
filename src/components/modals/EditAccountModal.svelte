<script lang="ts">
  import { applyAction, enhance } from '$app/forms'
  import type { SubmitFunction } from '@sveltejs/kit'
  import ModalTemplate from './__ModalTemplate.svelte'
  import { NotificationCode } from '$lib/utils/notifications'
  import { addNotification } from '$lib/stores/notifications'
  import { l } from '$lib/stores/language'
  import LoadingSplash from '../layouts/LoadingSplash.svelte'
  import getUser from '$lib/utils/user'

  interface Props {
    show: boolean
  }

  let { show = $bindable() }: Props = $props()

  const user = getUser()

  let showLoader = $state(false)
  let username: string = $state(user.username)
  let password: string = $state('')
  let passwordCfr: string = $state('')

  let disabled = $derived.by(() => {
    return !username || (password != '' && password !== passwordCfr)
  })

  const enhanceForm: SubmitFunction = ({ formData }) => {
    showLoader = true

    return async ({ result, update }) => {
      update({ reset: false })
      showLoader = false

      if (result.type === 'failure') {
        const message = $l.notifications[result.data?.failure as NotificationCode] ?? $l.notifications.INTERNAL_SERVER_ERROR
        addNotification('ERROR', message)
      } else if (result.type === 'success') {
        show = false
        window.location.reload()
      }

      await applyAction(result)
    }
  }
</script>

<ModalTemplate size={'s'} bind:show>
  {#if showLoader}
    <LoadingSplash transparent />
  {/if}

  <form method="POST" action="?/edit" use:enhance={enhanceForm}>
    <h2>{$l.dashboard.account.editAccount}</h2>

    <p>{$l.dashboard.account.leaveBlank}</p>

    <label for="username">{$l.main.username}</label>
    <input type="text" id="username" name="username" bind:value={username} autocomplete="username" />
    {#if user.isAdmin}
      <p class="warn">{$l.dashboard.account.usernameWarn}</p>
    {/if}

    <label for="password">{$l.dashboard.account.newPassword}</label>
    <input type="password" id="password" name="password" bind:value={password} autocomplete="new-password" />

    <label for="password-cfr">{$l.auth.confirmPassword}</label>
    <input type="password" id="password-cfr" bind:value={passwordCfr} autocomplete="new-password" />

    <div class="actions">
      <button type="button" class="secondary" onclick={() => (show = false)}>{$l.main.cancel}</button>
      <button type="submit" class="primary" {disabled}>{$l.main.save}</button>
    </div>
  </form>
</ModalTemplate>

<style lang="scss">
  @use '../../assets/scss/modals.scss';

  p.warn {
    margin: 5px 0 0 0;
    color: #fa5650;
    font-size: 12px;
  }

  p.label {
    margin-top: 15px;
  }
</style>
