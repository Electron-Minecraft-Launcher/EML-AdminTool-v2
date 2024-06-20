# EML AdminTool

**EML AdminTool is a Web software to manage a Minecraft Launcher built with the [EML Core](https://github.com/Electron-Minecraft-Launcher/EML-Core-v2) library.**

[<p align="center"><img src="https://img.shields.io/badge/Discord-Electron_Minecraft_Launcher-5561e6?&style=for-the-badge">](https://discord.gg/YVB4k6HzAY)
[<img src="https://img.shields.io/badge/platforms-Docker-0077DA?style=for-the-badge&color=0077DA">](#platforms) 
[<img src="https://img.shields.io/badge/version-Alpha.0-orangered?style=for-the-badge&color=orangered">](package.json)</p>

---


## How to install?

You have to use a compatible **VPS**.

### Choose a VPS

Here is the minimal specs needed:
 * 2 GB storage (10 GB recommended)
 * 1 GB RAM (4 GB recommended)
 * 1 Core 2 GHz CPU (4 Cores 2 GHz recommended)

You can choose your Linux distribution, but Debian or Ubuntu is highly recommended.

### Install the EML AdminTool

Then, in a terminal, execute the following command:
```bash
[command]
```
and follow the instructions.

### If you won't use a VPS

You can download the previous major version of the EML AdminTool. However, be careful, this version is not maintained!


## Features

 * **Files Updater**: Update your Minecraft files.
 * **Bootstrap**: Auto-update your Minecraft Launcher.
 * **Maintenance**: Manage your Minecraft Launcher.
 * **News**: Manage your Minecraft Launcher news.
 * **Background**: Manage your Minecraft Launcher background.
 * **Stats**: See stats about your Launcher.
 * The Admin of the server can manage the users permissions.
 * And more...


## Want to help?

### Translation

You can help to translate the EML AdminTool!

The languages files are [here](./client/src/assets/language/). You can create another file with your translation. Please make sure to provide a correct translation!

Then, you can submit your translation file as an [issue](https://github.com/Electron-Minecraft-Launcher/EML-AdminTool-v2/issues), by using the *Language* issue template. Your file needs to be checked and approved by two other persons.

### Development

Install [Node.js](https://nodejs.org/en/download/package-manager), [Docker](https://www.docker.com/get-started)[^1].

Then, download the code and run the command:
```bash
npm i
```

You can now start the development server:
```bash
docker-compose up
```

The application is accessible at [http://localhost:5173](http://localhost:5173). You can also access phpMyAdmin at [https://localhost:8080](http://localhost:8080).

You can now make pull requests!


## Important information

* This Web software is under the `GNU GPLv3` license; to get more information, please read the file `LICENSE`. It is legally obligatory to respect this license.
* If you need some help, you can join [this Discord](https://discord.gg/nfEHKtghPh).

[^1]: On desktop (Windows, macOS and Linux), you can use Docker Desktop, which includes Docker and Docker Compose. On a server (Linux), you can use the following commands, you should install Docker and Docker Compose separately.
