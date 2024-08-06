<script lang="ts">
  import { invalidateAll } from '$app/navigation'
  import type { NewsTag } from '../../../../shared/types/features/news'
  import type { PageData } from '../../routes/(authed)/dashboard/news/$types'
  import apiNewsService from '../../services/api/api-news.service'
  import { l } from '../../services/store'
  import utils from '../../services/utils'
  import ModalTemplate from './ModalTemplate.svelte'

  export let data: PageData
  export let show: boolean
  export let action: { action: 'add' } | { action: 'edit'; tag: NewsTag } = { action: 'add' }

  $: title = '' as string
  $: color = '' as string

  $: if (show) update()

  function update() {
    title = action.action === 'add' ? '' : action.tag.title
    color = action.action === 'add' ? '' : action.tag.color
  }

  async function submit() {
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
</script>

<ModalTemplate size={'s'} bind:show>
  <form on:submit|preventDefault={submit}>
    <h2>{action.action === 'add' ? 'Create a tag' : 'Edit the tag'}</h2>

    <label for="name">Title</label>
    <input type="text" id="name" placeholder={action.action === 'add' ? 'Title' : title} bind:value={title} />
    
    <label for="color">Color&nbsp;&nbsp;<i class="fa-solid fa-question-circle" style="cursor: help" title="You should use a dark color to make it readable."></i></label>
    <input type="color" id="color" bind:value={color} />

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

  input[type="color"] {
    width: 100%;
    height: 40px;
    padding: 7px 10px;
  }
</style>
