<script lang="ts">
  import { Chart } from 'chart.js/auto'
  import { onMount } from 'svelte'

  export let dateSelector: HTMLSelectElement
  export let datesLauncher: { date: Date; startups: number; launches: number; connections: number }[]

  let ctx: HTMLCanvasElement
  let chart: Chart
  let usedDates: { date: Date | string; startups: number; launches: number, connections: number }[]

  onMount(() => {
    usedDates = truncateLabel(datesLauncher, 72)!
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: usedDates.map((date) => formatDate(date.date as Date)),
        datasets: [
          {
            label: 'Startups',
            data: usedDates.map((date) => date.startups),
            backgroundColor: '#1b6ef3a0',
            fill: true,
            order: 0
          },
          {
            label: 'Connections',
            data: usedDates.map((date) => date.connections),
            backgroundColor: '#ef313ca0',
            fill: true,
            order: 1
          },
          {
            label: 'Launches',
            data: usedDates.map((date) => date.launches),
            backgroundColor: '#52a535a0',
            fill: true,
            order: 2
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        aspectRatio: 1,
        responsive: true,
        plugins: {
          legend: { display: true, position: 'bottom', labels: { padding: 30 } },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              title: function (tooltipItems) {
                if (tooltipItems.length) {
                  const index = tooltipItems[0].dataIndex
                  return `${formatDate(usedDates[index].date)}`
                }
                return ''
              },
              label: function (context) {
                let label = context.dataset.label || ''

                if (label) {
                  label += ': '
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y
                }
                return label
              }
            }
          }
        },
        elements: {
          point: { radius: 0 }
        },
        scales: {
          x: { display: false, reverse: false },
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        },
        interaction: { mode: 'x', intersect: false }
      }
    })
  })

  $: if (dateSelector) {
    dateSelector.addEventListener('change', () => {
      if (ctx) {
        // @ts-ignore
        usedDates = truncateLabel(datesLauncher, dateSelector.value)
        chart.data.labels = usedDates.map(
          (date) => formatDate(date.date),
          dateSelector.value === '81000' ? 'month' : dateSelector.value === '5400' ? 'day' : 'hour'
        )
        chart.data.datasets[0].data = usedDates.map((date) => date.startups)
        chart.data.datasets[1].data = usedDates.map((date) => date.connections)
        chart.data.datasets[2].data = usedDates.map((date) => date.launches)
        // @ts-ignore
        chart.options.plugins.tooltip.callbacks.title = function (tooltipItems) {
          if (tooltipItems.length) {
            const index = tooltipItems[0].dataIndex
            return `${formatDate(usedDates[index].date, dateSelector.value === '81000' ? 'month' : dateSelector.value === '5400' ? 'day' : 'hour')}`
          }
          return ''
        }
        chart.update()
      }
    })
  }

  function formatDate(date: Date | string, type: 'hour' | 'day' | 'month' = 'hour') {
    date = new Date(date)
    if (type === 'day') {
      return date.toLocaleDateString('fr-FR')
    }
    if (type === 'month') {
      return date.toLocaleDateString('fr-FR', { month: 'long' })
    }
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false }
    const startHour = date.toLocaleString('fr-FR', options)
    const endHour = new Date(date.setHours(date.getHours() + 1)).toLocaleString('fr-FR', { hour: '2-digit', hour12: false })

    return `${startHour} - ${endHour}`.replace(/:\d{2}/g, '')
  }

  /**
   * @param dates The dates to truncate
   * @param length The number of hours to display
   */
  function truncateLabel(dates: { date: Date; startups: number; launches: number; connections: number }[], length: number) {
    if (length <= 360) {
      return dates.slice(-length)
    }

    if (length <= 5400) {
      let usableDates = dates.slice(-length)
      if (usableDates.length === 0) return []

      while (usableDates[0].date.getHours() !== 0) {
        usableDates.shift()
      }
      const days = []
      for (let i = 0; i < length; i++) {
        if (usableDates[i]) {
          if (usableDates[i].date.getHours() === 0) {
            days.push({ date: usableDates[i].date, startups: 0, launches: 0 , connections: 0})
          }
          days[days.length - 1].startups += usableDates[i].startups
          days[days.length - 1].launches += usableDates[i].launches
          days[days.length - 1].connections += usableDates[i].connections
        }
      }
      return days.slice(-360)
    }

    if (length <= 81000) {
      let usableDates = dates.slice(-length)
      if (usableDates.length === 0) return []

      while (usableDates[0].date.getHours() !== 0 || usableDates[0].date.getDate() !== 1) {
        usableDates.shift()
      }
      const months = []
      for (let i = 0; i < length; i++) {
        if (usableDates[i]) {
          if (usableDates[i].date.getDate() === 1 && usableDates[i].date.getHours() === 0) {
            months.push({ date: usableDates[i].date, startups: 0, launches: 0, connections: 0})
          }
          months[months.length - 1].startups += usableDates[i].startups
          months[months.length - 1].launches += usableDates[i].launches
          months[months.length - 1].connections += usableDates[i].connections
        }
      }
      return months.slice(-360)
    }
  }
</script>

<canvas bind:this={ctx}></canvas>

<style lang="scss">
  canvas {
    margin-top: 30px;
    max-width: 100%;
    height: 300px;
    max-height: 300px;
  }
</style>
