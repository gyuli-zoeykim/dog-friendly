import 'dotenv/config';
import express from 'express';
import errorMiddleware from './lib/error-middleware.js';
import pg from 'pg';
import fetch from 'node-fetch';
import cors from 'cors';
// eslint-disable-next-line no-unused-vars -- Remove when used
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(cors());

app.get('/api/key', (req, res) => {
  res.json({ apiKey: process.env.GOOGLE_APIKEY });
});

// search
app.get('/api/businesses', async (req, res) => {
  try {
    const { address } = req.query;
    const apiUrl = `https://api.yelp.com/v3/businesses/search?term=dog+pet+friendly&location=${encodeURIComponent(
      address
    )}&radius=1200`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.YELP_APIKEY}`,
      },
    });

    const data = await response.json();
    res.json(data.businesses);
  } catch (error) {
    console.error('Error searching businesses:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while searching businesses.' });
  }
});

app.get('/api/businesses/open', async (req, res) => {
  try {
    const { address } = req.query;
    const apiUrl = `https://api.yelp.com/v3/businesses/search?term=dog+pet+friendly&location=${encodeURIComponent(
      address
    )}&radius=1200&open_now=true`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.YELP_APIKEY}`,
      },
    });

    const data = await response.json();
    console.log(data);

    res.json(data.businesses);
  } catch (error) {
    console.error('Error searching open businesses:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while searching open businesses.' });
  }
});

app.get('/api/businesses/:id', async (req, res) => {
  const businessId = req.params.id;

  try {
    const response = await fetch(
      `https://api.yelp.com/v3/businesses/${businessId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.YELP_APIKEY}`,
        },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: 'Failed to fetch business details' });
  }
});

// bookmark
app.get('/api/bookmarks', async (req, res) => {
  try {
    const sql = `
      select "placeId"
        from "bookmarks"
    `;
    const result = await db.query(sql);
    const placeId = result.rows;
    const newPlaceId = placeId.map((place) => place.placeId);
    res.json(newPlaceId);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'an unexpected error occurred' });
  }
});

app.post('/api/bookmarks', async (req, res) => {
  const { placeId } = req.body;
  console.log(placeId);
  try {
    const checkPlaceQuery = `
      SELECT *
      FROM "places"
      WHERE "placeId" = $1
    `;
    const checkPlaceValues = [placeId];

    const placeResult = await db.query(checkPlaceQuery, checkPlaceValues);
    let place;

    if (placeResult.rows.length === 0) {
      const placeInfo = await fetch(
        `https://api.yelp.com/v3/businesses/${placeId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.YELP_APIKEY}`,
          },
        }
      );
      const res = await placeInfo.json();
      console.log('res', res);

      const insertPlaceQuery = `
        INSERT INTO "places" ("placeId", "placeName", "title", "latitude", "longitude", "address")
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING "placeId"
      `;
      const insertPlaceValues = [
        res.id,
        res.name,
        res.categories[0].title,
        res.coordinates.latitude,
        res.coordinates.longitude,
        `${res.location.city}, ${res.location.state}`,
      ];

      const insertPlaceResult = await db.query(
        insertPlaceQuery,
        insertPlaceValues
      );
      place = insertPlaceResult.rows[0].placeId;
    } else {
      place = placeResult.rows[0].placeId;
    }

    const insertBookmarkQuery = `
      INSERT INTO "bookmarks" ("placeId")
      VALUES ($1)
      RETURNING *
    `;
    const insertBookmarkValues = [place];

    const bookmarkResult = await db.query(
      insertBookmarkQuery,
      insertBookmarkValues
    );
    const bookmark = bookmarkResult.rows[0];

    res.json(bookmark);
  } catch (error) {
    console.error('Error saving bookmark:', error);
    res.status(500).json({ error: 'Failed to save bookmark' });
  }
});

app.delete('/api/bookmarks/:placeId', async (req, res) => {
  const { placeId } = req.params;

  try {
    const query = `
      DELETE FROM "bookmarks"
      WHERE "placeId" = $1
    `;
    const values = [placeId];

    await db.query(query, values);

    res.status(200).json({ message: 'Bookmark removed' });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    res.status(500).json({ error: 'Failed to remove bookmark' });
  }
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});

// // Create paths for static directories
// const reactStaticDir = new URL('../client/build', import.meta.url).pathname;
// const uploadsStaticDir = new URL('public', import.meta.url).pathname;

// app.use(express.static(reactStaticDir));
// // Static directory for file uploads server/public/
// app.use(express.static(uploadsStaticDir));
// app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));
