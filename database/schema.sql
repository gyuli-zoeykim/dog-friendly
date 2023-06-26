set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

-- create table "public"."users" (
--     "userId"    serial,
--     "username"  text not null,
--     "email"     text not null,
--     primary key ("userId")
-- );

create table "public"."places" (
    "placeId"   text,
    "placeName"      text not null,
    "title"      text not null,
    "latitude"  decimal not null,
    "longitude" decimal not null,
    "address"   text,
    primary key ("placeId")
);

create table "public"."bookmarks" (
    "bookmarkId" serial,
    -- "userId"     int not null,
    "placeId"    text,
    "createdAt"  timestamptz(6) not null default now(),
    "updatedAt"  timestamptz(6) not null default now(),
    primary key ("bookmarkId"),
    -- foreign key ("userId") references "users"("userId"),
    foreign key ("placeId") references "places"("placeId")
);
