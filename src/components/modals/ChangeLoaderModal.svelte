<script lang="ts">
  import type { LoaderVersion } from '$lib/utils/types'
  import { LoaderType, type Loader } from '@prisma/client'
  import ModalTemplate from './__ModalTemplate.svelte'
  import LoadingSplash from '../layouts/LoadingSplash.svelte'
  import { l } from '$lib/stores/language'

  interface Props {
    show: boolean
    loader: Loader
    loaderList: { [key in LoaderType]: LoaderVersion[] }
  }

  let { show = $bindable(), loader, loaderList }: Props = $props()

  let showLoader = $state(false)
  let type: LoaderType = loader.type ?? LoaderType.VANILLA
  let focusedType: LoaderType = $state(type)
  let minecraftVersion = $state(loader.minecraftVersion ?? '')
  let focusedMinecraftVersion = $state(
    loader.minecraftVersion!.includes('latest') ? 'Latest' : loader.minecraftVersion!.split('.').slice(0, 2).join('.')
  )
  let loaderVersion = $state(loader.loaderVersion ?? '')
  let minecraftVersions = $state([...new Set(loaderList[type].map((version) => version.minecraftVersion))])

  async function submit(e: SubmitEvent) {
    // e.preventDefault()
    // const newLoader: Loader = {
    //   loader,
    //   minecraft_version,
    //   loader_version
    // }
    // ;(await apiFilesupdaterService.putLoader(newLoader)).subscribe({
    //   next: (res) => {
    //     data.loader = res.body.data
    //     show = false
    //   }
    // })
  }
</script>

