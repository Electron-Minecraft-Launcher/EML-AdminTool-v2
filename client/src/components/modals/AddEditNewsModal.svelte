<script lang="ts">
  import { run, preventDefault } from 'svelte/legacy'

  import { onDestroy } from 'svelte'
  import type { File as File_ } from '../../../../shared/types/features/file'
  import type { PageData } from '../../routes/(authed)/dashboard/news/$types'
  import { l } from '../../services/store'
  import ModalTemplate from './ModalTemplate.svelte'
  import monaco from '../../services/monaco.service'
  import type { News } from '../../../../shared/types/features/news'
  import { slide } from 'svelte/transition'
  import apiNewsService from '../../services/api/api-news.service'

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
  let imagesUpload: HTMLInputElement | null = $state(null)

  let container: HTMLDivElement | undefined = $state()
  let editor: monaco.editor.IStandaloneCodeEditor | undefined = $state()
  let model: monaco.editor.ITextModel | undefined = $state()

  let addCategoriesDropdownOpen = $state(false)
  let addTagsDropdownOpen = $state(false)

  onDestroy(() => {
    monaco?.editor.getModels().forEach((model) => model.dispose())
    editor?.dispose()
  })

  function backgroundColor(color: string) {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, 0.1)`
  }

  async function uploadImages() {
    if (!imagesUpload) return
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
    if (imagesUpload) {
      imagesUpload.value = ''
      imagesUpload.files = null
    }
    if (action.action === 'edit') {
      title = action.news.title
      content = action.news.content
      categories = action.news.categories as number[]
      tags = action.news.tags as number[]
      categories = categories.filter((cat) => data.categories.find((c) => c.id === cat))
      tags = tags.filter((tag) => data.tags.find((t) => t.id === tag))
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

  async function submit(e: SubmitEvent) {
    e.preventDefault()
    content = editor!.getValue()
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

    imagesUpload = null as HTMLInputElement | null

    if (container) {
      if (editor) {
        editor.dispose()
        model?.dispose()
      }

      editor = monaco.editor.create(container, { minimap: { enabled: false }, wordWrap: 'on' })
      model = monaco.editor.createModel(content, 'markdown')
      editor.setModel(model)
    }
  })
</script>

<svelte:body
  onclick={(e) => {
    // @ts-ignore
    if (addCategoriesDropdownOpen && e.target && !e.target.closest('button.categories.add')) {
      addCategoriesDropdownOpen = false
    }
    // @ts-ignore
    if (addTagsDropdownOpen && e.target && !e.target.closest('button.tags.add')) {
      addTagsDropdownOpen = false
    }
  }}
/>

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
    <input type="file" multiple name="images" id="images" accept="image/*" style="display: none " bind:this={imagesUpload} />
  </div>
{/if}

<!--* Modal -->

<ModalTemplate size={'m'} bind:show translateX={'-23%'}>
  <form onsubmit={submit}>
    <h2>{action.action === 'add' ? 'Publish a news' : 'Edit the news'}</h2>

    <label for="title">Title</label>
    <input type="text" id="title" class="title" placeholder="News title" bind:value={title} />

    <div bind:this={container} class="container-editor"></div>

    <p class="label" style="margin-top: 20px">Categories</p>
    <div class="categories">
      {#each categories as category}
        {#if data.categories.find((cat) => cat.id == category)}
          <span class="category">
            <i class="fa-solid fa-tag"></i>&nbsp;&nbsp;{data.categories.find((cat) => cat.id == category).title}
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button type="button" class="remove" onclick={() => (categories = categories.filter((cat) => cat !== category))}>
              <i class="fa-solid fa-circle-xmark"></i>
            </button>
          </span>
        {/if}
      {/each}
      <span class="add">
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button
          type="button"
          class="secondary categories add"
          onclick={() => (addCategoriesDropdownOpen = !addCategoriesDropdownOpen)}
          disabled={categories.length === data.categories.length}><i class="fa-solid fa-plus"></i></button
        >
        {#if addCategoriesDropdownOpen}
          <div class="add-category-dropdown" transition:slide={{ duration: 200 }}>
            {#each data.categories as category}
              {#if !categories.includes(category.id)}
                <button type="button" onclick={() => (categories = [...categories, category.id])}
                  ><i class="fa-solid fa-tag"></i>&nbsp;&nbsp;{category.title}</button
                >
              {/if}
            {/each}
          </div>
        {/if}
      </span>
    </div>

    <!--  -->

    <p class="label" style="margin-top: 20px">Tags</p>
    <div class="tags">
      {#each tags as tag}
        {#if data.tags.find((t) => t.id == tag)}
          <span
            class="tags"
            style="color: {data.tags.find((t) => t.id == tag).color}; background-color: {backgroundColor(data.tags.find((t) => t.id == tag).color)}"
          >
            <i class="fa-solid fa-hashtag"></i>&nbsp;&nbsp;{data.tags.find((t) => t.id == tag).title}
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button type="button" class="remove" onclick={() => (tags = tags.filter((t) => t !== tag))}>
              <i class="fa-solid fa-circle-xmark"></i>
            </button>
          </span>
        {/if}
      {/each}
      <span class="add">
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button
          type="button"
          class="secondary tags add"
          onclick={() => (addTagsDropdownOpen = !addTagsDropdownOpen)}
          disabled={tags.length === data.tags.length}
        >
          <i class="fa-solid fa-plus"></i>
        </button>
        {#if addTagsDropdownOpen}
          <div class="add-tags-dropdown" transition:slide={{ duration: 200 }}>
            {#each data.tags as tag}
              {#if !tags.includes(tag.id)}
                <button type="button" onclick={() => (tags = [...tags, tag.id])} style="color: {tag.color}"
                  ><i class="fa-solid fa-hashtag"></i>&nbsp;&nbsp;{tag.title}</button
                >
              {/if}
            {/each}
          </div>
        {/if}
      </span>
    </div>

    <div class="actions">
      <button class="secondary" onclick={() => (show = false)} type="button">{$l.main.cancel}</button>
      <button class="primary" disabled={title.replaceAll(' ', '').replaceAll('.', '') === ''}>{$l.main.save}</button>
    </div>
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

  button.right {
    opacity: 1;
  }

  div.container-editor {
    height: calc(100vh - 177px - 106px - 30px - 103px - 2 * 85px);
    margin-top: 20px;
    border: 1px solid var(--border-color2);
    border-radius: 5px;
  }

  span.category,
  span.tags {
    display: inline-block;
    margin-top: 0;
    margin-right: 5px;
    padding-left: 15px;
    border-radius: 5px;
    font-size: 12px;
    background-color: #f0f0f0;
    line-height: 15px;

    i {
      margin-right: 5px;
    }
  }

  button.remove {
    display: inline-block;
    margin-top: 0;
    border-bottom: none;
    color: #1e1e1e;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-family: 'Poppins';
    background: none;
    line-height: 15px;
    margin-left: 5px;
    color: var(--red-color);

    &:hover {
      background: #faeeee;
    }

    i {
      margin-right: 0;
    }
  }

  button.add {
    display: inline-block;
    margin-top: 0;
    position: relative;
  }

  div.categories,
  div.tags {
    max-width: 100%;
    // overflow-x: auto;
    overflow-y: visible;
  }

  span.add {
    position: relative;
  }

  div.add-category-dropdown,
  div.add-tags-dropdown {
    overflow-y: hidden;
    border-radius: 5px;
    transition:
      transform 0.3s ease,
      opacity 0.2s,
      height 0.2s ease,
      display 0s;
    background: white;
    padding: 10px;
    border: 1px solid var(--border-color);
    z-index: 100;
    position: absolute;
    width: 178px;
    top: 42px;
    left: 0;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);

    button {
      width: 100%;
      position: relative;
      text-align: left;
      font-family: 'Poppins';
      background: none;
      line-height: 15px;

      &:nth-of-type(1) {
        margin-top: 0;
      }

      &:hover {
        background: #eeeeee;
      }
    }
  }
</style>
