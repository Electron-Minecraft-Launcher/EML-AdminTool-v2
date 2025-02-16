<script lang="ts">
  import type { NewsCategory } from '../../../../shared/types/features/news'
  import type { PageData } from '../../routes/(authed)/dashboard/news/$types'
  import apiNewsService from '../../services/api/api-news.service'
  import { l } from '../../services/store'
  import ModalTemplate from './ModalTemplate.svelte'

  interface Props {
    data: PageData
    show: boolean
    action?: { action: 'add' } | { action: 'edit'; category: NewsCategory }
  }

  let { data = $bindable(), show = $bindable(), action = $bindable({ action: 'add' }) }: Props = $props()

  function update() {
    title = action.action === 'add' ? '' : action.category.title
  }

  async function submit(e: SubmitEvent) {
    e.preventDefault()
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

  let title = $state('' as string)

  $effect(() => {
    if (show) update()
  })
</script>

<ModalTemplate size={'s'} bind:show>
  <form onsubmit={submit}>
    <h2>{action.action === 'add' ? 'Create a category' : 'Edit the category'}</h2>

    <label for="name">Title</label>
    <input type="text" id="name" placeholder={action.action === 'add' ? 'Title' : title} bind:value={title} />

    <div class="actions">
      <button class="secondary" onclick={() => (show = false)} type="button">{$l.main.cancel}</button>
      <button class="primary" disabled={title.replaceAll(' ', '').replaceAll('.', '') === ''}>{$l.main.save}</button>
    </div>
  </form>
</ModalTemplate>

<style lang="scss">
  @use '../../assets/scss/modals.scss';

  p.label {
    margin-top: 15px;
  }
</style>
