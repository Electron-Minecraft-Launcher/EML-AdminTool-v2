<script lang="ts">
  import type { NewsCategory } from '../../../shared/types/features/news'
  import type { PageData } from '../routes/(authed)/dashboard/news/$types'
  import apiNewsService from '../services/api/api-news.service'
  import AddEditNewsCategoryModal from './modals/AddEditNewsCategoryModal.svelte'

  interface Props {
    data: PageData
    addEditCategoryAction?: { action: 'add' } | { action: 'edit'; category: NewsCategory }
    showAddEditCategoryModal?: boolean
  }

  let { data = $bindable(), addEditCategoryAction = $bindable({ action: 'add' }), showAddEditCategoryModal = $bindable(false) }: Props = $props()

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
        onclick={() => {
          addEditCategoryAction = { action: 'edit', category: category }
          showAddEditCategoryModal = true
        }}
      >
        <i class="fa-solid fa-tag"></i>&nbsp;&nbsp;{category.title} <span class="date">(created on {formatDate(new Date(category.date))})</span>
      </button>
      <!-- svelte-ignore a11y_consider_explicit_label -->
      <button class="remove" onclick={() => deleteCategory(category)}><i class="fa-solid fa-trash"></i></button>
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
