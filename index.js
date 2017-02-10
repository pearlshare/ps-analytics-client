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
  sendSuggestLog: function (reqObj) {
    return sendSuggestLog(reqObj, this.pool)
  }
}


function sendSuggestLog (reqObj, pool) {

  if (!pool) {
    throw new Error("Not initialized. See docs");
  }

  if (!reqObj.url) {
    throw new Error("Suggest params required");
  }

  let itemType;
  if (/\/collections/g.test(reqObj.url)) {
    itemType = "collection";
  } else if (/\/pearls/g.test(reqObj.url)) {
    itemType = "pearl";
  }

  const query = url.parse(reqObj.url, true).query;

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
    url: reqObj.url
  });

  return pool.query(`INSERT INTO suggest_log ("searchText") VALUES ('${suggestLog.searchText}')`);
}
