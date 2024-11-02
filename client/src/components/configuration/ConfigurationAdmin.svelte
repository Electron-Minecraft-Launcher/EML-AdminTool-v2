<script lang="ts">
  import ConfigurationFormTemplate from './ConfigurationFormTemplate.svelte'
  import { l } from '../../services/store'

  let relN: string = $state('')
  let rel: string = $state('   ')

  let data: { data: 'LANGUAGE' | 'DATABASE' | 'ADMIN'; value: any } = $state({
    data: 'ADMIN',
    value: {
      name: '',
      password: ''
    }
  })

  function inputChange() {
    if (!data.value.password) {
      rel = $l.configuration.step2.veryWeak
      return
    }

    var len = 0
    if (data.value.password.length >= 12) {
      len = 1
    }

    var upp = 0
    if (data.value.password.match(/^(?=.*[a-z])(?=.*[A-Z]).+$/)) {
      upp = 1
    }

    var num = 0
    if (data.value.password.match(/^(?=.*\d).+$/)) {
      num = 1
    }

    var spe = 0
    if (data.value.password.match(/^(?=.*[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]).+$/)) {
      spe = 1
    }

    switch (len + upp + num + spe) {
      case 0:
        rel = $l.configuration.step2.veryWeak
        relN = 0 + ''
        break
      case 1:
        if (data.value.password.length >= 5) {
          rel = $l.configuration.step2.weak
          relN = 1 + ''
        }
        break
      case 2:
        if (data.value.password.length >= 8) {
          rel = $l.configuration.step2.ok
          relN = 2 + ''
        }
        break
      case 3:
        if (data.value.password.length >= 8) {
          rel = $l.configuration.step2.strong
          relN = 3 + ''
        }
        break
      case 4:
        if (data.value.password.length >= 12) {
          rel = $l.configuration.step2.veryStrong
          relN = 4 + ''
        }
        break
      default:
        break
    }
  }

  function generatePassword() {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
    const numericChars = '0123456789'
    const specialChars = '!@#$%^&*()_+-=[]{};\': "\\|,.<>/?'
    let password = ''

    password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length))
    password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length))
    password += numericChars.charAt(Math.floor(Math.random() * numericChars.length))
    password += specialChars.charAt(Math.floor(Math.random() * specialChars.length))

    while (password.length < 16) {
      const charSet = uppercaseChars + lowercaseChars + numericChars + specialChars
      password += charSet.charAt(Math.floor(Math.random() * charSet.length))
    }

    let chars = password.split('')
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[chars[i], chars[j]] = [chars[j], chars[i]]
    }
    password = chars.join('')

    data.value = password

    inputChange()
  }
</script>

<ConfigurationFormTemplate step={2} cond={+relN >= 3 && data.value.name.length > 2} {data} on:nextStep on:prevStep>
  <h2>{@html $l.configuration.step3.title}</h2>
  <p><b>{@html $l.configuration.step3.subtitle}</b></p>
  <div class="actions">
    <input type="text" name="name" placeholder={$l.main.serverName} bind:value={data.value.name} />
    <input type="password" name="password" placeholder={$l.main.password} bind:value={data.value.password} onkeyup={inputChange} />

    <div class="rel-progress">
      <div
        class="rel-progress-in"
        class:progress-0={relN == '0'}
        class:progress-1={relN == '1'}
        class:progress-2={relN == '2'}
        class:progress-3={relN == '3'}
        class:progress-4={relN == '4'}
      ></div>
    </div>

    <span class="rel">{rel}</span>
  </div>
</ConfigurationFormTemplate>

<style lang="scss">
  @use '../../assets/scss/configure.scss';

  // div.flex {
  //   display: flex;
  //   flex-direction: row;

  //   input {
  //     flex-grow: calc(100% - 50px);
  //   }

  //   button.secondary {
  //     margin-top: 15px;
  //     margin-left: 20px;
  //     white-space: nowrap;
  //   }
  // }

  div.rel-progress {
    width: 130px;
    border-radius: 50rem;
    background-color: #f3f3f3;
    display: inline-block;
    height: 7px;
    margin-top: 13px;
  }

  div.rel-progress-in {
    border-radius: 50rem;
    height: 7px;
    transition: all 0.2s;

    &.progress-0 {
      width: 10%;
      background: #8b0000;
    }

    &.progress-1 {
      width: 25%;
      background: #ad2c0b;
    }

    &.progress-2 {
      width: 50%;
      background: #d86608;
    }

    &.progress-3 {
      width: 75%;
      background: #71bd0d;
    }

    &.progress-4 {
      width: 100%;
      background: #04921c;
    }
  }

  span.rel {
    display: inline-block;
    margin-left: 15px;
    font-weight: 500;
    font-size: 14px;
    margin-top: 10px;
  }
</style>
