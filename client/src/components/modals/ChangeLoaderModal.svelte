<script lang="ts">
  import type { PageData } from '../../routes/(authed)/dashboard/files-updater/$types'
  import { l } from '../../services/store'
  import ModalTemplate from './ModalTemplate.svelte'
  import LoadingSplash from '../layouts/LoadingSplash.svelte'
  import apiFilesupdaterService from '../../services/api/api-filesupdater.service'
  import type { Loader } from '../../../../shared/types/features/file'

  interface Props {
    data: PageData
    show: boolean
    ready: boolean
  }

  let { data = $bindable(), show = $bindable(), ready = $bindable() }: Props = $props()

  let loader: 'vanilla' | 'forge' = $state('vanilla')
  let temp_loader: 'vanilla' | 'forge' = $state('vanilla')
  let minecraft_version: string = $state('')
  let temp_minecraft_version: string = $state('')
  let loader_version: string = $state('')
  let minecraftVersions: string[] = $state([])

  async function update() {
    loader = data.loader.loader
    temp_loader = data.loader.loader
    minecraft_version = data.loader.minecraft_version
    temp_minecraft_version = data.loader.minecraft_version.includes('latest')
      ? 'Latest'
      : data.loader.minecraft_version.split('.').slice(0, 2).join('.')
    loader_version = data.loader.loader_version
    minecraftVersions = [...new Set(data.loadersList[loader].map((version) => version.minecraftVersion))]
  }

  async function submit(e: SubmitEvent) {
    e.preventDefault()
    const newLoader: Loader = {
      loader,
      minecraft_version,
      loader_version
    }
    ;(await apiFilesupdaterService.putLoader(newLoader)).subscribe({
      next: (res) => {
        data.loader = res.body.data
        show = false
      }
    })
  }

  $effect(() => {
    if (show && data.loadersList) update()
  })
</script>

