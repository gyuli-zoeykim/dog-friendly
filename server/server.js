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
