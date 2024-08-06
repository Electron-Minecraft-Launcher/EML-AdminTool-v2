<script lang="ts">
  import type { PageData } from '../../routes/(authed)/dashboard/files-updater/$types'
  import apiFilesUpdaterService from '../../services/api/api-filesupdater.service'
  import { l } from '../../services/store'
  import utils from '../../services/utils'
  import ModalTemplate from './ModalTemplate.svelte'

  export let data: PageData
  export let show: boolean
  export let currentPath: string

  $: name = '' as string

  $: if (show) update()

  function update() {
    name = ''
  }

  async function submit() {
    name = utils.removeUnwantedFilenameChars(name)
    ;(await apiFilesUpdaterService.uploadFiles(`${currentPath}${name}/`, [])).subscribe({
      next: (res) => {
        data.files = res.body.data!
        show = false
      }
    })
  }
</script>

<ModalTemplate size={'s'} bind:show>
  <form on:submit|preventDefault={submit}>
    <h2>New folder</h2>

    <label for="name">Files Updater/{currentPath}</label>
    <input type="text" id="name" placeholder="New folder" bind:value={name} on:keyup={() => name = utils.removeUnwantedFilenameChars(name)} />

    <div class="actions">
      <button class="secondary" on:click={() => (show = false)} type="button">{$l.main.cancel}</button>
      <button class="primary" disabled={name.replaceAll(' ', '').replaceAll('.', '') === ''}>{$l.main.save}</button>
    </div>
  </form>
</ModalTemplate>

<style lang="scss">
  @import '../../assets/scss/modals.scss';

  p.label {
    margin-top: 15px;
  }
</style>
