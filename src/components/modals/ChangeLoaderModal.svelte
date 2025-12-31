<script lang="ts">
  import { ILoaderType, type LoaderType, type Loader } from '$lib/utils/db'
  import type { LoaderVersion } from '$lib/utils/types'
  import ModalTemplate from './__ModalTemplate.svelte'
  import LoadingSplash from '../layouts/LoadingSplash.svelte'
  import { l } from '$lib/stores/language'
  import type { SubmitFunction } from '@sveltejs/kit'
  import { applyAction, enhance } from '$app/forms'
  import { NotificationCode } from '$lib/utils/notifications'
  import { addNotification } from '$lib/stores/notifications'

  interface Props {
    show: boolean
    loader: Loader
    loaderList: { [key: string]: LoaderVersion[] }
  }

  let { show = $bindable(), loader, loaderList }: Props = $props()

  const latestInfo = 'Choosing this version will always force the Launcher to download the latest release.'

  let showLoader = $state(false)
  let type: LoaderType = $state(loader.type ?? ILoaderType.VANILLA)
  let minecraftVersion = $state(loader.minecraftVersion ?? '')
  let minecraftMajorVersion = $state(
    loader.minecraftVersion?.includes('latest') ? 'Latest' : (loader.minecraftVersion?.split('.').slice(0, 2).join('.') ?? '')
  )
  let loaderVersion = $state(loader.loaderVersion ?? '')
  let minecraftVersions = $derived([...new Set(loaderList[type].map((version) => version.minecraftVersion))])
  let isFormValid = $derived.by(() => {
    return minecraftVersion && loaderVersion && type
  })

  function switchType(newType: LoaderType) {
    type = newType
    minecraftVersion = minecraftVersions[0]
    loaderVersion = ''
  }

  function switchMinecraftVersion(newVersion: string) {
    minecraftMajorVersion = newVersion
    loaderVersion = ''
  }

  function setVersion(selectedType: LoaderType, selectedVersion: LoaderVersion) {
    type = selectedType
    minecraftVersion =
      type === ILoaderType.FORGE
        ? selectedVersion.loaderVersion.split('-')[0].replace('_', '-')
        : type === ILoaderType.FABRIC
          ? selectedVersion.loaderVersion.split('+')[0]
          : selectedVersion.loaderVersion
    loaderVersion = type === ILoaderType.FABRIC ? selectedVersion.loaderVersion.split('+')[1] : selectedVersion.loaderVersion
  }

  function isActive(selectedType: LoaderType, selectedVersion: LoaderVersion) {
    if (selectedType !== type) return false

    if (selectedType === ILoaderType.FABRIC) {
      return selectedVersion.loaderVersion === `${minecraftVersion}+${loaderVersion}`
    }
    
    return selectedVersion.loaderVersion === loaderVersion
  }

  const enhanceForm: SubmitFunction = ({ formData }) => {
    showLoader = true
    formData.set('type', type)
    formData.set('minecraft-version', minecraftVersion)
    formData.set('loader-version', loaderVersion)

    return async ({ result, update }) => {
      await update({ reset: false })
      showLoader = false

      if (result.type === 'failure') {
        const message = $l.notifications[result.data?.failure as NotificationCode] ?? $l.notifications.INTERNAL_SERVER_ERROR
        addNotification('ERROR', message)
      } else if (result.type === 'success') {
        show = false
      }

      await applyAction(result)
    }
  }

  $effect(() => {
    if (!minecraftVersions.includes(minecraftMajorVersion)) {
      minecraftMajorVersion = minecraftVersions[0]
    }
  })
</script>

