<script lang="ts">
  import { l, user } from '../services/store'
  import type { News } from '../../../shared/types/features/news'
  import type { PageData } from '../routes/(authed)/dashboard/news/$types'
  import apiNewsService from '../services/api/api-news.service'
  import AddEditNewsModal from './modals/AddEditNewsModal.svelte'

  export let data: PageData

  let showAddEditNewsModal = false
  let addEditNewsAction: { action: 'add' } | { action: 'edit'; news: News } = { action: 'add' }

  let iLength = 25
  let iStart = 0

  let selectedNews: News[] = []

  function formatDate(date: Date) {
    const dateFormatter = new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    return dateFormatter.format(date)
  }

  function removeNl(str: string) {
    return str.replace(/\n/g, ' ')
  }

  function backgroundColor(color: string) {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, 0.1)`
  }

  async function deleteNews() {
    if (selectedNews.length === 0) return
    if (!confirm('Are you sure you want to delete the selected news?')) return

    selectedNews.forEach(async (news) => {
      ;(await apiNewsService.deleteNews(news.id || 0)).subscribe({
        next: (res) => {
          data.news = res.body.data!
        }
      })
    })

    selectedNews = []
    // select all checkboxes and uncheck them
    document.querySelectorAll<HTMLInputElement>('table input[type="checkbox"]').forEach((checkbox) => {
      checkbox.checked = false
    })
  }
</script>

<button
  class="primary small add"
  style="margin-right: 30px"
  on:click={() => {
    addEditNewsAction = { action: 'add' }
    showAddEditNewsModal = true
  }}
>
  <i class="fa-solid fa-plus" />&nbsp;&nbsp;New news
</button>

<button class="secondary small" disabled={selectedNews.length === 0} on:click={deleteNews}>
  <i class="fa-solid fa-trash"></i>&nbsp;&nbsp;Delete
</button>

<table>
  <tbody>
    {#each data.news as news, i}
      {#if i >= iStart && i < iStart + iLength}
        <tr
          class:disabled={$user.p_news_mod_del != 1 && news.author != $user.id}
          title={$user.p_news_mod_del != 1 && news.author != $user.id ? 'You do not have permission to edit this news.' : ''}
          class:focused={selectedNews.includes(news)}
          on:click={() => {
            if ($user.p_news_mod_del == 1 || news.author == $user.id) {
              addEditNewsAction = { action: 'edit', news: news }
              showAddEditNewsModal = true
            }
          }}
        >
          <td class="checkbox">
            <input
              type="checkbox"
              on:click|stopPropagation
              on:change={(e) => {
                // @ts-ignore
                e.target.checked ? selectedNews.push(news) : (selectedNews = selectedNews.filter((n) => n !== news))
                selectedNews = [...selectedNews]
              }}
            />
          </td>
          <td class="content">
            <p class="label">
              {#if news.categories.length > 0 && data.categories.filter((cat) => news.categories.includes(cat.id)).length > 0}
                <span style="margin-right: 20px">
                  <i class="fa-solid fa-tag"></i>&nbsp;&nbsp;{data.categories
                    .filter((cat) => news.categories.includes(cat.id))
                    .map((cat) => cat.title)
                    .join(', ')}
                </span>
              {/if}
              <span style="margin-right: 20px" title={news.edition_date ? 'Edited on ' + formatDate(new Date(news.edition_date)) : ''}>
                <i class="fa-solid fa-calendar"></i>&nbsp;&nbsp;{formatDate(new Date(news.date))}
              </span>
              <span>
                <i class="fa-solid fa-user"></i>&nbsp;&nbsp;{data.users.find((user) => user.id == news.author).name}
              </span>
            </p>
            <h4>{news.title}</h4>
            <p class="content">{removeNl(news.content)}</p>
            {#each news.tags as tag}
              {#if data.tags.find((tag_) => tag_.id == tag)}
                <span
                  class="tag"
                  style="color: {data.tags.find((tag_) => tag_.id == tag).color}; background-color: {backgroundColor(
                    data.tags.find((tag_) => tag_.id == tag).color
                  )}"
                >
                  <i class="fa-solid fa-hashtag"></i>{data.tags.find((tag_) => tag_.id == tag).title}
                </span>
              {/if}
            {/each}
          </td>
        </tr>
      {/if}
    {/each}
  </tbody>
</table>

{#if data.news.length === 0}
  <p class="nothing">No news</p>
{/if}

<div class="info">
  <p>
    {iStart}-{data.news.length <= iStart + iLength ? data.news.length : iStart + iLength} of {data.news.length} news
  </p>
  <p>
    <button
      class="page"
      disabled={iStart === 0}
      on:click={() => {
        iStart -= iLength
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
    >
      <i class="fa-solid fa-chevron-left" />
    </button>
    <button
      class="page"
      disabled={iStart + iLength >= data.news.length}
      on:click={() => {
        iStart += iLength
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
    >
      <i class="fa-solid fa-chevron-right" />
    </button>
  </p>
  {#if selectedNews.length === 1}
    <p>1 news selected</p>
  {:else if selectedNews.length > 1}
    <p>{selectedNews.length} news selected</p>
  {/if}
</div>

<AddEditNewsModal bind:data bind:show={showAddEditNewsModal} bind:action={addEditNewsAction} />

<style lang="scss">
  p.nothing {
    text-align: center;
    margin-top: 20px;
    color: #606060;
  }

  div.info {
    bottom: 0;
    padding-top: 15px;

    p {
      margin: 0 30px 0 0;
      font-size: 14px;
      color: var(--text-dark-color);
      display: inline-block;
    }
  }

  button.small {
    width: auto;
    margin-top: 10px;
    display: inline-block;
    margin-right: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    user-select: none;
    margin-top: 30px;

    tbody tr {
      transition: all 0.3s;
      cursor: pointer;

      &:hover:not(.disabled) {
        background-color: #eeeeee;

        &:active {
          transform: translateY(2px);
        }
      }

      &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    td {
      padding: 15px 20px;

      &.checkbox {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        text-align: center;
        width: 25px;

        input {
          width: 18px;
          height: 18px;
        }
      }

      &.content {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        padding-left: 10px;
        padding-left: 10px;

        h4 {
          margin: 0 0 5px 0;
          font-weight: 400;
          font-size: 16px;
        }

        p.label {
          margin-top: 0;
        }

        p.content {
          margin: 0;
          font-size: 13px;
          overflow: hidden;
          display: -webkit-box;
          text-overflow: ellipsis;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          max-height: 62.39px;
        }

        span.tag {
          display: inline-block;
          margin-top: 5px;
          margin-right: 5px;
          padding: 5px 10px;
          border-radius: 5px;
          font-size: 12px;

          i {
            margin-right: 5px;
          }
        }
      }
    }
  }

  button.page {
    display: inline-block;
    margin-top: 0;
    border-bottom: none;
    color: #1e1e1e;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 250px;
    font-family: 'Poppins';
    background: none;
    line-height: 15px;

    &:hover {
      background: #eeeeee;
    }
  }
</style>
