<script lang="ts">
  import type { File } from '../../../../shared/types/features/file'
  import type { PageData } from '../../routes/(authed)/dashboard/files-updater/$types'
  import apiFilesUpdaterService from '../../services/api/api-filesupdater.service'
  import notificationsService from '../../services/notifications.service'
  import { l } from '../../services/store'
  import utils from '../../services/utils'
  import ModalTemplate from './ModalTemplate.svelte'

  interface Props {
    data: PageData
    show: boolean
    selectedItems: File[]
    getData: () => void
  }

  let { data = $bindable(), show = $bindable(), selectedItems = $bindable(), getData }: Props = $props()

  let path: string = $state('')
  let name: string = $state('')
  let type: string = $state('')
  let newName: string = $state('')

  function update() {
    path = selectedItems[0].path
    name = selectedItems[0].name
    type = selectedItems[0].type
    newName = selectedItems[0].name
  }

  async function submit(e: SubmitEvent) {
    e.preventDefault()
    newName = utils.removeUnwantedFilenameChars(newName)
    ;(await apiFilesUpdaterService.renameFile(`${path}${name}`, `${path}${newName}`)).subscribe({
      next: (res) => {
        data.files = res.body.data!
        show = false
      },
      error: (err) => {
        show = false
        notificationsService.update({ type: 'ERROR', code: 'rename' })
        getData()
      }
    })
  }

  $effect(() => {
    if (show) update()
  })
</script>

<ModalTemplate size={'s'} bind:show>
  <form onsubmit={submit}>
    <h2>Rename {type === 'FOLDER' ? 'folder' : 'file'}</h2>

    <label for="name">Files Updater/{path}</label>
    <input type="text" id="name" placeholder={name} bind:value={newName} onkeyup={() => (newName = utils.removeUnwantedFilenameChars(newName))} />

    <div class="actions">
      <button class="secondary" onclick={() => (show = false)} type="button">{$l.main.cancel}</button>
      <button class="primary" disabled={newName.replaceAll(' ', '').replaceAll('.', '') === ''}>{$l.main.save}</button>
    </div>
  </form>
</ModalTemplate>

<style lang="scss">
  @use '../../assets/scss/modals.scss';

  p.label {
    margin-top: 15px;
  }
</style>