<ModalTemplate size={'ml'} bind:show>
  {#if showLoader}
    <LoadingSplash transparent />
  {/if}

  <form method="POST" action="?/changeLoader" use:enhance={enhanceForm}>
    <h2>Change loader</h2>

    <div class="list-container">
      <div class="list loader-list">
        <p class="label" style="margin-top: 0; position: sticky; top: 0; background: white">Loaders</p>
        <button class="list" type="button" class:active={type === ILoaderType.VANILLA} onclick={() => switchType(ILoaderType.VANILLA)}>Vanilla</button
        >
        <button class="list" type="button" class:active={type === ILoaderType.FORGE} onclick={() => switchType(ILoaderType.FORGE)}>Forge</button>
        <button class="list" type="button" class:active={type === ILoaderType.FABRIC} onclick={() => switchType(ILoaderType.FABRIC)}>Fabric</button>
      </div>

      <div class="list version-list">
        <p class="label" style="margin-top: 0; position: sticky; top: 0; background: white; z-index: 100">Minecraft versions</p>
        {#each minecraftVersions as version}
          <button class="list" type="button" class:active={minecraftMajorVersion === version} onclick={() => switchMinecraftVersion(version)}>
            {version}
          </button>
        {/each}
      </div>

      <div class="list content-list">
        <h4>
          {type === ILoaderType.FORGE ? 'Minecraft Forge' : type === ILoaderType.FABRIC ? 'Minecraft Fabric' : 'Minecraft Vanilla'}
          {minecraftMajorVersion === 'Latest' ? minecraftMajorVersion : `${minecraftMajorVersion}.x`}
        </h4>

        {#if type === ILoaderType.VANILLA}
          <!--* VANILLA -->
          <p class="label">Releases</p>
          {#each loaderList[type].filter((l) => l.minecraftVersion === minecraftMajorVersion && l.type.includes('release')) as version}
            {#if version.loaderVersion === 'latest_release'}
              <button type="button" class:active={isActive(ILoaderType.VANILLA, version)} onclick={() => setVersion(ILoaderType.VANILLA, version)}>
                Latest Minecraft release&nbsp;&nbsp;<i class="fa-solid fa-circle-question" title={latestInfo} style="cursor: help"></i>
              </button>
            {:else}
              <button type="button" class:active={isActive(ILoaderType.VANILLA, version)} onclick={() => setVersion(ILoaderType.VANILLA, version)}>
                Minecraft {version.loaderVersion}
              </button>
            {/if}
          {/each}

          <p class="label">Snapshots</p>
          {#each loaderList[type].filter((l) => l.minecraftVersion === minecraftMajorVersion && l.type.includes('snapshot')) as version}
            {#if version.loaderVersion === 'latest_snapshot'}
              <button type="button" class:active={isActive(ILoaderType.VANILLA, version)} onclick={() => setVersion(ILoaderType.VANILLA, version)}>
                Latest Minecraft snapshot&nbsp;&nbsp;<i class="fa-solid fa-circle-question" title={latestInfo} style="cursor: help"></i>
              </button>
            {:else}
              <button type="button" class:active={isActive(ILoaderType.VANILLA, version)} onclick={() => setVersion(ILoaderType.VANILLA, version)}>
                Minecraft {version.loaderVersion}
              </button>
            {/if}
          {:else}
            <p class="no-link">-</p>
          {/each}
        {:else if type === ILoaderType.FORGE}
          <!--* FORGE -->
          <p class="label">Recommended</p>
          {#each loaderList[type].filter((l) => l.minecraftVersion === minecraftMajorVersion && l.type.includes('recommended')) as version}
            <button type="button" class:active={isActive(ILoaderType.FORGE, version)} onclick={() => setVersion(ILoaderType.FORGE, version)}>
              Minecraft {version.loaderVersion.split('-')[0].replace('_', '-')} (Forge {version.loaderVersion.split('-').slice(1).join('-')})
            </button>
          {:else}
            <p class="no-link">-</p>
          {/each}

          <p class="label">Latest</p>
          {#each loaderList[type].filter((l) => l.minecraftVersion === minecraftMajorVersion && l.type.includes('latest')) as version}
            <button type="button" class:active={isActive(ILoaderType.FORGE, version)} onclick={() => setVersion(ILoaderType.FORGE, version)}>
              Minecraft {version.loaderVersion.split('-')[0].replace('_', '-')} (Forge {version.loaderVersion.split('-').slice(1).join('-')})
            </button>
          {:else}
            <p class="no-link">-</p>
          {/each}

          <p class="label">All versions</p>
          {#each loaderList[type].filter((l) => l.minecraftVersion === minecraftMajorVersion) as version}
            <button type="button" class:active={isActive(ILoaderType.FORGE, version)} onclick={() => setVersion(ILoaderType.FORGE, version)}>
              Minecraft {version.loaderVersion.split('-')[0].replace('_', '-')} (Forge {version.loaderVersion.split('-').slice(1).join('-')})
            </button>
          {:else}
            <p class="no-link">-</p>
          {/each}
        {:else if type === ILoaderType.FABRIC}
          <!--* FABRIC -->
          <p class="label">Releases</p>
          {#each loaderList[type].filter((l) => l.minecraftVersion === minecraftMajorVersion && l.type.includes('release')) as version}
            <button type="button" class:active={isActive(ILoaderType.FABRIC, version)} onclick={() => setVersion(ILoaderType.FABRIC, version)}>
              Minecraft {version.loaderVersion.split('+')[0].replace('_', '-')} (Fabric {version.loaderVersion.split('+')[1]})
            </button>
          {:else}
            <p class="no-link">-</p>
          {/each}

          <p class="label">Snapshots</p>
          {#each loaderList[type].filter((l) => l.minecraftVersion === minecraftMajorVersion && l.type.includes('snapshot')) as version}
            <button type="button" class:active={isActive(ILoaderType.FABRIC, version)} onclick={() => setVersion(ILoaderType.FABRIC, version)}>
              Minecraft {version.loaderVersion.split('+')[0].replace('_', '-')} (Fabric {version.loaderVersion.split('+')[1]})
            </button>
          {:else}
            <p class="no-link">-</p>
          {/each}
        {/if}
      </div>
    </div>

    <div class="actions">
      <button type="button" class="secondary" onclick={() => (show = false)}>{$l.main.cancel}</button>
      <button type="submit" class="primary" disabled={!isFormValid}>{$l.main.save}</button>
    </div>
  </form>
</ModalTemplate>

<style lang="scss">
  @use '../../../static/scss/modals.scss';
  @use '../../../static/scss/list.scss';

  div.list {
    min-height: calc(100vh - 175px - 30px - 35px - 71px) !important;
    max-height: calc(100vh - 175px - 30px - 35px - 71px) !important;
    overflow-y: auto;

    &.loader-list {
      flex: 0.3 !important;
    }

    &.version-list {
      flex: 0.3 !important;
    }

    &.content-list {
      flex: 1 !important;

      h4 {
        margin-top: 0;
        position: sticky;
        top: 0;
        background: white;
        z-index: 100;
      }
    }

    button {
      display: block;
      border-bottom: none;
      color: #1e1e1e;
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-family: 'Poppins';
      background: none;
      width: 100% !important;
      line-height: 15px;
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
  }
</style>
