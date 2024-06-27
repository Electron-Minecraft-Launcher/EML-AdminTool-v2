<script lang="ts">
  export let status: boolean
  export let text: string[] = ['Enabled', 'Disabled']
</script>

<label class="switch p">
  <div style="display: inline">
    <input type="checkbox" bind:checked={status} />
    <span class="slider round"></span>
  <span style="padding-left: 35px">{status ? text[0] : text[1]}</span>
</label>

<style lang="scss">
  label.switch {
    position: relative;
    display: inline-block;
    width: 30px;
    height: 17px;
    margin-top: 0;
    white-space: nowrap;
    transition: all 0.2s ease;
    cursor: pointer;

    input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    &:hover span.slider {
      background: var(--secondary-color-hover);

    }

    &:hover input:checked + span.slider {
      background: var(--primary-color-hover);
    }

    &:active {
      transform: translateY(1px);
    }
  }

  span.slider {
    position: absolute;
    cursor: pointer;
    height: 17px;
    top: 3px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--secondary-color);
    transition: 0.3s;
  }

  .slider:before {
    position: absolute;
    content: '';
    height: 13px;
    width: 13px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: 0.2s;
  }

  input:checked + .slider {
    background-color: var(--primary-color);
  }

  input:checked + .slider:before {
    transform: translateX(13px);
  }

  .slider.round {
    border-radius: 50rem;
  }

  .slider.round:before {
    border-radius: 50%;
  }
</style>
