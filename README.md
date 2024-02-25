![migration](images/banner.gif)
# Create Migration

Analogue of command `db-migrate create` but file `up.sql` will be open.

![Image alt](https://github.com/ArtyomSleepNeeded/vscode-create-migration/raw/master/img/Screenshot_1.png)

ctrl+shift+p -> find command `Create Migration` -> enter

![Image alt](https://github.com/ArtyomSleepNeeded/vscode-create-migration/raw/master/img/Screenshot_2.png)

## Settings Options

- `CreateMigration.LazyMode` checkbox is set in the extension settings, the command is executed after the migration files are created `db-migrate up`.
- `CreateMigration.driver` mysql, pg
- `CreateMigration.dataBase` name your dataBase
- `CreateMigration.host` host your dataBase
- `CreateMigration.user` user your dataBase
- `CreateMigration.password` password your dataBase
- `CreateMigration.prefixTask` prefix before task
