<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import monaco from '../../services/monaco.service'
  import { l } from '../../services/store'

  interface Props {
    language: string
    newName: string
    content: string
    submit: (e: Event | null, close: boolean) => void
    show: boolean
  }

  let { language, newName, content = $bindable(), submit, show = $bindable() }: Props = $props()

  let container: HTMLDivElement | undefined = $state()
  let editor: monaco.editor.IStandaloneCodeEditor | undefined = $state()
  let model: monaco.editor.ITextModel | undefined = $state()

  onMount(() => {
    if (!editor && !container) {
      container = document.getElementById('container-editor') as HTMLDivElement
      editor = monaco.editor.create(container!, { minimap: { enabled: false } })
      model = monaco.editor.createModel(content, 'plaintext')
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

  $effect(() => {
    if (editor && model) model.setValue(content)
  })

  $effect(() => {
    if (language && editor && model) {
      monaco.editor.setModelLanguage(model, language)
    }
  })
</script>

<div id="container-editor" class="container-editor"></div>

<div class="actions">
  <button class="secondary" onclick={() => (show = false)} type="button">{$l.main.cancel}</button>
  <button class="primary" disabled={newName.replaceAll(' ', '').replaceAll('.', '') === ''} onclick={(e) => {
    content = editor!.getValue()
    submit(e, true)
    }}>{$l.main.save}</button>
</div>

<style lang="scss">
  @use '../../assets/scss/modals.scss';

  div.container-editor {
    margin-top: 20px;
    border: 1px solid var(--border-color2);
    border-radius: 5px;
    height: calc(100vh - 177px - 106px - 48px - 63px)
  }
</style>
