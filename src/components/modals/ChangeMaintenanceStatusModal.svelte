<script lang="ts">
  import ModalTemplate from './__ModalTemplate.svelte'
  import Toggle from '../layouts/Toggle.svelte'
  import { l } from '$lib/stores/language'
  import { enhance } from '$app/forms'
  import type { SubmitFunction } from '@sveltejs/kit'
  import { applyAction } from '$app/forms'
  import { addNotification } from '$lib/stores/notifications'
  import { NotificationCode } from '$lib/utils/notifications'
  import LoadingSplash from '../layouts/LoadingSplash.svelte'
  import { DateTime } from 'luxon'

  interface Props {
    maintenance: { startTime: Date | null; endTime: Date | null; message?: string }
    show: boolean
  }

  let { maintenance, show = $bindable() }: Props = $props()

  const startDateInfo = 'Maintenance starts automatically on the date.'
  const endDateInfo = `Maintenance will NOT end on this date; this date is given as an indication for Launcher users.
You will need to disable maintenance manually.`

  let showLoader = $state(false)

  let status = $state(Boolean(maintenance.startTime))
  let message = $state(maintenance.message ?? '')
  let startTime = $state(maintenance.startTime ? new Date(maintenance.startTime).formatDateInput() : '')
  let endTime = $state(maintenance.endTime ? new Date(maintenance.endTime).formatDateInput() : '')

  $effect(() => {
    if (!status) {
      startTime = ''
      endTime = ''
      message = ''
    }
  })

  const enhanceForm: SubmitFunction = ({ formData }) => {
    showLoader = true
    const utcStartTime = DateTime.fromISO(startTime, { zone: 'local' }).toUTC().toISO() ?? ''
    const utcEndTime = DateTime.fromISO(endTime, { zone: 'local' }).toUTC().toISO() ?? ''
    formData.set('start-time', utcStartTime)
    formData.set('end-time', utcEndTime)

    return async ({ result, update }) => {
      await update({ reset: false })
      showLoader = false

      if (result.type === 'failure') {
        const message = $l.notifications[result.data?.failure as NotificationCode] ?? $l.notifications.INTERNAL_SERVER_ERROR
        addNotification('ERROR', message)
      } else if (result.type === 'success') {
        show = false
      }

      await applyAction(result)
    }
  }
</script>

<ModalTemplate size={'s'} bind:show>
  {#if showLoader}
    <LoadingSplash transparent />
  {/if}

  <form method="POST" action="?/changeMaintenanceStatus" use:enhance={enhanceForm}>
    <h2>Change maintenance status</h2>

    <p class="label">Maintenance status</p>
    <Toggle bind:status />

    <label for="start-time">
      Start time ({DateTime.local().zoneName} time)&nbsp;&nbsp;<i class="fa-solid fa-circle-question" title={startDateInfo} style="cursor: help"></i>
    </label>
    <input type="datetime-local" name="start-time" id="start-time" bind:value={startTime} disabled={!status} />

    <label for="end-time">
      End time ({DateTime.local().zoneName} time)&nbsp;&nbsp;<i class="fa-solid fa-circle-question" title={endDateInfo} style="cursor: help"></i>
    </label>
    <input type="datetime-local" name="end-time" id="end-time" bind:value={endTime} disabled={!status} />

    <label for="message">Reason</label>
    <input type="text" name="message" id="message" bind:value={message} disabled={!status} />

    <div class="actions">
      <button type="button" class="secondary" onclick={() => (show = false)}>{$l.common.cancel}</button>
      <button type="submit" class="primary">{$l.common.save}</button>
    </div>
  </form>
</ModalTemplate>

<style lang="scss">
  @use '../../../static/scss/modals.scss';

  p.label {
    margin-top: 15px;
  }
</style>