<ModalTemplate size={'l'} bind:show>
  {#if showLoader}
    <LoadingSplash transparent />
  {/if}

  <form>
    <h2>Change loader</h2>

    <div class="list-container">
      <div class="list">
        <p class="label" style="margin-top: 0; position: sticky; top: 0; background: white">Loaders</p>
        <button
          class="list"
          type="button"
          class:active={focusedType === LoaderType.VANILLA}
          onclick={() => {
            focusedType = LoaderType.VANILLA
            minecraftVersions = [...new Set(loaderList[focusedType].map((version) => version.minecraftVersion))]
          }}
        >
          Vanilla
        </button>
        <button
          class="list"
          type="button"
          class:active={focusedType === LoaderType.FORGE}
          onclick={() => {
            focusedType = LoaderType.FORGE
            minecraftVersions = [...new Set(loaderList[focusedType].map((version) => version.minecraftVersion))]
            if (!minecraftVersions.includes(focusedMinecraftVersion)) {
              focusedMinecraftVersion = minecraftVersions[0]
            }
          }}
        >
          Forge
        </button>
      </div>

      <div class="content-list">
        <div class="list-container">
          <div class="list">
            <p class="label" style="margin-top: 0; position: sticky; top: 0; background: white; z-index: 100">Minecraft versions</p>
            {#each minecraftVersions as version}
              <button
                class="list"
                type="button"
                class:active={focusedMinecraftVersion === version}
                onclick={() => (focusedMinecraftVersion = version)}
              >
                {version}
              </button>
            {/each}
          </div>

          <div class="content-list">
            <h4>
              {focusedType === LoaderType.FORGE ? 'Minecraft Forge' : 'Minecraft Vanilla'}
              {focusedMinecraftVersion === 'Latest' ? focusedMinecraftVersion : `${focusedMinecraftVersion}.x`}
            </h4>

            {#if focusedType === LoaderType.VANILLA}
              <!--* VANILLA -->
              <p class="label">Release</p>
              {#each loaderList[focusedType].filter((l) => l.minecraftVersion === focusedMinecraftVersion && l.type.includes('release')) as version}
                {#if version.loaderVersion === 'latest_release'}
                  <button
                    class:active={loaderVersion === version.loaderVersion && focusedType === LoaderType.VANILLA}
                    type="button"
                    onclick={() => {
                      type = focusedType = LoaderType.VANILLA
                      minecraftVersion = loaderVersion = 'latest_release'
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
                    class:active={loaderVersion === version.loaderVersion && focusedType === LoaderType.VANILLA}
                    type="button"
                    onclick={() => {
                      type = focusedType = LoaderType.VANILLA
                      minecraftVersion = loaderVersion = version.loaderVersion
                    }}
                  >
                    Minecraft {version.loaderVersion}
                  </button>
                {/if}
              {/each}

              <p class="label">Snapshots</p>
              {#each loaderList[focusedType].filter((l) => l.minecraftVersion === focusedMinecraftVersion && l.type.includes('snapshot')) as version}
                {#if version.loaderVersion === 'latest_snapshot'}
                  <button
                    class:active={loaderVersion === version.loaderVersion && focusedType === LoaderType.VANILLA}
                    type="button"
                    onclick={() => {
                      type = focusedType = LoaderType.VANILLA
                      minecraftVersion = loaderVersion = 'latest_snapshot'
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
                    class:active={loaderVersion === version.loaderVersion && focusedType === LoaderType.VANILLA}
                    type="button"
                    onclick={() => {
                      type = focusedType = LoaderType.VANILLA
                      minecraftVersion = loaderVersion = version.loaderVersion
                    }}
                  >
                    Minecraft {version.loaderVersion}
                  </button>
                {/if}
              {/each}
            {:else if focusedType === LoaderType.FORGE}
              <!--* FORGE -->
              <p class="label">Recommended</p>
              {#each loaderList[focusedType].filter((l) => l.minecraftVersion === focusedMinecraftVersion && l.type.includes('recommended')) as version}
                <button
                  class:active={loaderVersion === version.loaderVersion && focusedType === LoaderType.FORGE}
                  type="button"
                  onclick={() => {
                    type = focusedType = LoaderType.FORGE
                    minecraftVersion = version.loaderVersion.split('-')[0].replace('_', '-')
                    loaderVersion = version.loaderVersion
                  }}
                >
                  Minecraft {version.loaderVersion.split('-')[0].replace('_', '-')}
                  (Forge {version.loaderVersion.split('-').slice(1).join('-')})
                </button>
              {:else}
                <p class="no-link">-</p>
              {/each}

              <p class="label">Latest</p>
              {#each loaderList[focusedType].filter((l) => l.minecraftVersion === focusedMinecraftVersion && l.type.includes('latest')) as version}
                <button
                  class:active={loaderVersion === version.loaderVersion && focusedType === LoaderType.FORGE}
                  type="button"
                  onclick={() => {
                    type = focusedType = LoaderType.FORGE
                    minecraftVersion = version.loaderVersion.split('-')[0].replace('_', '-')
                    loaderVersion = version.loaderVersion
                  }}
                >
                  Minecraft {version.loaderVersion.split('-')[0].replace('_', '-')}
                  (Forge {version.loaderVersion.split('-').slice(1).join('-')})
                </button>
              {:else}
                <p class="no-link">-</p>
              {/each}

              <p class="label">All versions</p>
              {#each loaderList[focusedType].filter((l) => l.minecraftVersion === focusedMinecraftVersion) as version}
                <button
                  class:active={loaderVersion === version.loaderVersion && focusedType === LoaderType.FORGE}
                  type="button"
                  onclick={() => {
                    type = focusedType = LoaderType.FORGE
                    minecraftVersion = version.loaderVersion.split('-')[0].replace('_', '-')
                    loaderVersion = version.loaderVersion
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
    </div>

    <div class="actions">
      <button type="button" class="secondary" onclick={() => (show = false)}>{$l.main.cancel}</button>
      <button type="submit" class="primary">{$l.main.save}</button>
    </div>
  </form>
</ModalTemplate>

<style lang="scss">
  @use '../../../static/scss/modals.scss';
  @use '../../../static/scss/list.scss';

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
