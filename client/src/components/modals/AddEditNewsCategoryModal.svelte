<script lang="ts">
  import { invalidateAll } from '$app/navigation'
  import type { File } from '../../../../shared/models/features/file.model'
  import type { NewsCategory } from '../../../../shared/models/features/news.model'
  import type { PageData } from '../../routes/(authed)/dashboard/news/$types'
  import apiNewsService from '../../services/api/api-news.service'
  import { l } from '../../services/store'
  import utils from '../../services/utils'
  import ModalTemplate from './ModalTemplate.svelte'

  export let data: PageData
  export let show: boolean
  export let action: { action: 'add' } | { action: 'edit'; category: NewsCategory } = { action: 'add' }

  $: title = '' as string

  $: if (show) update()

  function update() {
    title = action.action === 'add' ? '' : action.category.title
  }

  async function submit() {
    if (action.action === 'add') {
      ;(await apiNewsService.postCategory({ title })).subscribe({
        next: (res) => {
          data.categories = res.body.data!
          show = false
        }
      })
    } else {
      ;(await apiNewsService.putCategory(action.category.id || 0, { title })).subscribe({
        next: (res) => {
          data.categories = res.body.data!
          show = false
        }
      })
    }
  }
</script>

<ModalTemplate size={'s'} bind:show>
  <form on:submit|preventDefault={submit}>
    <h2>{action.action === 'add' ? 'Create a category' : 'Edit the category'}</h2>

    <label for="name">Title</label>
    <input type="text" id="name" placeholder={action.action === 'add' ? 'Title' : title} bind:value={title} />

    <div class="actions">
      <button class="secondary" on:click={() => (show = false)} type="button">{$l.main.cancel}</button>
      <button class="primary" disabled={title.replaceAll(' ', '').replaceAll('.', '') === ''}>{$l.main.save}</button>
    </div>
  </form>
</ModalTemplate>

<style lang="scss">
  @import '../../assets/scss/modals.scss';

  p.label {
    margin-top: 15px;
  }
</style>
