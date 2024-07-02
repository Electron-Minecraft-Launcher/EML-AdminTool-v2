<script lang="ts">
  import { Chart } from 'chart.js/auto'
  import { onMount } from 'svelte'

  export let datesDevTools: { date: Date; devtools: number }[]
  export let datesOS: { date: Date; os: { windows: number; mac: number; linux: number } }[]

  let ctx2: HTMLCanvasElement
  let chart2: Chart
  let usedDatesDevTools: { date: Date | string; devtools: number }[]

  let ctx1: HTMLCanvasElement
  let chart1: Chart
  let counterOS: { windows: number; mac: number; linux: number } = datesOS
    .slice(-2160)
    .map((date) => date.os)
    .reduce(
      (acc, curr) => {
        acc.windows += curr.windows
        acc.mac += curr.mac
        acc.linux += curr.linux
        return acc
      },
      { windows: 0, mac: 0, linux: 0 }
    )

  onMount(() => {
    chart1 = new Chart(ctx1, {
      type: 'doughnut',
      data: {
        labels: ['Windows', 'Mac', 'Linux'],
        datasets: [
          {
            label: 'OS',
            data: [counterOS.windows, counterOS.mac, counterOS.linux],
            backgroundColor: ['#1baaff', '#bebebe', '#FFCE56']
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        aspectRatio: 1,
        responsive: true,
        plugins: {
          legend: { display: true, position: 'bottom', labels: { padding: 30 } }
        }
      }
    } as any)

    usedDatesDevTools = truncateLabel(datesDevTools)!
    chart2 = new Chart(ctx2, {
      type: 'line',
      data: {
        labels: usedDatesDevTools.map((date) => formatDate(date.date as Date)),
        datasets: [
          {
            label: 'Opening DevTools',
            data: usedDatesDevTools.map((date) => date.devtools),
            backgroundColor: '#1b6ef3a0',
            fill: true,
            order: 1
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
                  return `${formatDate(usedDatesDevTools[index].date)}`
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
   */
  function truncateLabel(dates: { date: Date; devtools: number }[]) {
    let usableDates = dates.slice(-2160)
    if (usableDates.length === 0) return []
    while (usableDates[0].date.getHours() !== 0) {
      usableDates.shift()
    }
    const days = []
    for (let i = 0; i < 2160; i++) {
      if (usableDates[i]) {
        if (usableDates[i].date.getHours() === 0) {
          days.push({ date: usableDates[i].date, devtools: 0 })
        }
        days[days.length - 1].devtools += usableDates[i].devtools
      }
    }
    return days.slice(-360)
  }
</script>

<div class="chart-container">
  <canvas bind:this={ctx1}></canvas>
</div>
<div class="chart-container">
  <canvas bind:this={ctx2}></canvas>
</div>

<style lang="scss">
  div.chart-container {
    display: inline-block;
    margin-top: 30px;
    max-width: calc(50% - 15px);
    width: calc(50% - 15px);
    height: 300px;
    max-height: 300px;
    vertical-align: top;

    &:nth-of-type(1) {
      margin-right: 25px;
    }
  }
</style>
