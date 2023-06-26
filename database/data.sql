-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

--  insert into "todos"
--    ("task", "isCompleted")
--    values
--      ('Learn to code', false),
--      ('Build projects', false),
--      ('Get a job', false);

-- insert into "users" ("username", "email")
-- values
--     ('DogLover123', 'doglover@example.com');

insert into "places" ("placeId", "placeName", "title", "latitude", "longitude", "address")
values
    ('ChIJV5zdDGFZwokRpwGtHx6A2q8', 'Dog Park', 'Park', 37.7749, -122.4194, 'San Francisco, CA' ),
    ('ChIJM8mTvtRZzpQRRI1kO5n7k1o', 'Dog Beach', 'Beach', 32.7486, -117.2476, 'San Diego, CA' );

insert into "bookmarks" ("placeId")
values
    ('ChIJV5zdDGFZwokRpwGtHx6A2q8'),
    ('ChIJM8mTvtRZzpQRRI1kO5n7k1o');
