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

    // this cwd is a little hack to use the migrations dir from the module
    // instead of looking into main app
    // THis will not be needed when this becomes an independent app
    dbmigrate = DBMigrate.getInstance(true, {
      cwd: process.env.PS_ANALYTICS_MIGRATIONS_DIR || "./node_modules/ps-analytics-client",
      env: "pg",
      config: {
        pg: Object.assign({}, dbConfig, {
          driver: "pg"
        })
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
