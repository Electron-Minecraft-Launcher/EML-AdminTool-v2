<script lang="ts">
  import ChangeMaintenanceStatusModal from '../../../../components/modals/ChangeMaintenanceStatusModal.svelte'
  import apiMaintenanceService from '../../../../services/api/api-maintenance.service'
  import { env } from '../../../../services/store'
  import type { PageData } from './$types'

  interface Props {
    data: PageData
  }

  let { data = $bindable() }: Props = $props()

  let showChangeMaintenanceStatusModal = $state(false)

  async function turnMaintenanceOff() {
    ;(await apiMaintenanceService.putMaintenanceStatus(null, null, '')).subscribe({
      next: (res) => {
        data.maintenance = res.body.data!
      }
    })
  }

  function formatDate(date: Date) {
    const dateFormatter = new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    return dateFormatter.format(date)
  }
</script>

<svelte:head>
  <title>Maintenance • {$env.name} AdminTool</title>
</svelte:head>

<h2>Maintenance</h2>

<section class="section">
  <!-- svelte-ignore a11y_consider_explicit_label -->
  <button class="secondary right" onclick={() => (showChangeMaintenanceStatusModal = true)}><i class="fa-solid fa-ellipsis"></i></button>

  <h3>Maintenance status</h3>

  <div class="container">
    <div>
      <p class="label">Status</p>
      {#if data.maintenance.start_date == null}
        <p class="no-link off">OFF</p>
        <button class="off" onclick={() => (showChangeMaintenanceStatusModal = true)}>
          <i class="fa-solid fa-power-off"></i>&nbsp;&nbsp;Turn on...
        </button>
      {:else}
        <p class="no-link on">ON</p>
        <button class="on" onclick={turnMaintenanceOff}><i class="fa-solid fa-power-off"></i>&nbsp;&nbsp;Turn off</button>
      {/if}
    </div>

    <div>
      <p class="label">
        Start date&nbsp;&nbsp;<i class="fa-solid fa-circle-question" title="Maintenance starts automatically on the date." style="cursor: help"></i>
      </p>
      {#if data.maintenance.start_date != null}
        <p class="no-link">{formatDate(new Date(data.maintenance.start_date))}</p>
      {:else}
        <p class="no-link">-</p>
      {/if}
    </div>

    <div>
      <p class="label">
        End date&nbsp;&nbsp;<i
          class="fa-solid fa-circle-question"
          title="Maintenance will NOT end on this date; this date is given as an indication for Launcher users.
You will need to disable maintenance manually."
          style="cursor: help"
        ></i>
      </p>
      {#if data.maintenance.end_date != null}
        <p class="no-link">{formatDate(new Date(data.maintenance.end_date))}</p>
      {:else if data.maintenance.start_date != null}
        <p class="no-link">Undefined</p>
      {:else}
        <p class="no-link">-</p>
      {/if}
    </div>

    <div>
      <p class="label">Reason</p>
      {#if data.maintenance.reason && data.maintenance.reason.length > 0}
        <p class="no-link">{data.maintenance.reason}</p>
      {:else}
        <p class="no-link">-</p>
      {/if}
    </div>
  </div>
</section>

<ChangeMaintenanceStatusModal bind:data bind:show={showChangeMaintenanceStatusModal}></ChangeMaintenanceStatusModal>

<style lang="scss">
  @use '../../../../assets/scss/dashboard.scss';

  div.container button {
    display: inline-block;
    margin-top: 0;
    border-bottom: none;
    color: #1e1e1e;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 250px;
    vertical-align: bottom;
    font-family: 'Poppins';
    background: none;
    line-height: 15px;

    &:hover {
      background: #eeeeee;
    }

    &.off {
      display: inline-block;
      border-bottom: none;
      margin-left: 5px;
      position: relative;
      background: none;
      color: rgb(24, 170, 24);
      vertical-align: middle;

      &:hover {
        background: #eefaee;
      }
    }

    &.on {
      display: inline-block;
      border-bottom: none;
      margin-left: 5px;
      position: relative;
      background: none;
      color: var(--red-color);
      vertical-align: middle;

      &:hover {
        background: #faeeee;
      }
    }
  }

  p.no-link {
    margin: 0px;
    display: inline-block;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
  }
</style>
