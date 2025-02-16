<script lang="ts">
  import type { NewsTag } from '../../../../shared/types/features/news'
  import type { PageData } from '../../routes/(authed)/dashboard/news/$types'
  import apiNewsService from '../../services/api/api-news.service'
  import { l } from '../../services/store'
  import ModalTemplate from './ModalTemplate.svelte'

  interface Props {
    data: PageData
    show: boolean
    action?: { action: 'add' } | { action: 'edit'; tag: NewsTag }
  }

  let { data = $bindable(), show = $bindable(), action = $bindable({ action: 'add' }) }: Props = $props()

  let title: string = $state('')
  let color: string = $state('')

  function update() {
    title = action.action === 'add' ? '' : action.tag.title
    color = action.action === 'add' ? '' : action.tag.color
  }

  async function submit(e: SubmitEvent) {
    e.preventDefault()
    if (action.action === 'add') {
      ;(await apiNewsService.postTag({ title, color })).subscribe({
        next: (res) => {
          data.tags = res.body.data!
          show = false
        }
      })
    } else {
      ;(await apiNewsService.putTag(action.tag.id || 0, { title, color })).subscribe({
        next: (res) => {
          data.tags = res.body.data!
          show = false
        }
      })
    }
  }

  $effect(() => {
    if (show) update()
  })
</script>

<ModalTemplate size={'s'} bind:show>
  <form onsubmit={submit}>
    <h2>{action.action === 'add' ? 'Create a tag' : 'Edit the tag'}</h2>

    <label for="name">Title</label>
    <input type="text" id="name" placeholder={action.action === 'add' ? 'Title' : title} bind:value={title} />

    <label for="color">
      Color&nbsp;&nbsp;<i class="fa-solid fa-question-circle" style="cursor: help" title="You should use a dark color to make it readable."></i>
    </label>
    <input type="color" id="color" bind:value={color} />

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

  input[type='color'] {
    width: 100%;
    height: 40px;
    padding: 7px 10px;
  }
</style>
