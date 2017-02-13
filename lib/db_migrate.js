const DBMigrate = require("db-migrate");
const url = require("url");

let dbmigrate;

module.exports = {
  init: function (pgOptions) {

    let dbConfig = {};
    if (typeof pgOptions === "string") {
      const params = url.parse(pgOptions, true);
      const auth = params.auth.split(":");
      dbConfig = {
        user: auth[0],
        password: auth[1],
        host: params.hostname,
        port: params.port,
        database: params.pathname.split("/")[1],
        ssl: params.query.ssl || true
      };
    }

    dbmigrate = DBMigrate.getInstance(true, {
      env: "pg",
      config: {
        pg: Object.assign({driver: "pg"}, dbConfig)
      }
    });
    return dbmigrate;
  },
  up: function () {
    if (!dbmigrate) {
      throw new Error("db_migrate not initialized. ```dbMigrate.init(pgOptions)```")
    } else {
      return dbmigrate.up();
    }
  }
};
