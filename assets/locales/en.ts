import { NotificationCode } from '$lib/utils/notifications'

export default {
  l: 'en',
  language: 'English',
  main: {
    home: 'Home',
    prev: `Previous`,
    next: `Next`,
    finish: 'Finish',
    save: `Save`,
    cancel: `Cancel`,
    more: `More`,
    name: `Name`,
    serverName: `Server name`,
    username: `Username`,
    password: `Password`,
    pin: `PIN`,
    actions: `Actions`
  },
  notifications: {
    [NotificationCode.INVALID_INPUT]: `Invalid input.`,
    [NotificationCode.MISSING_INPUT]: `Missing input.`,
    [NotificationCode.UNAUTHORIZED]: `Unauthorized.`,
    [NotificationCode.FORBIDDEN]: `Forbidden.`,
    [NotificationCode.INVALID_REQUEST]: `Invalid request.`,

    [NotificationCode.SETUP_INVALID_LANGUAGE]: `Language must be at least 2 characters long.`,
    [NotificationCode.SETUP_DATABASE_PASSWORD_TOO_SHORT]: `Database password must be at least 12 characters long.`,
    [NotificationCode.SETUP_ADMIN_USERNAME_TOO_SHORT]: `Admin username must be at least 3 characters long.`,
    [NotificationCode.SETUP_ADMIN_PASSWORD_TOO_SHORT]: `Admin password must be at least 12 characters long.`,

    [NotificationCode.LOGIN_BAD_CREDENTIALS]: `Bad credentials.`,
    [NotificationCode.LOGIN_USERNAME_TOO_SHORT]: `Username must be at least 3 characters long.`,
    [NotificationCode.LOGIN_USERNAME_TOO_LONG]: `Username must be at most 64 characters long.`,

    [NotificationCode.DATABASE_ERROR]: `Database error.`,
    [NotificationCode.FILE_SYSTEM_ERROR]: `File system error.`,
    [NotificationCode.INTERNAL_SERVER_ERROR]: `Unexpected error.`,
  },
  setup: {
    setup: `Setup`,
    step1: {
      title: `Firstly, choose the language of your EML&nbsp;AdminTool:`,
      subtitle: `This language will be applied for all users.`,
      other: `I speak another language.`,
      modals: {
        language: {
          title: `You speak another language?`,
          content: `EML AdminTool is currently available in only five languages.<br>
However, we are thrilled to see that this project is reaching more and more people in different countries!<br>
<br>
Therefore, if you would like to help us translate EML AdminTool, you can find the JSON files on our GitHub and a guide on how to submit your translation. If it is accepted, it will be included as a default option in a future version of EML AdminTool!`
        }
      }
    },
    step2: {
      title: `Now, choose a password for your Database:`,
      subtitle: `You will not need to remember it.`,
      placeholder: `Database password`,
      generate: `Generate`,
      veryWeak: `Very weak`,
      weak: `Weak`,
      medium: `Medium`,
      strong: `Strong`,
      veryStrong: `Very strong`
    },
    step3: {
      title: `Then, choose your server name and a password:`,
      subtitle: `This server name and password will be your admin account login.`,
      confirmPassword: `Confirm password`
    },
    finally: 'You can now use EML&nbsp;AdminTool!'
  },
  auth: {
    login: `Log in`,
    register: `Register`,
    confirmPassword: `Confirm password`,
    createAccount: `Create an account here.`,
    alreadyAnAccount: `Log in here.`
  },
  leftPanel: {
    settings: `Settings`,
    features: `Features`,
    logout: `Log out`
  },
  dashboard: {
    welcome: `Welcome`,
    information: `Information`,
    permissions: `Permissions`,
    emlatSettings: {
      emlatSettings: `EML AdminTool settings`,
      language: `Language`,
      newName: `New name`,
      nbUsers: `Number of users`,
      users: `Users`,
      waitingUsers: `Waiting users`,
      wrongPinUsers: `Wrong-PIN users`,
      deletedUsers: `Deleted users`,
      permissionsOf: `Permissions of`,
      update: `Update`,
      currentVersion: `Current version`,
      latestVersion: `Latest version`,
      releasedOn: `Released on`,
      runUpdate: `Update`,
      seeOnGithub: `See on GitHub...`,
      vpsAndDocker: `VPS & Docker`,
      dockerInfo: `Docker information`,
      storage: `Storage`,
      dangerZone: `Danger zone`,
      reset: `Reset EML AdminTool`,
      emlAdminToolName: `EML AdminTool name`,
      editEmlat: `Edit EML AdminTool information`,
      leaveBlank: `Leave blank if you don't want to change.`,
      nameWarn: `Changing EML AdminTool name also changes your username!`,
      regeneratePin: `Regenerate PIN`,
      acceptUser: `Accept user`,
      editUser: `Edit user`
    },
    account: {
      accountSettings: `Account settings`,
      nameOrPseudo: `Name or Pseudo`,
      accountType: `Account type`,
      editAccount: `Edit account information`,
      leaveBlank: `Leave blank if you don't want to change.`,
      newNameOrPseudo: `New name or pseudo`,
      newPassword: `New password`,
      dangerZone: `Danger zone`,
      deleteAccount: `Delete account`
    },
    filesUpdater: {
      size: 'Size',
      b: 'B'
    }
  }
}