<ModalTemplate size={'l'} bind:show>
  {#if !ready}
    <LoadingSplash transparent></LoadingSplash>
  {/if}

  <form onsubmit={submit}>
    <h2>Change loader</h2>

    <div class="list-container">
      <div class="list">
        <p class="label" style="margin-top: 0; position: sticky; top: 0; background: white">Loaders</p>
        <button
          class="list"
          type="button"
          class:active={temp_loader === 'vanilla'}
          onclick={() => {
            temp_loader = 'vanilla'
            minecraftVersions = [...new Set(data.loadersList[temp_loader].map((version) => version.minecraftVersion))]
          }}>Vanilla</button
        >
        <button
          class="list"
          type="button"
          class:active={temp_loader === 'forge'}
          onclick={() => {
            temp_loader = 'forge'
            minecraftVersions = [...new Set(data.loadersList[temp_loader].map((version) => version.minecraftVersion))]
            if (!minecraftVersions.includes(temp_minecraft_version)) {
              temp_minecraft_version = minecraftVersions[0]
            }
          }}>Forge</button
        >
      </div>

      {#if ready && data.loadersList}
        <div class="content-list">
          <div class="list-container">
            <div class="list">
              <p class="label" style="margin-top: 0; position: sticky; top: 0; background: white; z-index: 100">Minecraft versions</p>
              {#each minecraftVersions as version}
                <button
                  class="list"
                  type="button"
                  class:active={temp_minecraft_version === version}
                  onclick={() => (temp_minecraft_version = version)}
                >
                  {version}
                </button>
              {/each}
            </div>

            <div class="content-list">
              <h4>
                {temp_loader === 'forge' ? 'Minecraft Forge' : 'Minecraft Vanilla'}
                {temp_minecraft_version === 'Latest' ? temp_minecraft_version : `${temp_minecraft_version}.x`}
              </h4>

              {#if temp_loader === 'vanilla'}
                <!--* VANILLA -->
                <p class="label">Release</p>
                {#each data.loadersList[temp_loader].filter((l) => l.minecraftVersion === temp_minecraft_version && l.type.includes('release')) as version}
                  {#if version.loaderVersion === 'latest_release'}
                    <button
                      class:active={loader_version === version.loaderVersion && temp_loader === 'vanilla'}
                      type="button"
                      onclick={() => {
                        loader = temp_loader = 'vanilla'
                        minecraft_version = loader_version = 'latest_release'
                      }}
                    >
                      Latest Minecraft release&nbsp;&nbsp;
                      <i
                        class="fa-solid fa-circle-question"
                        title="Choosing this version will always force the Launcher download the latest release."
                        style="cursor: help"
                      >
                      </i>
                    </button>
                  {:else}
                    <button
                      class:active={loader_version === version.loaderVersion && temp_loader === 'vanilla'}
                      type="button"
                      onclick={() => {
                        loader = temp_loader = 'vanilla'
                        minecraft_version = loader_version = version.loaderVersion
                      }}
                    >
                      Minecraft {version.loaderVersion}
                    </button>
                  {/if}
                {/each}

                <p class="label">Snapshots</p>
                {#each data.loadersList[temp_loader].filter((l) => l.minecraftVersion === temp_minecraft_version && l.type.includes('snapshot')) as version}
                  {#if version.loaderVersion === 'latest_snapshot'}
                    <button
                      class:active={loader_version === version.loaderVersion && temp_loader === 'vanilla'}
                      type="button"
                      onclick={() => {
                        loader = temp_loader = 'vanilla'
                        minecraft_version = loader_version = 'latest_snapshot'
                      }}
                    >
                      Latest Minecraft snapshot&nbsp;&nbsp;
                      <i
                        class="fa-solid fa-circle-question"
                        title="Choosing this version will always force the Launcher download the latest snapshot."
                        style="cursor: help"
                      >
                      </i>
                    </button>
                  {:else}
                    <button
                      class:active={loader_version === version.loaderVersion && temp_loader === 'vanilla'}
                      type="button"
                      onclick={() => {
                        loader = temp_loader = 'vanilla'
                        minecraft_version = loader_version = version.loaderVersion
                      }}
                    >
                      Minecraft {version.loaderVersion}
                    </button>
                  {/if}
                {/each}
              {:else if temp_loader === 'forge'}
                <!--* FORGE -->
                <p class="label">Recommended</p>
                {#each data.loadersList[temp_loader].filter((l) => l.minecraftVersion === temp_minecraft_version && l.type.includes('recommended')) as version}
                  <button
                    class:active={loader_version === version.loaderVersion && temp_loader === 'forge'}
                    type="button"
                    onclick={() => {
                      loader = temp_loader = 'forge'
                      minecraft_version = version.loaderVersion.split('-')[0].replace('_', '-')
                      loader_version = version.loaderVersion
                    }}
                  >
                    Minecraft {version.loaderVersion.split('-')[0].replace('_', '-')}
                    (Forge {version.loaderVersion.split('-').slice(1).join('-')})
                  </button>
                {:else}
                  <p class="no-link">-</p>
                {/each}

                <p class="label">Latest</p>
                {#each data.loadersList[temp_loader].filter((l) => l.minecraftVersion === temp_minecraft_version && l.type.includes('latest')) as version}
                  <button
                    class:active={loader_version === version.loaderVersion && temp_loader === 'forge'}
                    type="button"
                    onclick={() => {
                      loader = temp_loader = 'forge'
                      minecraft_version = version.loaderVersion.split('-')[0].replace('_', '-')
                      loader_version = version.loaderVersion
                    }}
                  >
                    Minecraft {version.loaderVersion.split('-')[0].replace('_', '-')}
                    (Forge {version.loaderVersion.split('-').slice(1).join('-')})
                  </button>
                {:else}
                  <p class="no-link">-</p>
                {/each}

                <p class="label">All versions</p>
                {#each data.loadersList[temp_loader].filter((l) => l.minecraftVersion === temp_minecraft_version) as version}
                  <button
                    class:active={loader_version === version.loaderVersion && temp_loader === 'forge'}
                    type="button"
                    onclick={() => {
                      loader = temp_loader = 'forge'
                      minecraft_version = version.loaderVersion.split('-')[0].replace('_', '-')
                      loader_version = version.loaderVersion
                    }}
                  >
                    Minecraft {version.loaderVersion.split('-')[0].replace('_', '-')}
                    (Forge {version.loaderVersion.split('-').slice(1).join('-')})
                  </button>
                {:else}
                  <p class="no-link">-</p>
                {/each}
              {/if}
            </div>
          </div>
        </div>
      {/if}
    </div>

    <div class="actions">
      <button class="secondary" onclick={() => (show = false)} type="button">{$l.main.cancel}</button>
      <button class="primary">{$l.main.save}</button>
    </div>
  </form>
</ModalTemplate>

<style lang="scss">
  @use '../../assets/scss/modals.scss';
  @use '../../assets/scss/list.scss';

  div.list,
  div.content-list {
    min-height: calc(100vh - 175px - 30px - 35px - 71px) !important;
    max-height: calc(100vh - 175px - 30px - 35px - 71px) !important;
    overflow-y: auto;
  }

  h4 {
    margin-top: 0;
    position: sticky;
    top: 0;
    background: white;
    z-index: 100;
  }

  div.content-list button {
    display: block;
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
    width: 500px;
    text-align: left;

    i {
      color: #1e1e1e;
    }

    &.active {
      background: #f5f5f5;
    }

    &:hover {
      background: #eeeeee;
    }
  }
</style>
