/**
 * Translated by Quacksometi
 * EML AdminTool v2.0.0-beta.1
 */

export default {
  l: 'da',
  language: 'Dansk',
  main: {
    home: 'Hjem',
    prev: `Forrige`,
    next: `Næste`,
    finish: 'Afslut',
    save: `Gem`,
    cancel: `Annuller`,
    more: `Mere`,
    name: `Navn`,
    serverName: `Servernavn`,
    username: `Brugernavn`,
    password: `Adgangskode`,
    pin: `PIN`,
    actions: `Handlinger`
  },
  setup: {
    setup: `Konfiguration`,
    step1: {
      title: `Først, vælg sproget for din<br />EML&nbsp;AdminTool:`,
      subtitle: `Dette sprog vil blive anvendt for alle brugere.`,
      other: `Jeg taler et andet sprog.`,
      modals: {
        language: {
          title: `Taler du et andet sprog?`,
          content: `EML AdminTool er i øjeblikket kun tilgængelig på fem sprog.<br>
Vi er dog glade for at se, at dette projekt når ud til flere og flere mennesker i forskellige lande!<br>
<br>
Hvis du vil hjælpe med at oversætte EML AdminTool, kan du finde JSON-filerne på vores GitHub og en vejledning om, hvordan du indsender din oversættelse. Hvis den bliver accepteret, vil den blive inkluderet som en standardmulighed i en fremtidig version af EML AdminTool!`
        }
      }
    },
    step2: {
      title: `Nu, vælg en adgangskode til din database:`,
      subtitle: `Du har ikke behov for at huske den.`,
      placeholder: `Database adgangskode`,
      generate: `Generer`,
      veryWeak: `Meget svag`,
      weak: `Svag`,
      medium: `Medium`,
      strong: `Stærk`,
      veryStrong: `Meget stærk`
    },
    step3: {
      title: `Vælg derefter dit servernavn og en adgangskode:`,
      subtitle: `Dette servernavn og adgangskode vil være din admin-konto login.`,
      confirmPassword: `Bekræft adgangskode`
    },
    finally: 'Du kan nu bruge EML&nbsp;AdminTool!'
  },
  auth: {
    login: `Log ind`,
    register: `Registrer`,
    confirmPassword: `Bekræft adgangskode`,
    createAccount: `Opret en konto her.`,
    alreadyAnAccount: `Log ind her.`
  },
  leftPanel: {
    settings: `Indstillinger`,
    features: `Funktioner`,
    logout: `Log ud`
  },
  dashboard: {
    welcome: `Velkommen`,
    information: `Information`,
    permissions: `Tilladelser`,
    emlatSettings: {
      emlatSettings: `EML AdminTool indstillinger`,
      language: `Sprog`,
      newName: `Nyt navn`,
      nbUsers: `Antal brugere`,
      users: `Brugere`,
      pendingUsers: `Ventende brugere`,
      wrongPinUsers: `Forkerte PIN-brugere`,
      deletedUsers: `Slettede brugere`,
      infoOf: `Information om`,
      update: `Opdater`,
      currentVersion: `Aktuel version`,
      latestVersion: `Seneste version`,
      releasedOn: `Udgivet den`,
      runUpdate: `Opdater`,
      seeOnGithub: `Se på GitHub...`,
      vpsAndDocker: `VPS & Docker`,
      dockerInfo: `Docker information`,
      storage: `Lagring`,
      dangerZone: `Farezone`,
      reset: `Nulstil EML AdminTool`,
      emlAdminToolName: `EML AdminTool navn`,
      editEMLAT: `Rediger EML AdminTool information`,
      leaveBlank: `Lad den være blankt, hvis du ikke ønsker at ændre det.`,
      nameWarn: `Ændring af EML AdminTool navn ændrer også dit brugernavn!`,
      regeneratePin: `Generer PIN igen`,
      acceptUser: `Accepter bruger`,
      editUser: `Rediger bruger`
    },
    account: {
      accountSettings: `Kontoindstillinger`,
      accountType: `Kontotype`,
      editAccount: `Rediger konto information`,
      leaveBlank: `Lad være blankt, hvis du ikke ønsker at ændre det.`,
      newUsername: `Nyt brugernavn`,
      newPassword: `Ny adgangskode`,
      dangerZone: `Farezone`,
      deleteAccount: `Slet konto`
    },
    filesUpdater: {
      size: 'Størrelse',
      b: 'B'
    }
  }
}

