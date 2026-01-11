/**
 * Translated by uta1508
 * EML AdminTool v2.0.0-beta.5
 */

import { NotificationCode } from '$lib/utils/notifications'

export default {
  l: 'ja',
  language: '日本語',
  main: {
    home: 'ホーム',
    prev: `戻る`,
    next: `次へ`,
    finish: '完了',
    save: `保存`,
    cancel: `キャンセル`,
    more: `詳細`,
    name: `名前`,
    serverName: `サーバー名`,
    username: `ユーザー名`,
    password: `パスワード`,
    pin: `PIN`,
    actions: `アクション`
  },
  notifications: {
    [NotificationCode.INVALID_INPUT]: `無効な入力です。`,
    [NotificationCode.MISSING_INPUT]: `入力がありません。`,
    [NotificationCode.UNAUTHORIZED]: `認証されていません。`,
    [NotificationCode.FORBIDDEN]: `アクセスが禁止されています。`,
    [NotificationCode.INVALID_REQUEST]: `無効なリクエストです。`,
    [NotificationCode.NOT_FOUND]: `見つかりませんでした。`,

    [NotificationCode.SETUP_INVALID_LANGUAGE]: `言語は2文字で入力してください。`,
    [NotificationCode.SETUP_DATABASE_PASSWORD_TOO_SHORT]: `データベースのパスワードは12文字以上で入力してください。`,
    [NotificationCode.SETUP_ADMIN_USERNAME_TOO_SHORT]: `管理者ユーザー名は2文字以上で入力してください。`,
    [NotificationCode.SETUP_ADMIN_USERNAME_TOO_LONG]: `管理者ユーザー名は64文字以内で入力してください。`,
    [NotificationCode.SETUP_ADMIN_PASSWORD_TOO_SHORT]: `管理者パスワードは12文字以上で入力してください。`,

    [NotificationCode.EMLAT_NAME_TOO_SHORT]: `EML AdminTool名は2文字以上で入力してください。`,
    [NotificationCode.EMLAT_NAME_TOO_LONG]: `EML AdminTool名は64文字以内で入力してください。`,
    [NotificationCode.EMLAT_INVALID_LANGUAGE]: `言語は2文字で入力してください。`,
    [NotificationCode.EMLAT_UPDATED]: `EML AdminToolは正常に更新されました。`,
    [NotificationCode.EMLAT_UP_TO_DATE]: `EML AdminToolは最新です。`,
    [NotificationCode.EMLAT_UPDATE_FAILED]: `EML AdminToolの更新に失敗しました。詳細はログを確認してください。`,
    [NotificationCode.EMLAT_RESET_FAILED]: `EML AdminToolのリセットに失敗しました。詳細はログを確認してください。`,

    [NotificationCode.EDIT_USER_USERNAME_TOO_SHORT]: `ユーザー名は2文字以上で入力してください。`,
    [NotificationCode.EDIT_USER_USERNAME_TOO_LONG]: `ユーザー名は64文字以内で入力してください。`,

    [NotificationCode.EDIT_ACCOUNT_USERNAME_TOO_SHORT]: `ユーザー名は2文字以上で入力してください。`,
    [NotificationCode.EDIT_ACCOUNT_USERNAME_TOO_LONG]: `ユーザー名は64文字以内で入力してください。`,
    [NotificationCode.EDIT_ACCOUNT_PASSWORD_TOO_SHORT]: `パスワードは8文字以上で入力してください。`,

    [NotificationCode.AUTH_SESSION_EXPIRED]: `セッションの有効期限が切れました。再度ログインしてください。`,
    [NotificationCode.AUTH_INVALID_SESSION]: `無効なセッションです。再度ログインしてください。`,

    [NotificationCode.LOGIN_BAD_CREDENTIALS]: `認証情報が正しくありません。`,
    [NotificationCode.LOGIN_USERNAME_TOO_SHORT]: `ユーザー名は2文字以上で入力してください。`,
    [NotificationCode.LOGIN_USERNAME_TOO_LONG]: `ユーザー名は64文字以内で入力してください。`,

    [NotificationCode.REGISTER_USERNAME_TOO_SHORT]: `ユーザー名は2文字以上で入力してください。`,
    [NotificationCode.REGISTER_USERNAME_TOO_LONG]: `ユーザー名は64文字以内で入力してください。`,
    [NotificationCode.REGISTER_PASSWORD_TOO_SHORT]: `パスワードは8文字以上で入力してください。`,
    [NotificationCode.REGISTER_PIN_INVALID]: `PINは3文字で入力してください。`,
    [NotificationCode.REGISTER_USERNAME_EXISTS]: `このユーザー名は既に使用されています。`,

    [NotificationCode.FILESUPDATER_VERSIONS_MISMATCH]: `バージョンが一致しません。`,
    [NotificationCode.FILESUPDATER_MINECRAFT_VERSION_NOT_FOUND]: `Minecraftのバージョンが見つかりません。`,
    [NotificationCode.FILESUPDATER_FORGE_VERSION_NOT_FOUND]: `Forgeのバージョンが見つかりません。`,

    [NotificationCode.BOOTSTRAPS_MALFORMED_VERSION]: `Bootstrapsのバージョン形式が正しくありません。セマンティックバージョニング (SemVer) に従ってください。`,
    [NotificationCode.BOOTSTRAPS_INVALID_FILES]: `Bootstrapsのバージョンが無効です。現在のバージョンより新しいバージョンを指定してください。`,

    [NotificationCode.MAINTENANCE_INVALID_DATES]: `メンテナンス期間が無効です。開始日は終了日より前に設定してください。`,

    [NotificationCode.NEWS_TITLE_TOO_SHORT]: `ニュースのタイトルは1文字以上で入力してください。`,
    [NotificationCode.NEWS_TITLE_TOO_LONG]: `ニュースのタイトルは255文字以内で入力してください。`,

    [NotificationCode.NEWS_CATEGORY_NAME_TOO_SHORT]: `ニュースカテゴリ名は1文字以上で入力してください。`,
    [NotificationCode.NEWS_CATEGORY_NAME_TOO_LONG]: `ニュースカテゴリ名は64文字以内で入力してください。`,
    [NotificationCode.NEWS_CATEGORY_ALREADY_EXISTS]: `このニュースカテゴリは既に存在します。`,

    [NotificationCode.NEWS_TAG_NAME_TOO_SHORT]: `ニュースタグ名は1文字以上で入力してください。`,
    [NotificationCode.NEWS_TAG_NAME_TOO_LONG]: `ニュースタグ名は64文字以内で入力してください。`,
    [NotificationCode.NEWS_TAG_ALREADY_EXISTS]: `このニュースタグは既に存在します。`,

    [NotificationCode.BACKGROUND_NAME_TOO_SHORT]: `背景の名称は1文字以上で入力してください。`,
    [NotificationCode.BACKGROUND_NAME_TOO_LONG]: `背景の名称は255文字以内で入力してください。`,
    [NotificationCode.BACKGROUND_INVALID_STATUS]: `背景のステータスが無効です。`,
    [NotificationCode.BACKGROUND_ALREADY_EXISTS]: `この名前の背景は既に存在します。`,

    [NotificationCode.DATABASE_ERROR]: `データベースエラーです。`,
    [NotificationCode.UPDATER_ERROR]: `アップデーターエラーです。`,
    [NotificationCode.FILE_SYSTEM_ERROR]: `ファイルシステムエラーです。`,
    [NotificationCode.INTERNAL_SERVER_ERROR]: `予期せぬエラーが発生しました。`,
    [NotificationCode.EXTERNAL_API_ERROR]: `外部APIエラーです。`
  },
  setup: {
    setup: `セットアップ`,
    step1: {
      title: `まず、EML&nbsp;AdminToolの言語を選択してください：`,
      subtitle: `この言語はすべてのユーザーに適用されます。`,
      other: `他の言語を話します。`,
      modals: {
        language: {
          title: `他の言語を話しますか？`,
          content: `EML AdminToolは現在6つの言語のみで利用可能です。<br>
しかし、このプロジェクトがさまざまな国々でより多くの人々に届いていることを大変嬉しく思います！<br>
<br>
そこで、EML AdminToolの翻訳にご協力いただける場合は、GitHubにJSONファイルと翻訳の提出方法に関するガイドがあります。翻訳が承認されると、将来のバージョンのEML AdminToolにデフォルトオプションとして含まれます！`
        }
      }
    },
    step2: {
      title: `次に、データベースのパスワードを選択してください：`,
      subtitle: `このパスワードを覚える必要はありません。`,
      placeholder: `データベースのパスワード`,
      generate: `生成`,
      veryWeak: `非常に弱い`,
      weak: `弱い`,
      medium: `普通`,
      strong: `強い`,
      veryStrong: `非常に強い`
    },
    step3: {
      title: `次に、サーバー名とパスワードを選択してください：`,
      subtitle: `このサーバー名とパスワードが管理者アカウントのログイン情報になります。`,
      confirmPassword: `パスワードの確認`
    },
    finally: 'これでEML&nbsp;AdminToolを使用できます！'
  },
  auth: {
    login: `ログイン`,
    register: `登録`,
    confirmPassword: `パスワードの確認`,
    createAccount: `こちらでアカウントを作成してください。`,
    alreadyAnAccount: `こちらでログインしてください。`
  },
  leftPanel: {
    settings: `設定`,
    features: `機能`,
    logout: `ログアウト`
  },
  dashboard: {
    welcome: `ようこそ`,
    information: `情報`,
    permissions: `権限`,
    emlatSettings: {
      emlatSettings: `EML AdminToolの設定`,
      language: `言語`,
      newName: `新しい名前`,
      nbUsers: `ユーザー数`,
      users: `ユーザー`,
      pendingUsers: `保留中のユーザー`,
      wrongPinUsers: `PINが間違っているユーザー`,
      infoOf: `の情報`,
      update: `更新`,
      currentVersion: `現在のバージョン`,
      latestVersion: `最新バージョン`,
      releasedOn: `リリース日`,
      runUpdate: `更新を実行`,
      openGithub: `GitHubを開く...`,
      vpsAndDocker: `VPSとDocker`,
      dockerInfo: `Docker情報`,
      storage: `ストレージ`,
      dangerZone: `危険な操作`,
      reset: `EML AdminToolをリセット`,
      emlAdminToolName: `EML AdminTool名`,
      editEMLAT: `EML AdminTool情報を編集`,
      leaveBlank: `変更しない場合は空欄にしてください。`,
      nameWarn: `EML AdminTool名を変更すると、ユーザー名も変更されます！`,
      regeneratePin: `PINを再生成`,
      acceptUser: `ユーザーを承認`,
      refuseUser: `ユーザーを拒否`,
      refuseUserWarning: `このユーザーを拒否してもよろしいですか？ユーザーはEML AdminToolにアクセスできなくなります。`,
      deletedUsers: `削除されたユーザー`,
      deleteUserWarning: `このユーザーを削除してもよろしいですか？
ユーザーはEML AdminToolにアクセスできなくなります。ただし、ユーザーのアクションとデータは削除されません。`,
      deleteUserForeverWarning: `このユーザーを完全に削除してもよろしいですか？
公開されたニュースを含む、すべてのユーザーのアクションとデータが削除されます。この操作は元に戻せません。`,
      editUser: `ユーザーを編集`,
      resetEMLATWarning: `EML AdminToolをリセットしてもよろしいですか？すべてのデータが失われ、EML AdminToolは初期状態にリセットされます。この操作は元に戻せません。
また、リセット中は誰もEML AdminToolにアクセスできないようにしてください。セットアップ中のEML AdminToolは保護されていません！`,
      areYouSure: `よろしいですか？`
    },
    account: {
      accountSettings: `アカウント設定`,
      accountType: `アカウントの種類`,
      editAccount: `アカウント情報を編集`,
      leaveBlank: `変更しない場合は空欄にしてください。`,
      newUsername: `新しいユーザー名`,
      usernameWarn: `ユーザー名を変更すると、EML AdminTool名も変更されます！`,
      newPassword: `新しいパスワード`,
      dangerZone: `危険な操作`,
      deleteAccount: `アカウントを削除`,
      deleteAccountWarning: `アカウントを削除してもよろしいですか？EML AdminToolにアクセスできなくなります。ただし、あなたのアクションとデータは削除されません。`
    },
    filesUpdater: {
      size: 'サイズ',
      b: 'B'
    }
  }
}



