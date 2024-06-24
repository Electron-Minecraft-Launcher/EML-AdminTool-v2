<script lang="ts">
  import type { File } from '../../../../shared/models/features/filesupdater.model'
  import type { PageData } from '../../routes/(authed)/dashboard/files-updater/$types'
  import apiFilesUpdaterService from '../../services/api/api-filesupdater.service'
  import { l } from '../../services/store'
  import utils from '../../services/utils'
  import ModalTemplate from './ModalTemplate.svelte'

  export let data: PageData
  export let show: boolean
  export let selectedItems: File[]

  $: path = '' as string
  $: name = '' as string
  $: type = '' as string
  $: newName = '' as string

  $: if (show) update()

  function update() {
    path = selectedItems[0].path
    name = selectedItems[0].name
    type = selectedItems[0].type
    newName = selectedItems[0].name
  }

  async function submit() {
    newName = utils.removeUnwantedFilenameChars(newName)
    ;(await apiFilesUpdaterService.renameFile(`${path}${name}`, `${path}${newName}`)).subscribe({
      next: (res) => {
        data.files = res.body.data!
        show = false
      }
    })
  }
</script>

<ModalTemplate size={'s'} bind:show>
  <form on:submit|preventDefault={submit}>
    <h2>Rename {type === 'FOLDER' ? 'folder' : 'file'}</h2>

    <label for="name">Files Updater/{path}</label>
    <input type="text" id="name" placeholder={name} bind:value={newName} on:keyup={() => newName = utils.removeUnwantedFilenameChars(newName)} />

    <div class="actions">
      <button class="secondary" on:click={() => (show = false)} type="button">{$l.main.cancel}</button>
      <button class="primary" disabled={newName.replaceAll(' ', '').replaceAll('.', '') === ''}>{$l.main.save}</button>
    </div>
  </form>
</ModalTemplate>

<style lang="scss">
  @import '../../assets/scss/modals.scss';

  p.label {
    margin-top: 15px;
  }
</style>
