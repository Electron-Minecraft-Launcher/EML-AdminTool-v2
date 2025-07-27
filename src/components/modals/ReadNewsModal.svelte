<script lang="ts">
  import type { NewsCategory, NewsTag } from '@prisma/client'
  import type { PageData } from '../../routes/(app)/dashboard/news/$types'
  import type { File as File_ } from '$lib/utils/types'
  import { slide } from 'svelte/transition'
  import ModalTemplate from './__ModalTemplate.svelte'
  import { EditorView, keymap, lineNumbers } from '@codemirror/view'
  import { onDestroy, onMount } from 'svelte'
  import { markdown } from '@codemirror/lang-markdown'
  import { bracketMatching, defaultHighlightStyle, foldKeymap, indentOnInput, syntaxHighlighting } from '@codemirror/language'
  import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete'
  import { defaultKeymap, indentWithTab } from '@codemirror/commands'
  import { EditorState } from '@codemirror/state'
  import NewsViewer from '../contents/NewsViewer.svelte'

  interface Props {
    show: boolean
    news: NonNullable<PageData['news']>
    newsCategories: NewsCategory[]
    newsTags: NewsTag[]
    images: File_[]
    selectedNewsId: string
  }

  let { show = $bindable(), news, newsCategories, newsTags, images, selectedNewsId }: Props = $props()

  let selectedNews = $state(news.find((n) => n.id === selectedNewsId)!)
  let title = $state(selectedNews?.title ?? '')
  let content = $state(selectedNews?.content ?? '')
  let categories = $state(selectedNews?.categories ?? [])
  let tags = $state(selectedNews?.tags ?? [])

  let editorContainer: HTMLDivElement
  let editorView: EditorView
  const editorTheme = EditorView.theme({
    '&, .cm-content *, .cm-gutters *, .cm-editor *': { fontFamily: 'monospace !important', fontSize: '14px' },
    '&': { height: '100%', fontSize: '14px' }
  })

  function backgroundColor(color: string) {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, 0.1)`
  }
</script>

<ModalTemplate size={'m'} bind:show>
  <h2>Read news</h2>

  <NewsViewer
    {title}
    {content}
    author={selectedNews.author}
    {categories}
    {tags}
    createdAt={selectedNews.createdAt}
    updatedAt={selectedNews.updatedAt}
  />

  <div class="actions">
    <button type="button" class="secondary" onclick={() => (show = false)}>Close</button>
  </div>
</ModalTemplate>

<style lang="scss">
  @use '../../../static/scss/modals.scss';

  button.secondary {
    margin-top: 30px
  }
</style>
