'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.runSql(`
    CREATE TABLE IF NOT EXISTS suggest_log (
      "id" bigserial PRIMARY KEY,
      "friendDepth" integer  NULL,
      "keywords" text  NULL,
      "itemType" character varying(255)  NULL,
      "userId" integer  NULL,
      "myLocation" jsonb  NULL,
      "originalUrl" character varying(255)  NULL,
      "createdAt" timestamp with time zone  NULL,
      "sessionId" character varying(255)  NULL
    );
  `);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
