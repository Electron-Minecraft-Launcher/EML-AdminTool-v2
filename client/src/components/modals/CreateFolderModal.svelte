<script lang="ts">
  import type { PageData } from '../../routes/(authed)/dashboard/files-updater/$types'
  import apiFilesUpdaterService from '../../services/api/api-filesupdater.service'
  import { l } from '../../services/store'
  import utils from '../../services/utils'
  import ModalTemplate from './ModalTemplate.svelte'

  interface Props {
    data: PageData
    dataFiles: PageData['files']
    show: boolean
    currentPath: string
  }

  let { data = $bindable(), dataFiles = $bindable(), show = $bindable(), currentPath = $bindable() }: Props = $props()

  let name: string = $state('')

  function update() {
    name = ''
  }

  async function submit(e: SubmitEvent) {
    e.preventDefault()
    name = utils.removeUnwantedFilenameChars(name)
    ;(await apiFilesUpdaterService.uploadFiles(`${currentPath}${name}/`, [])).subscribe({
      next: (res) => {
        data.files = res.body.data!
        show = false
      }
    })
  }

  $effect(() => {
    if (show) update()
  })
</script>

<ModalTemplate size={'s'} bind:show>
  <form onsubmit={submit}>
    <h2>New folder</h2>

    <label for="name">Files Updater/{currentPath}</label>
    <input type="text" id="name" placeholder="New folder" bind:value={name} onkeyup={() => (name = utils.removeUnwantedFilenameChars(name))} />

    <div class="actions">
      <button class="secondary" onclick={() => (show = false)} type="button">{$l.main.cancel}</button>
      <button class="primary" disabled={name.replaceAll(' ', '').replaceAll('.', '') === ''}>{$l.main.save}</button>
    </div>
  </form>
</ModalTemplate>

<style lang="scss">
  @use '../../assets/scss/modals.scss';

  p.label {
    margin-top: 15px;
  }
</style>
