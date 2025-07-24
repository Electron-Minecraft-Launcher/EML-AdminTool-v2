<script lang="ts">
  import getEnv from '$lib/utils/env'
  import getUser from '$lib/utils/user'
  import News from '../../../../components/contents/News.svelte'
  import type { PageProps } from './$types'

  let { data }: PageProps = $props()

  const env = getEnv()
  const user = getUser()

  let news = $state(data.news)
  let newsCategories = $state(data.newsCategories)
  let newsTags = $state(data.newsTags)
  let images = $state(data.images)

  $effect(() => {
    if (data.news) news = data.news
    if (data.newsCategories) newsCategories = data.newsCategories
    if (data.newsTags) newsTags = data.newsTags
    if (data.images) images = data.images
  })
</script>

<svelte:head>
  <title>News • {env.name} AdminTool</title>
</svelte:head>

<h2>News</h2>

<section class="section">
  <h3>News</h3>

  <News {news} {newsCategories} {newsTags} {images} />
</section>

{#if user.p_newsCategories}
  <section class="section">
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button
      class="secondary right"
      onclick={() => {
        // addEditCategoryAction = { action: 'add' }
        // showAddEditCategoryModal = true
      }}
    >
      <i class="fa-solid fa-plus"></i>
    </button>

    <h3>Categories</h3>

    <!-- <NewsCategories bind:data={data_} bind:showAddEditCategoryModal bind:addEditCategoryAction></NewsCategories> -->
  </section>
{/if}

{#if user.p_newsTags}
  <section class="section">
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button
      class="secondary right"
      onclick={() => {
        // addEditTagAction = { action: 'add' }
        // showAddEditTagModal = true
      }}
    >
      <i class="fa-solid fa-plus"></i>
    </button>

    <h3>Tags</h3>

    <!-- <NewsTags bind:data={data_} bind:showAddEditTagModal bind:addEditTagAction></NewsTags> -->
  </section>
{/if}

<style lang="scss">
  @use '../../../../../static/scss/dashboard.scss';

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
