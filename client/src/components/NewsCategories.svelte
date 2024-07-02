<script lang="ts">
  import { afterUpdate, onMount } from 'svelte'
  import { l } from '../services/store'
  import notificationsService from '../services/notifications.service'
  import type { News, NewsCategory } from '../../../shared/models/features/news.model'
  import type { PageData } from '../routes/(authed)/dashboard/news/$types'
  import apiNewsService from '../services/api/api-news.service'
  import AddEditNewsCategoryModal from './modals/AddEditNewsCategoryModal.svelte'
  import { invalidateAll } from '$app/navigation'

  export let data: PageData
  export let addEditCategoryAction: { action: 'add' } | { action: 'edit'; category: NewsCategory } = { action: 'add' }
  export let showAddEditCategoryModal = false


  function formatDate(date: Date) {
    const dateFormatter = new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    return dateFormatter.format(date)
  }

  async function deleteCategory(cat: NewsCategory) {
    if (!cat.id) return
    if (!confirm('Are you sure you want to delete the selected category?')) return
    ;(await apiNewsService.deleteCategory(cat.id || 0)).subscribe({
      next: (res) => {
        data.categories = res.body.data!
      }
    })
  }
</script>

<div class="categories">
  {#each data.categories as category}
    <div class="category">
      <button
        class="no-link"
        on:click={() => {
          addEditCategoryAction = { action: 'edit', category: category }
          showAddEditCategoryModal = true
        }}
      >
        <i class="fa-solid fa-tag"></i>&nbsp;&nbsp;{category.title} <span class="date">(created on {formatDate(new Date(category.date))})</span>
      </button>
      <button class="remove" on:click={() => deleteCategory(category)}><i class="fa-solid fa-trash"></i></button>
    </div>
  {/each}
</div>

{#if data.categories.length === 0}
  <p class="nothing">No category</p>
{/if}

<AddEditNewsCategoryModal bind:data bind:show={showAddEditCategoryModal} bind:action={addEditCategoryAction} />

<style lang="scss">
  div.categories {
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

  span.date {
    color: #909090;
  }
</style>
