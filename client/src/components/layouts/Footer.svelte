<script lang="ts">
  import cookiesService from '../../services/cookies.service'
  import { env } from '../../services/store'
</script>

<footer>
  <hr />
  <p>
    EML AdminTool v{$env.version} – <a href="https://discord.gg/nfEHKtghPh" target="_blank">Discord</a> –
    <a href="https://github.com/Electron-Minecraft-Launcher/EML-AdminTool-v2" target="_blank">GitHub</a>
  </p>
  {#if process.env.NODE_ENV === 'development'}
    <p style="font-size: 9px">
      User JWT: <input
        value={cookiesService.get('JWT')}
        onclick={(e) => {
          // @ts-ignore
          e.target.select()
          // @ts-ignore
          navigator.clipboard.writeText(e.target.value)
        }}
      />
    </p>
  {/if}
</footer>

<style lang="scss">
  footer {
    width: 100%;
    text-align: center;
    margin-top: 75px;
    position: relative;
    z-index: 0;
  }

  p {
    font-size: 13px;
    line-height: 1.4;
    opacity: 0.8;
  }

  hr {
    background-color: #d8d8d8;
    height: 1px;
    border-width: 0px;
    margin-bottom: 30px;
  }

  /**
   * Dev purposes only
   */
  input {
    padding: 3px;
    font-size: 9px;
    box-shadow: none;
    outline: none !important;
    width: 500px;
    display: inline;
  }
</style>
