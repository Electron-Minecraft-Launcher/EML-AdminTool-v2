<script lang="ts">
  import { onMount } from 'svelte'
  import { env, user } from '../../../../services/store'
  import type { PageData } from './$types'
  import LauncherStatsChart from '../../../../components/charts/LauncherStatsChart.svelte'
  import TechnicalStatsChart from '../../../../components/charts/TechnicalStatsChart.svelte'
  import apiStatsService from '../../../../services/api/api-stats.service'

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()

  let data_: PageData = $state(data)
  const today = new Date(new Date().setMinutes(0, 0, 0))

  let datesLauncher: { date: Date; startups: number; launches: number; connections: number }[] = $state([])
  let datesDevTools: { date: Date; devtools: number }[] = $state([])
  let datesOS: { date: Date; os: { windows: number; mac: number; linux: number } }[] = $state([])

  let dateSelector: HTMLSelectElement | undefined = $state()

  onMount(() => {
    if (data_.stats.startups.length > 0) {
      datesLauncher.push({ date: new Date(data_.stats.startups[0].date), startups: 0, launches: 0, connections: 0 })
    }
    if (data_.stats.launches.length > 0) {
      datesLauncher.push({ date: new Date(data_.stats.launches[0].date), startups: 0, launches: 0, connections: 0 })
    }
    if (data_.stats.connections.length > 0) {
      datesLauncher.push({ date: new Date(data_.stats.connections[0].date), startups: 0, launches: 0, connections: 0 })
    }
    if (datesLauncher.length > 0) {
      datesLauncher = datesLauncher.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 1)
      datesLauncher[0].date.setMinutes(0, 0, 0)
    }

    if (data_.stats.devtools.length > 0) {
      datesDevTools.push({ date: new Date(data_.stats.devtools[0].date), devtools: 0 })
    }
    if (datesDevTools.length > 0) {
      datesDevTools[0].date.setMinutes(0, 0, 0)
    }

    if (data_.stats.launches.length > 0) {
      datesOS.push({ date: new Date(data_.stats.launches[0].date), os: { windows: 0, mac: 0, linux: 0 } })
    }
    if (datesOS.length > 0) {
      datesOS[0].date.setMinutes(0, 0, 0)
    }

    if (datesLauncher.length > 0) {
      let currentDateLauncher = new Date(datesLauncher[0].date)
      while (currentDateLauncher < today) {
        currentDateLauncher = new Date(currentDateLauncher.setHours(currentDateLauncher.getHours() + 1))
        datesLauncher.push({ date: new Date(currentDateLauncher), startups: 0, launches: 0, connections: 0 })
      }
    }

    if (datesDevTools.length > 0) {
      let currentDateDevTools = new Date(datesDevTools[0].date)
      while (currentDateDevTools < today) {
        currentDateDevTools = new Date(currentDateDevTools.setHours(currentDateDevTools.getHours() + 1))
        datesDevTools.push({ date: new Date(currentDateDevTools), devtools: 0 })
      }
    }

    data_.stats.startups.forEach(({ date }: { date: Date; os: 'windows' | 'mac' | 'linux' }) => {
      date = new Date(date)
      const index = datesLauncher.findIndex((d) => d.date.getTime() <= date.getTime() && d.date.getTime() + 3600000 > date.getTime())
      if (index !== -1) {
        datesLauncher[index].startups++
      }
    })
    data_.stats.connections.forEach(({ date }: { date: Date }) => {
      date = new Date(date)
      const index = datesLauncher.findIndex((d) => d.date.getTime() <= date.getTime() && d.date.getTime() + 3600000 > date.getTime())
      if (index !== -1) {
        datesLauncher[index].connections++
      }
    })
    data_.stats.launches.forEach(({ date, os }: { date: Date; os: 'windows' | 'mac' | 'linux' }) => {
      date = new Date(date)
      const index = datesLauncher.findIndex((d) => d.date.getTime() <= date.getTime() && d.date.getTime() + 3600000 > date.getTime())
      const index2 = datesOS.findIndex((d) => d.date.getTime() <= date.getTime() && d.date.getTime() + 3600000 > date.getTime())
      if (index !== -1) {
        datesLauncher[index].launches++
        datesOS[index2].os[os]++
      }
    })
    data.stats.devtools.forEach(({ date }: { date: Date }) => {
      date = new Date(date)
      const index = datesDevTools.findIndex((d) => d.date.getTime() <= date.getTime() && d.date.getTime() + 3600000 > date.getTime())
      if (index !== -1) {
        datesDevTools[index].devtools++
      }
    })
  })

  async function resetStats() {
    if (confirm('Are you sure you want to reset the statistics?')) {
      ;(await apiStatsService.deleteStats()).subscribe({
        next: () => {
          window.location.reload()
        }
      })
    }
  }
</script>

<svelte:head>
  <title>Statistics • {$env.name} AdminTool</title>
</svelte:head>

<h2>
  Statistics&nbsp;&nbsp;<i
    class="fa-solid fa-exclamation-circle"
    style="opacity: 0.7; font-size: 18px; position: relative; top: -3px; cursor: help"
    title="Be careful! The statistics are here for reference only. They are not 100 % accurate (the statistics API is not secure and can be easily manipulated)."
  ></i>
</h2>

<section class="section" style="position: relative;">
  <select class="right" name="truncate" id="truncate" bind:this={dateSelector}>
    <option value="72">Last 3 days</option>
    <option value="360">Last 15 days</option>
    <option value="5400">Last 6 months</option>
    <option value="81000">Last 5 years</option>
  </select>

  <h3>Launcher statistics</h3>

  <LauncherStatsChart bind:datesLauncher bind:dateSelector />
</section>

<section class="section" style="position: relative;">
  <h3>Technical statistics</h3>

  <TechnicalStatsChart bind:datesDevTools bind:datesOS />
</section>

{#if $user.p_stats_del == 1}
  <section class="section">
    <h3>Reset</h3>

    <button class="secondary reset" onclick={resetStats}><i class="fa-solid fa-trash"></i>&nbsp;&nbsp;Reset statistics</button>
  </section>
{/if}

<style lang="scss">
  @use '../../../../assets/scss/dashboard.scss';

  button.reset {
    color: #6e2626;
  }
</style>
