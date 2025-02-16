<script lang="ts">
  import type { PageData } from '../../routes/(authed)/dashboard/maintenance/$types'
  import apiMaintenanceService from '../../services/api/api-maintenance.service'
  import { l } from '../../services/store'
  import Toggle from '../Toggle.svelte'
  import ModalTemplate from './ModalTemplate.svelte'

  interface Props {
    data: PageData
    show: boolean
  }

  let { data = $bindable(), show = $bindable() }: Props = $props()

  let status: boolean = $state(false)
  let reason: string = $state('')
  let startDate: string = $state('')
  let endDate: string = $state('')

  function update() {
    status = data.maintenance.start_date != null
    startDate = data.maintenance.start_date ? formatDate(new Date(data.maintenance.start_date)) : ''
    endDate = data.maintenance.end_date ? formatDate(new Date(data.maintenance.end_date)) : ''
    reason = data.maintenance.reason || ''
  }

  function formatDate(date: Date) {
    if (!date) return ''
    let year = date.getFullYear()
    let month = ('0' + (date.getMonth() + 1)).slice(-2)
    let day = ('0' + date.getDate()).slice(-2)
    let hours = ('0' + date.getHours()).slice(-2)
    let minutes = ('0' + date.getMinutes()).slice(-2)
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  async function submit(e: SubmitEvent) {
    e.preventDefault()
    if (!status) {
      ;(await apiMaintenanceService.putMaintenanceStatus(null, null, '')).subscribe({
        next: (res) => {
          data.maintenance = res.body.data!
          show = false
        }
      })
    } else {
      ;(await apiMaintenanceService.putMaintenanceStatus(new Date(startDate), new Date(endDate), reason)).subscribe({
        next: (res) => {
          data.maintenance = res.body.data!
          show = false
        }
      })
    }
  }

  $effect(() => {
    if (show) update()
  })

  $effect(() => {
    if (!status) {
      startDate = ''
      endDate = ''
      reason = ''
    }
  })
</script>

<ModalTemplate size={'s'} bind:show>
  <form onsubmit={submit}>
    <h2>Change maintenance status</h2>

    <p class="label">Maintenance status</p>
    <Toggle bind:status></Toggle>

    <label for="start-date">
      Start date&nbsp;&nbsp;<i class="fa-solid fa-circle-question" title="Maintenance starts automatically on the date." style="cursor: help"></i>
    </label>
    <input type="datetime-local" name="start-date" id="start-date" bind:value={startDate} disabled={!status} />

    <label for="end-date">
      End date&nbsp;&nbsp;<i
        class="fa-solid fa-circle-question"
        title="Maintenance will NOT end on this date; this date is given as an indication for Launcher users.
You will need to disable maintenance manually."
        style="cursor: help"
      ></i>
    </label>
    <input type="datetime-local" name="end-date" id="end-date" bind:value={endDate} disabled={!status} />

    <label for="reason">Reason</label>
    <input type="text" name="reason" id="reason" placeholder="Maintenance..." bind:value={reason} disabled={!status} />

    <div class="actions">
      <button class="secondary" onclick={() => (show = false)} type="button">{$l.main.cancel}</button>
      <button class="primary">{$l.main.save}</button>
    </div>
  </form>
</ModalTemplate>

<style lang="scss">
  @use '../../assets/scss/modals.scss';

  p.label {
    margin-top: 15px;
  }
</style>
