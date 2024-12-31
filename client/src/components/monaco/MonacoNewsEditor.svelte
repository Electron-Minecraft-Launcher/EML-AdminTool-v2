<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import monaco from '../../services/monaco.service'
  import { l } from '../../services/store'
  import type { PageData } from '../../routes/(authed)/dashboard/news/$types'
  import { slide } from 'svelte/transition'

  interface Props {
    data: PageData
    title: string
    content: string
    categories: number[]
    tags: number[]
    submit: (e: Event) => void
    show: boolean
  }

  let { 
    data = $bindable(), 
    content = $bindable(), 
    title, 
    categories = $bindable(), 
    tags = $bindable(),
    submit, 
    show = $bindable() 
  }: Props = $props()

  let container: HTMLDivElement | undefined = $state()
  let editor: monaco.editor.IStandaloneCodeEditor | undefined = $state()
  let model: monaco.editor.ITextModel | undefined = $state()

  let addCategoriesDropdownOpen = $state(false)
  let addTagsDropdownOpen = $state(false)

  onMount(() => {
    if (!editor && !container) {
      container = document.getElementById('container-editor') as HTMLDivElement
      editor = monaco.editor.create(container!, { minimap: { enabled: false } })
      model = monaco.editor.createModel(content, 'markdown')
      editor.setModel(model!)
    } else {
      model!.setValue(content)
    }
  })

  onDestroy(() => {
    monaco?.editor.getModels().forEach((model) => model.dispose())
    editor?.dispose()
    model?.dispose()
    editor = undefined
  })

  function backgroundColor(color: string) {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, 0.1)`
  }

  $effect(() => {
    if (editor && model) model.setValue(content)
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

<div id="container-editor" class="container-editor"></div>

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
  <button class="primary" disabled={title.replaceAll(' ', '').replaceAll('.', '') === ''} onclick={(e) => {
    content = editor!.getValue()
    submit(e)
    }}>{$l.main.save}</button>
</div>

<style lang="scss">
  @use '../../assets/scss/modals.scss';

  div.container-editor {
    height: calc(100vh - 177px - 106px - 30px - 103px - 2 * 85px);
    margin-top: 20px;
    border: 1px solid var(--border-color2);
    border-radius: 5px;
  }

  button.right {
    opacity: 1;
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
