# ⚠️ Important: PostgreSQL database migration guide

**Please read this entire guide before starting.**

With the latest update of EML AdminTool, we have upgraded the internal database engine (PostgreSQL) to version 18. This is a major update that changes how data is stored on the disk.

Because of this change, **the automatic update will break the database connection**. This is expected behavior.

## The Strategy

Here is exactly what is going to happen:

1. You run the **Auto-Update** in EML AdminTool.
2. The tool restarts and likely **crashes** or shows a "Database Error". **Do not panic.**
3. You will connect via SSH to perform a manual migration.
4. You will backup the data, delete the old storage, and restore the data into the new version.

### Preparation (before updating)

First, we need to save your current data while the old system is still running.

1.  **Connect to your server via SSH.**

2.  **Go to your installation folder:** By default, it is usually:

    ```bash
    cd ~/.eml/admintool
    ```

3.  **Retrieve your database credentials:** We need to know the username to perform the backup. Keep the password handy just in case. Run this command:

    ```bash
    docker compose -f docker-compose.prod.yml exec web cat /app/.env
    ```

    Look for `DATABASE_URL=postgresql://USER:PASSWORD@dbs...`. Note down the **USER** (e.g., `eml`) and **PASSWORD**.

4.  **Backup your data (the dump):** Run this command to save everything to a file. Replace `USER` with the username you just found.

    ```bash
    docker compose -f docker-compose.prod.yml exec -T dbs pg_dumpall -U USER > migration_backup.sql
    ```

5.  **Verify the backup:** Check that the file was created and is not empty:
    ```bash
    ls -lh migration_backup.sql
    ```

### The update (breaking things)

Now that your data is safe, you can proceed with the update.

1.  **Go to your EML AdminTool web interface.**

2.  **Click the "Update" button.** The AdminTool will download the new files and restart.

    **⚠️ IMPORTANT:** After a minute, the AdminTool will likely stop working (Error 500, Bad Gateway, or "Service Unavailable"). **This is NORMAL.** Do not panic. The new database version cannot read the old files yet.

### The migration (fixing things)

Now we need to clear the old incompatible storage and restore your backup into the new system.

1.  **Stop the application completely:**

    ```bash
    docker compose -f docker-compose.prod.yml down
    ```

2.  **Delete the old database volume:** This deletes the actual data files inside Docker (don't worry, we have the `migration_backup.sql`).

    First, find the exact volume name:

    ```bash
    docker volume ls
    ```

    Look for a volume with a name similar to `eml-admintool_database`.

    Then remove it (replace with your actual volume name):

    ```bash
    docker volume rm eml-admintool_database
    ```

3.  **Start the new database:** Now that the old volume is gone, Docker will create a fresh, empty one compatible with PostgreSQL 18.

    ```bash
    docker compose -f docker-compose.prod.yml up -d dbs
    ```

    _Wait about 15 seconds for the database to initialize._

4.  **Restore your data:** Inject your backup into the new database. Replace `USER` with your database username found in step 3.

    ```bash
    cat migration_backup.sql | docker compose -f docker-compose.prod.yml exec -T dbs psql -U USER
    ```

    _Note: You might see "role already exists" errors. This is normal and safe to ignore._

### Restart

1.  **Start the rest of the application:**

    ```bash
    docker compose -f docker-compose.prod.yml up -d
    ```

2.  **Check the logs (Optional):**

    ```bash
    docker compose -f docker-compose.prod.yml logs -f web
    ```

    Ensure the application starts without database errors.

3.  **Done!**
    You can now refresh your browser. EML AdminTool is back online, updated, and running on PostgreSQL 18.
