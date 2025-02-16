<script lang="ts">
  import type { File as File_ } from '../../../../shared/types/features/file'
  import type { PageData } from '../../routes/(authed)/dashboard/news/$types'
  import { l } from '../../services/store'
  import ModalTemplate from './ModalTemplate.svelte'
  import type { News } from '../../../../shared/types/features/news'
  import { slide } from 'svelte/transition'
  import apiNewsService from '../../services/api/api-news.service'
  import MonacoNewsEditor from '../monaco/MonacoNewsEditor.svelte'

  interface Props {
    data: PageData
    show: boolean
    action: { action: 'add' } | { action: 'edit'; news: News }
  }

  let { data = $bindable(), show = $bindable(), action = $bindable() }: Props = $props()

  let title: string = $state('')
  let content: string = $state('')
  let categories: number[] = $state([])
  let tags: number[] = $state([])

  async function uploadImages() {
    const imagesUpload = document.getElementById('images') as HTMLInputElement

    imagesUpload.click()

    await new Promise((resolve) => {
      imagesUpload!.addEventListener('change', resolve, { once: true })
    })

    if (!imagesUpload.files) return
    let files: File[] = []

    for (let i = 0; i < imagesUpload.files.length; i++) {
      files.push(imagesUpload.files.item(i)!)
    }

    upload(files)
  }

  async function upload(files: File[]) {
    const imagesUpload = document.getElementById('images') as HTMLInputElement

    ;(await apiNewsService.uploadImages(files)).subscribe({
      next: (res) => {
        data.images = res.body.data!
      }
    })

    if (imagesUpload) {
      imagesUpload.value = ''
      imagesUpload.files = null
    }
  }

  async function update() {
    if (action.action === 'edit') {
      title = action.news.title
      content = action.news.content
      categories = (action.news.categories as number[]).filter((cat) => data.categories.find((c) => c.id === cat))
      tags = (action.news.tags as number[]).filter((tag) => data.tags.find((t) => t.id === tag))
    } else {
      title = ''
      content = ''
      categories = []
      tags = []
    }
  }

  async function copy(image: File_) {
    navigator.clipboard.writeText(`![${image.name}](${image.url})`)
  }

  async function deleteImage(image: File_) {
    if (!confirm('Are you sure you want to delete this image? It will not be available in the news anymore.')) return
    ;(await apiNewsService.deleteImages([image.name])).subscribe({
      next: (res) => {
        data.images = res.body.data!
      }
    })
  }

  async function submit(e: Event) {
    e.preventDefault()
    if (action.action === 'add') {
      ;(await apiNewsService.postNews({ title, content, categories, tags })).subscribe({
        next: (res) => {
          data.news = res.body.data!
          show = false
        }
      })
    } else {
      ;(await apiNewsService.putNews(action.news.id || 0, { title, content, categories, tags })).subscribe({
        next: (res) => {
          data.news = res.body.data!
          show = false
        }
      })
    }
  }

  $effect(() => {
    if (show) update()
  })
</script>

<!--* Images -->

{#if show}
  <div class="explorer" transition:slide>
    <h3>Images</h3>

    <div class="list">
      {#each data.images as image}
        <div class="img" style="background-image: url('{image.url}')">
          <div>
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button onclick={() => copy(image)}><i class="fa-solid fa-copy"></i></button>
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button class="remove" onclick={() => deleteImage(image)}><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      {:else}
        <p class="nothing">No image</p>
      {/each}
      {#if data.images.length % 2 !== 0}
        <div class="img"></div>
      {/if}
    </div>

    <button class="secondary" onclick={uploadImages}><i class="fa-solid fa-file-arrow-up"></i>&nbsp;&nbsp;Upload images...</button>
    <input type="file" multiple name="images" id="images" accept="image/*" style="display: none" />
  </div>
{/if}

<!--* Modal -->

<ModalTemplate size={'m'} bind:show translateX={'-23%'}>
  <form onsubmit={submit}>
    <h2>{action.action === 'add' ? 'Publish a news' : 'Edit the news'}</h2>

    <label for="title">Title</label>
    <input type="text" id="title" class="title" placeholder="News title" bind:value={title} />

    <MonacoNewsEditor bind:data {title} bind:content bind:categories bind:tags {submit} bind:show></MonacoNewsEditor>
  </form>
</ModalTemplate>

<style lang="scss">
  @use '../../assets/scss/modals.scss';

  div.explorer {
    position: fixed;
    z-index: 10000;

    top: 30px;
    right: 30px;
    width: 20%;
    transition:
      opacity 0.3s,
      transform 0.3s;

    background-color: white;
    padding: 40px;
    border: 1px solid var(--border-color);
    border-radius: 10px;

    box-shadow: 0 5px 50px rgba(0, 0, 0, 0.5);
    margin: auto;

    h3 {
      margin-bottom: 30px;
    }

    div.list {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      position: relative;
      max-height: calc(100vh - 300px);
      overflow-y: auto;
    }

    p.nothing {
      text-align: center;
      margin-top: 20px;
      color: #606060;
      width: 100%;
    }

    div.img {
      width: calc(50% - 10px);
      aspect-ratio: 4 / 3;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      border-radius: 5px;
      position: relative;

      div {
        display: flex;
        gap: 5px;
        width: 100%;
        height: 100%;
        align-items: center;
        vertical-align: middle;
        justify-content: center;
        background: #dfdfdfa1;
        border-radius: 5px;
        transition: opacity 0.3s;
        opacity: 0;

        &:hover {
          opacity: 1;
        }
      }
    }

    button:not(:global(.secondary)) {
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
        background: #eeeeeeb7;
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
          background: #faeeeeb7;
        }
      }
    }
  }
</style>
