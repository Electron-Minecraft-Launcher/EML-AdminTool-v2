# How to publish a new version

### 1. Update the version number

Files to check:
- `package.json`
- `README.md`
- `src/lib/locales/**.ts`
- `docker/docker-compose.dev.yml`, `docker/docker-compose.prod.yml`

### 2. Create a change log file

Copy the template from `.github/changelogs/TEMPLATE.md` and create a new file in `.github/changelogs/` with the version number as the filename (e.g., `v2.0.1.md`).
Then, fill in the change log with the changes made since the last version.

### 3. Create an install script

Copy the previous install script from `.github/scripts/eml-admintool@X.X.X` and create a new file with the new version number (e.g., `eml-admintool@2.0.1`). Then update the new file with the new version.

Additionally, the EML AdminTool can run a script before the update. You can create this file and attach it to the release (after step 5) via GitHub. The script extension must be `.sh` and must not start with `._`.

### 4. Create a new tag

Push the latest version to the `main` branch. Ensure that CodeQL checks are passing.

Then, create a new tag with the new version number (e.g., `v2.0.1`):

```sh
git pull
git tag -a <tag_name> <7-chars_commit_hash> -m "<tag_name>"
git push origin <tag_name>
```

Wait for the GitHub Actions to run. If everything is fine, you will see a new release in the "Releases" section of the repository.

### 5. Check everything is working

Check the "Release" section of the repository to ensure that the new version is available and that the install script is attached. You can now add an `.sh` if needed.

### In case of error...

Remove the tag and the release from GitHub, then delete the local tag:

```sh
git pull
git tag -d <tag_name>
```
