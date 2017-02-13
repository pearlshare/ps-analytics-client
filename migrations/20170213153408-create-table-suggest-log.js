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
    CREATE TABLE IF NOT EXISTS search_log (
      "id" bigserial PRIMARY KEY,
      "keywords" text  NULL,
      "collectionId" integer  NULL,
      "categoryId" integer  NULL,
      "accountId" integer  NULL,
      "userId" integer  NULL,
      "lat" double precision  NULL,
      "lon" double precision  NULL,
      "radius" double precision  NULL,
      "categoryIds" integer[]  NULL,
      "featured" boolean  NULL,
      "friendDepth" integer  NULL,
      "likedBy" integer  NULL,
      "interests" boolean  NULL,
      "collectionIds" integer[]  NULL,
      "pearlIds" integer[]  NULL,
      "ids" integer[]  NULL,
      "itemType" character varying(255)  NULL,
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
