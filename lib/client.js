const PgPool = require("node-pg-connection-pool");
const url = require("url");
const pick = require("lodash.pick");
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

    this.pool = new PgPool({
      name: "psAnalyticsPgPool",
      pgOptions: options.pgOptions,
      pgNative: options.pgNative,
      poolOptions: options.poolOptions,
      logger: options.logger
    });
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

  if (!suggestObj.url) {
    throw new Error("Suggest params required");
  }

  let itemType;
  if (/\/collections/g.test(suggestObj.url)) {
    itemType = "collection";
  } else if (/\/pearls/g.test(suggestObj.url)) {
    itemType = "pearl";
  }

  const query = url.parse(suggestObj.url, true).query;

  if (isEmpty(query)) {
    return;
  }

  const myLocation = Object.assign(isEmpty(query["my-address"]) ? {} : query["my-address"], {
    lat: query["my-lat"],
    lon: query["my-lon"]
  });
  debug("myLocation", myLocation);

  const suggestLog = objNullify({
    accountId: query.accountId,
    friendDepth: query.friendDepth,
    myLocation: myLocation,
    searchText: query.q,
    itemType: itemType,
    url: suggestObj.url
  });

  return pool.query(`INSERT INTO suggest_log ("searchText") VALUES ('${suggestLog.searchText}')`);
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

  const columns = Object.keys(searchLog).map(c => `"${c}"`).join(",");
  const values = Object.values(searchLog).map(v => {
    if (Array.isArray(v)) {
      return `ARRAY [${v}]`;
    } else {
      return `'${v}'`;
    }
  });

  return pool.query(`
    INSERT
      INTO search_log(
        ${columns}
      ) VALUES (
        ${values}
      ) returning id`
    )
    .then(function (result) {
      return result.rows;
    });
}
