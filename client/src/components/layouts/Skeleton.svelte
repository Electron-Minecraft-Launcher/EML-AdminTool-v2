<script lang="ts">
  export let padding: string = '0px'
  export let height: string = '24px'
  export let randomWidth: { times: number, min: number } = { times: 100, min: 30 }
  export let customStyle: { [key: string]: string }[] = []
  let width: string = ''
  let style = ''

  width = (Math.random() * randomWidth.times + randomWidth.min) + 'px'

    style += 'padding: ' + padding + '; '
    style += 'height: ' + height + '; '
    style += 'width: ' + width + '; '

    customStyle.forEach(element => {
      style += Object.entries(element)[0][0] + ': ' + element[Object.entries(element)[0][0]] + ' !important; '
    })
</script>

<span class="span-skeleton" {style} />

<style lang="scss">
  span {
    display: inline-block;
    height: 24px;
    animation-name: skeleton;
    animation-duration: 1.3s;
    animation-timing-function: ease;
    animation-iteration-count: infinite;
    border-radius: 3px;
    min-width: 30px;
  }

  @keyframes skeleton {
    0% {
      background: #e5e5e5;
    }

    40% {
      background: #eaeaea;
    }

    60% {
      background: #e5e5e5;
    }

    100% {
      background: #e5e5e5;
    }
  }
</style>
