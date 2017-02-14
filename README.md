# ps-analytics-client
Simple plugin to store custom analytics data



> Note

- This uses ```db-migrate``` to run migrations. To avoid db-migrate using DATABASE_URL instead of given config I have to create a patch. https://github.com/db-migrate/node-db-migrate/pull/462  (probably they might not accept it)
