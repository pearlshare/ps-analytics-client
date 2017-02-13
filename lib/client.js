const PgPool = require("node-pg-connection-pool");
const url = require("url");
const pick = require("lodash.pick");
const isJson = require("is-json");
const dbMigrate = require("./db_migrate");
const objNullify = require("./utils/obj_nullify");
const isEmpty = require("./utils/is_empty");

const debug = require("debug")("psAnalyticsClient");

function injectLogger (logger) {
 if (!logger) {
   logger = {};
 }

 return Object.assign({
   log: function () {},
   debug: function () {},
   info: function () {},
   warn: function () {},
   error: function () {}
 }, logger);
}


module.exports = {
  init: function (options) {

    options = pick(options, ["name", "pgOptions", "pgNative", "poolOptions", "logger"]);

    this.logger = injectLogger(options.logger);
    this.pool = null;

    dbMigrate.init(options.pgOptions);
    return dbMigrate.up()
      .then(function () {

        // creating after migrations
        // to avoid stale connections
        this.pool = new PgPool({
          name: "psAnalyticsPgPool",
          pgOptions: options.pgOptions,
          pgNative: options.pgNative,
          poolOptions: options.poolOptions,
          logger: options.logger
        });
      }.bind(this));
  },
  sendSuggestLog: function (suggestObj) {
    return sendSuggestLog(suggestObj, this.pool)
  },
  sendSearchLog: function (searchObj) {
    return sendSearchLog(searchObj, this.pool)
  }
}


function sendSuggestLog (suggestObj, pool) {
  if (!pool) {
    throw new Error("Module not/failed to initialized. See docs to ```init([<options>])```");
  }

  if (!suggestObj) {
    throw new Error("Suggest params required");
  }

  let itemType;
  if (/\/collections/g.test(suggestObj.url)) {
    itemType = "collection";
  } else if (/\/pearls/g.test(suggestObj.url)) {
    itemType = "pearl";
  }

  const myLocation = Object.assign(isEmpty(suggestObj["my-address"]) ? {} : suggestObj["my-address"], {
    lat: suggestObj["my-lat"],
    lon: suggestObj["my-lon"]
  });
  debug("myLocation", myLocation);

  const suggestLog = objNullify({
    userId: suggestObj.userId,
    friendDepth: suggestObj.friendDepth,
    myLocation: myLocation,
    keywords: suggestObj.q,
    itemType: itemType,
    originalUrl: suggestObj.url
  });

  return insertRowObj("suggest_log", suggestLog, pool);
}


function sendSearchLog(searchObj, pool) {
  if (!pool) {
    throw new Error("Module not/failed to initialized. See docs to ```init([<options>])```");
  }

  if (!searchObj) {
    throw new Error("searchObj required");
  }

  let itemType;
  if (/\/collections/g.test(searchObj.originalUrl || "")) {
    itemType = "collection";
  } else if (/\/pearls/g.test(searchObj.originalUrl || "")) {
    itemType = "pearl";
  }

  const searchLog = objNullify({
    accountId: searchObj.accountId,
    categoryIds: searchObj.categoryIds,
    collectionId: searchObj.collectionId,
    featured: searchObj.featured,
    friendDepth: searchObj.friendDepth,
    keywords: searchObj.keywords,
    lat: searchObj.lat,
    lon: searchObj.lon,
    radius: searchObj.radius,
    userId: searchObj.userId,
    likedBy: searchObj.likedBy,
    interests: searchObj.interests,
    ids: searchObj.ids,
    itemType: itemType,
    originalUrl: searchObj.originalUrl
  });
  debug("inserting sendSearchLog", searchLog);

  return insertRowObj("search_log", searchLog, pool);
}

function insertRowObj(tableName, rowObj, pool) {

  const columns = Object.keys(rowObj).map(c => `"${c}"`).join(",");
  const values = Object.values(rowObj).map(v => {
    if (Array.isArray(v)) {
      return `ARRAY [${v}]`;
    } else if (isJson(v, true)) {
      return `'${JSON.stringify(v)}'`;
    } else {
      return `'${v}'`;
    }
  });
  const query = `
    INSERT
      INTO ${tableName} (
        ${columns}
      ) VALUES (
        ${values}
      ) returning id
    `;

  debug("exec sendSuggestLog query", query);
  return pool.query(query)
    .then(function (result) {
      return result.rows;
    });
}
