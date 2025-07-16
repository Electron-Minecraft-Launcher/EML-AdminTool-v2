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
    [NotificationCode.NOT_FOUND]: `Not found.`,

    [NotificationCode.SETUP_INVALID_LANGUAGE]: `Language must be exactly 2 characters long.`,
    [NotificationCode.SETUP_DATABASE_PASSWORD_TOO_SHORT]: `Database password must be at least 12 characters long.`,
    [NotificationCode.SETUP_ADMIN_USERNAME_TOO_SHORT]: `Admin username must be at least 2 characters long.`,
    [NotificationCode.SETUP_ADMIN_USERNAME_TOO_LONG]: `Admin username must be at most 64 characters long.`,
    [NotificationCode.SETUP_ADMIN_PASSWORD_TOO_SHORT]: `Admin password must be at least 12 characters long.`,

    [NotificationCode.EMLAT_NAME_TOO_SHORT]: `EML AdminTool name must be at least 2 characters long.`,
    [NotificationCode.EMLAT_NAME_TOO_LONG]: `EML AdminTool name must be at most 64 characters long.`,
    [NotificationCode.EMLAT_INVALID_LANGUAGE]: `Language must be exactly 2 characters long.`,
    [NotificationCode.EMLAT_UPDATED]: `EML AdminTool has been updated successfully.`,

    [NotificationCode.EDIT_USER_USERNAME_TOO_SHORT]: `Username must be at least 2 characters long.`,
    [NotificationCode.EDIT_USER_USERNAME_TOO_LONG]: `Username must be at most 64 characters long.`,

    [NotificationCode.EDIT_ACCOUNT_USERNAME_TOO_SHORT]: `Username must be at least 2 characters long.`,
    [NotificationCode.EDIT_ACCOUNT_USERNAME_TOO_LONG]: `Username must be at most 64 characters long.`,
    [NotificationCode.EDIT_ACCOUNT_PASSWORD_TOO_SHORT]: `Password must be at least 8 characters long.`,

    [NotificationCode.AUTH_SESSION_EXPIRED]: `Session expired, please log in again.`,
    [NotificationCode.AUTH_INVALID_SESSION]: `Invalid session, please log in again.`,

    [NotificationCode.LOGIN_BAD_CREDENTIALS]: `Bad credentials.`,
    [NotificationCode.LOGIN_USERNAME_TOO_SHORT]: `Username must be at least 2 characters long.`,
    [NotificationCode.LOGIN_USERNAME_TOO_LONG]: `Username must be at most 64 characters long.`,

    [NotificationCode.REGISTER_USERNAME_TOO_SHORT]: `Username must be at least 2 characters long.`,
    [NotificationCode.REGISTER_USERNAME_TOO_LONG]: `Username must be at most 64 characters long.`,
    [NotificationCode.REGISTER_PASSWORD_TOO_SHORT]: `Password must be at least 8 characters long.`,
    [NotificationCode.REGISTER_PIN_INVALID]: `PIN must be exactly 3 characters long.`,
    [NotificationCode.REGISTER_USERNAME_EXISTS]: `Username already exists.`,

    [NotificationCode.DATABASE_ERROR]: `Database error.`,
    [NotificationCode.FILE_SYSTEM_ERROR]: `File system error.`,
    [NotificationCode.INTERNAL_SERVER_ERROR]: `Unexpected error.`,
    [NotificationCode.EXTERNAL_API_ERROR]: `External API error.`
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
      pendingUsers: `Pending users`,
      wrongPinUsers: `Wrong-PIN users`,
      infoOf: `Info of`,
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
      editEMLAT: `Edit EML AdminTool information`,
      leaveBlank: `Leave blank if you don't want to change.`,
      nameWarn: `Changing EML AdminTool name also changes your username!`,
      regeneratePin: `Regenerate PIN`,
      acceptUser: `Accept user`,
      refuseUser: `Refuse user`,
      refuseUserWarning: `Are you sure you want to refuse this user? The user will not be able to access EML AdminTool anymore.`,
      deletedUsers: `Deleted users`,
      deleteUserWarning: `Are you sure you want to delete this user?
The user will not be able to access EML AdminTool anymore. However, the user's actions and data will not be deleted.`,
      deleteUserForeverWarning: `Are you sure you want to delete this user forever?
All the user's actions and data will be deleted, including published news. This action is irreversible.`,
      editUser: `Edit user`,
      resetEMLATWarning: `Are you sure you want to reset EML AdminTool? All the data will be lost and EML AdminTool will be reset to its initial state. This action is irreversible.
Moreover, be sure that nobody can access EML AdminTool during the reset: EML AdminTool is not protected during the setup!`,
      areYouSure: `Are you sure?`
    },
    account: {
      accountSettings: `Account settings`,
      accountType: `Account type`,
      editAccount: `Edit account information`,
      leaveBlank: `Leave blank if you don't want to change.`,
      newUsername: `New username`,
      usernameWarn: `Changing your username will also change the EML AdminTool name!`,
      newPassword: `New password`,
      dangerZone: `Danger zone`,
      deleteAccount: `Delete account`,
      deleteAccountWarning: `Are you sure you want to delete your account? You will not be able to access EML AdminTool anymore. However, your actions and data will not be deleted.`
    },
    filesUpdater: {
      size: 'Size',
      b: 'B'
    }
  }
}
