<script lang="ts">
  import { afterUpdate, onMount } from 'svelte'
  import { l } from '../services/store'
  import notificationsService from '../services/notifications.service'
  import type { News, NewsCategory } from '../../../shared/models/features/news.model'
  import type { PageData } from '../routes/(authed)/dashboard/news/$types'
  import apiNewsService from '../services/api/api-news.service'

  export let data: PageData

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

  async function deleteCategory(cat: NewsCategory) {
    if (!cat.id) return
    if (!confirm('Are you sure you want to delete the selected category?')) return
    ;(await apiNewsService.deleteCategory(cat.id || 0)).subscribe({
      next: (res) => {
        data.news = res.body.data!
      }
    })
  }
</script>

<table>
  <tbody>
    {#each data.categories as category, i}
      <p>{category.title}</p>
    {/each}
  </tbody>
</table>

{#if data.news.length === 0}
  <p class="nothing">No cat</p>
{/if}

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

      &:hover {
        background-color: #eeeeee;

        &:active {
          transform: translateY(2px);
        }
      }

      &.focused {
        background-color: #f5f5f5;

        &:hover {
          background-color: #eeeeee;
        }
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
          width: 16px;
          height: 16px;
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
          text-overflow: ellipsis;
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
</style>
