<script lang="ts">
  import ChangeMaintenanceStatusModal from '../../../../components/modals/ChangeMaintenanceStatusModal.svelte'
  import apiMaintenanceService from '../../../../services/api/api-maintenance.service'
  import { env } from '../../../../services/store'
  import type { PageData } from './$types'

  export let data: PageData

  let showUploadBackgroundModal = false
</script>

<svelte:head>
  <title>Backgrounds • {$env.name} AdminTool</title>
</svelte:head>

<h2>Backgrounds</h2>

<section class="section">
  <h3>Backgrounds list</h3>

  <div class="container">
    <div>
      
    </div>
  </div>
</section>

<!-- <ChangeMaintenanceStatusModal bind:data bind:show={showChangeMaintenanceStatusModal}></ChangeMaintenanceStatusModal> -->

<style lang="scss">
  @import '../../../../assets/scss/dashboard.scss';

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
