<script lang="ts">
  import type { NewsCategory, NewsTag } from '../../../../../../shared/types/features/news'
  import News from '../../../../components/News.svelte'
  import NewsCategories from '../../../../components/NewsCategories.svelte'
  import NewsTags from '../../../../components/NewsTags.svelte'
  import { env, user } from '../../../../services/store'
  import type { PageData } from './$types'

  interface Props {
    data: PageData
  }

  let { data = $bindable() }: Props = $props()

  let data_: PageData = $state(data)
  let showAddEditCategoryModal = $state(false)
  let addEditCategoryAction: { action: 'add' } | { action: 'edit'; category: NewsCategory } = $state({ action: 'add' })

  let showAddEditTagModal = $state(false)
  let addEditTagAction: { action: 'add' } | { action: 'edit'; tag: NewsTag } = $state({ action: 'add' })
</script>

<svelte:head>
  <title>News • {$env.name} AdminTool</title>
</svelte:head>

<h2>News</h2>

<section class="section">
  <h3>News list</h3>

  <News bind:data={data_}></News>
</section>

{#if $user.p_news_categories_add_mod_del == 1}
  <section class="section">
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button
      class="secondary right"
      onclick={() => {
        addEditCategoryAction = { action: 'add' }
        showAddEditCategoryModal = true
      }}
    >
      <i class="fa-solid fa-plus"></i>
    </button>

    <h3>Categories list</h3>

    <NewsCategories bind:data={data_} bind:showAddEditCategoryModal bind:addEditCategoryAction></NewsCategories>
  </section>
{/if}

{#if $user.p_news_tags_add_mod_del == 1}
  <section class="section">
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button
      class="secondary right"
      onclick={() => {
        addEditTagAction = { action: 'add' }
        showAddEditTagModal = true
      }}
    >
      <i class="fa-solid fa-plus"></i>
    </button>

    <h3>Tags list</h3>

    <NewsTags bind:data={data_} bind:showAddEditTagModal bind:addEditTagAction></NewsTags>
  </section>
{/if}

<style lang="scss">
  @use '../../../../assets/scss/dashboard.scss';

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
