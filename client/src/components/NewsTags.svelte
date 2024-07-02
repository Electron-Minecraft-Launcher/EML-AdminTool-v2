<script lang="ts">
  import { afterUpdate, onMount } from 'svelte'
  import { l } from '../services/store'
  import notificationsService from '../services/notifications.service'
  import type { News, NewsTag } from '../../../shared/models/features/news.model'
  import type { PageData } from '../routes/(authed)/dashboard/news/$types'
  import apiNewsService from '../services/api/api-news.service'
  import AddEditNewsTagModal from './modals/AddEditNewsTagModal.svelte'
  import { invalidateAll } from '$app/navigation'

  export let data: PageData
  export let addEditTagAction: { action: 'add' } | { action: 'edit'; tag: NewsTag } = { action: 'add' }
  export let showAddEditTagModal = false

  function backgroundColor(color: string) {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, 0.1)`
  }

  async function deleteTag(tag: NewsTag) {
    if (!tag.id) return
    if (!confirm('Are you sure you want to delete the selected tag?')) return
    ;(await apiNewsService.deleteTag(tag.id || 0)).subscribe({
      next: (res) => {
        data.tags = res.body.data!
      }
    })
  }
</script>

<div class="tags">
  {#each data.tags as tag}
    <div class="category">
      <button
        class="no-link"
        on:click={() => {
          addEditTagAction = { action: 'edit', tag: tag }
          showAddEditTagModal = true
        }}
        style="color: {tag.color}; background-color: {backgroundColor(tag.color)}"
      >
        <i class="fa-solid fa-hashtag"></i>&nbsp;&nbsp;{tag.title}
      </button>
      <button class="remove" on:click={() => deleteTag(tag)}><i class="fa-solid fa-trash"></i></button>
    </div>
  {/each}
</div>

{#if data.tags.length === 0}
  <p class="nothing">No tags</p>
{/if}

<AddEditNewsTagModal bind:data bind:show={showAddEditTagModal} bind:action={addEditTagAction} />

<style lang="scss">
  div.tags {
    margin-top: 30px;
    display: flex;
    gap: 30px;
  }

  p.nothing {
    text-align: center;
    margin-top: 15px;
    color: #606060;
  }

  button {
    display: inline-block;
    margin-top: 0;
    border-bottom: none;
    color: #1e1e1e;
    position: relative;
    vertical-align: bottom;
    font-family: 'Poppins';
    background: none;
    line-height: 15px;

    &:hover {
      background: #eeeeee;
    }

    &.remove {
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
</style>
