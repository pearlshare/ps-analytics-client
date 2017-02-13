CREATE TABLE search_log (
  id integer PRIMARY KEY,
  keywords text  NULL,
  collectionId integer  NULL,
  categoryId integer  NULL,
  accountId integer  NULL,
  userId integer  NULL,
  lat double precision  NULL,
  lon double precision  NULL,
  radius double precision  NULL,
  createdAt timestamp with time zone  NULL,
  categoryIds integer[]  NULL,
  featured boolean  NULL,
  friendDepth integer  NULL,
  likedBy integer  NULL,
  interests boolean  NULL,
  collectionIds integer[]  NULL,
  pearlIds integer[]  NULL,
  ids integer[]  NULL,
  itemType character varying(255)  NULL,
  originalUrl character varying(255)  NULL
);
