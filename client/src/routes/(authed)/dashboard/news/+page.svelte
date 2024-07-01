<script lang="ts">
  import type { NewsCategory } from '../../../../../../shared/models/features/news.model'
  import News from '../../../../components/News.svelte'
  import NewsCategories from '../../../../components/NewsCategories.svelte'
  import { env } from '../../../../services/store'
  import type { PageData } from './$types'

  export let data: PageData

  let showAddEditCategoryModal = false
  let addEditCategoryAction: { action: 'add' } | { action: 'edit'; news: NewsCategory } = { action: 'add' }
</script>

<svelte:head>
  <title>News • {$env.name} AdminTool</title>
</svelte:head>

<h2>News</h2>

<section class="section">
  <h3>News list</h3>

  <News bind:data></News>
</section>

<section class="section">
  <button
    class="secondary right"
    on:click={() => {
      addEditCategoryAction = { action: 'add' }
      showAddEditCategoryModal = true
    }}
  >
    <i class="fa-solid fa-plus" />
  </button>

  <h3>Categories list</h3>

  <NewsCategories bind:data></NewsCategories>
</section>

<style lang="scss">
  @import '../../../../assets/scss/dashboard.scss';

  div.container button {
    display: inline-block;
    margin-top: 0;
    border-bottom: none;
    color: #1e1e1e;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 250px;
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
