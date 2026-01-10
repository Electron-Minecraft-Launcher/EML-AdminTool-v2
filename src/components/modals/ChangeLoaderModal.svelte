
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
    fabricLoaderVersions: string[]
    loaderList: { [key: string]: LoaderVersion[] }
  }

  let { show = $bindable(), loader, fabricLoaderVersions, loaderList }: Props = $props()

  const latestInfo = 'Choosing this version will always force the Launcher to download the latest release.'

  let showLoader = $state(false)
  let type: LoaderType = $state(loader.type ?? ILoaderType.VANILLA)
  let minecraftVersion = $state(loader.minecraftVersion ?? '')
  let minecraftMajorVersion = $state(
    loader.minecraftVersion?.includes('latest')
      ? 'Latest'
      : (loader.minecraftVersion?.split('.').slice(0, 2).join('.') ?? '')
  )
  let loaderVersion = $state(loader.loaderVersion ?? '')
  let minecraftVersions = $derived([...new Set(loaderList[type].map((version) => version.minecraftVersion))])
  let visibleVersions = $derived(loaderList[type]?.filter((l) => l.minecraftVersion === minecraftMajorVersion) || [])

  let isFormValid = $derived.by(() => {
    return minecraftVersion && loaderVersion && type
  })
  let tempFabricLoaderVersion: string = $state(
    loader.type === ILoaderType.FABRIC && loader.loaderVersion ? loader.loaderVersion : fabricLoaderVersions[0] ?? ''
  )

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
    if (type === ILoaderType.FORGE) {
      minecraftVersion = selectedVersion.loaderVersion.split('-')[0].replace('_', '-')
    } else {
      minecraftVersion = selectedVersion.loaderVersion
    }
    loaderVersion = type === ILoaderType.FABRIC ? tempFabricLoaderVersion : selectedVersion.loaderVersion
  }

  function isActive(selectedVersion: LoaderVersion) {
    if (type === ILoaderType.FABRIC) {
      return selectedVersion.loaderVersion === minecraftVersion && loaderVersion === tempFabricLoaderVersion
    }
    return selectedVersion.loaderVersion === loaderVersion
  }

  function formatVersionName(version: LoaderVersion): string {
    if (type === ILoaderType.FORGE) {
      const mcVer = version.loaderVersion.split('-')[0].replace('_', '-')
      const forgeVer = version.loaderVersion.split('-').slice(1).join('-')
      return `Minecraft ${mcVer} (Forge ${forgeVer})`
    }
    if (type === ILoaderType.FABRIC) {
      const mcVer = version.loaderVersion.split('+')[0].replace('_', '-')
      return `Minecraft ${mcVer} (Fabric ${tempFabricLoaderVersion})`
    }
    if (version.loaderVersion === 'latest_release') return 'Latest Minecraft release'
    if (version.loaderVersion === 'latest_snapshot') return 'Latest Minecraft snapshot'
    return `Minecraft ${version.loaderVersion}`
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

  function getGroupedVersions(type: LoaderType, versions: LoaderVersion[]) {
    const groups: { label: string; versions: LoaderVersion[] }[] = []

    if (type === ILoaderType.VANILLA || type === ILoaderType.FABRIC) {
      const releases = versions.filter((v) => v.type.includes('release'))
      if (releases.length) groups.push({ label: 'Releases', versions: releases })

      const snapshots = versions.filter((v) => v.type.includes('snapshot'))
      if (snapshots.length) groups.push({ label: 'Snapshots', versions: snapshots })
    } else if (type === ILoaderType.FORGE) {
      const recommended = versions.filter((v) => v.type.includes('recommended'))
      if (recommended.length) groups.push({ label: 'Recommended', versions: recommended })

      const latest = versions.filter((v) => v.type.includes('latest'))
      if (latest.length) groups.push({ label: 'Latest', versions: latest })

      if (versions.length) groups.push({ label: 'All versions', versions })
    }

    return groups
  }
</script>

<ModalTemplate size={'ml'} bind:show>
  {#if showLoader}
    <LoadingSplash transparent />
  {/if}

  <form method="POST" action="?/changeLoader" use:enhance={enhanceForm}>
    <h2>Change loader</h2>

    <div class="list-container">
      <div class="list loader-list">
        <p class="label sticky-header">Loaders</p>
        <button class="list" type="button" class:active={type === ILoaderType.VANILLA} onclick={() => switchType(ILoaderType.VANILLA)}>Vanilla</button
        >
        <button class="list" type="button" class:active={type === ILoaderType.FORGE} onclick={() => switchType(ILoaderType.FORGE)}>Forge</button>
        <button class="list" type="button" class:active={type === ILoaderType.FABRIC} onclick={() => switchType(ILoaderType.FABRIC)}>Fabric</button>
      </div>

      <div class="list version-list">
        {#if type === ILoaderType.FABRIC}
          <label for="loader-version" class="sticky-header" style="z-index: 100">Loader version</label>
          <select name="loader-version" id="loader-version" class="loader-list-select" bind:value={tempFabricLoaderVersion}>
            {#each fabricLoaderVersions as version}
              <option value={version}>{version}</option>
            {/each}
          </select>
        {/if}
        <p class="label sticky-header" style="z-index: 100">Minecraft versions</p>
        {#each minecraftVersions as version}
          <button
            class="list"
            type="button"
            class:active={minecraftMajorVersion === version}
            onclick={() => switchMinecraftVersion(version)}
          >
            {version}
          </button>
        {/each}
      </div>

      <div class="list content-list">
        <h4>
          {type === ILoaderType.FORGE ? 'Minecraft Forge' : type === ILoaderType.FABRIC ? 'Minecraft Fabric' : 'Minecraft Vanilla'}
          {minecraftMajorVersion === 'Latest' || minecraftMajorVersion === 'Snapshots' ? minecraftMajorVersion : `${minecraftMajorVersion}.x`}
        </h4>

        {#each getGroupedVersions(type, visibleVersions) as group}
          <p class="label">{group.label}</p>
          {#each group.versions as version}
            <button type="button" class:active={isActive(version)} onclick={() => setVersion(type, version)}>
              {formatVersionName(version)}
              {#if version.loaderVersion === 'latest_release' || version.loaderVersion === 'latest_snapshot'}
                &nbsp;&nbsp;<i class="fa-solid fa-circle-question" title={latestInfo} style="cursor: help"></i>
              {/if}
            </button>
          {:else}
            <p class="no-link">-</p>
          {/each}
        {:else}
           <p class="no-link">-</p>
        {/each}
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

  .sticky-header {
    margin-top: 0;
    position: sticky;
    top: 0;
    background: white;
  }

  div.list {
    min-height: calc(100vh - 175px - 30px - 35px - 71px) !important;
    max-height: calc(100vh - 175px - 30px - 35px - 71px) !important;
    overflow-y: auto;

    &.loader-list {
      flex: 0.3 !important;
    }

    &.version-list {
      flex: 0.35 !important;

      select.loader-list-select {
        display: block;
        width: 100%;
        margin-bottom: 20px;
      }
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