require('dotenv').config();
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { Pool } = require('pg');

const app = express();
const PORT = process.env.LASTFM_AUTH_PORT || 3001;
const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const LASTFM_API_SECRET = process.env.LASTFM_API_SECRET;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Functions to set and get user links in the database
async function setUserLink(userId, lastfmUsername) {
    await pool.query(
        'INSERT INTO lastfm_links (discord_user_id, lastfm_username) VALUES ($1, $2) ON CONFLICT (discord_user_id) DO UPDATE SET lastfm_username = EXCLUDED.lastfm_username',
        [userId, lastfmUsername]
    );
}

async function getUserLink(userId) {
    const res = await pool.query(
        'SELECT lastfm_username FROM lastfm_links WHERE discord_user_id = $1',
        [userId]
    );
    return res.rows[0]?.lastfm_username || null;
}

// Function to generate API signature
function getApiSig(token) {
    const md5 = require('md5');
    const str = `api_key${LASTFM_API_KEY}methodauth.getSessiontoken${token}${LASTFM_API_SECRET}`;
    return md5(str);
}

// Last.fm callback endpoint
app.get('/lastfm/callback', async (req, res) => {
    const { token, userId } = req.query;
    if (!token || !userId) return res.status(400).send('Missing token or userId');
    const url = `https://ws.audioscrobbler.com/2.0/?method=auth.getSession&api_key=${LASTFM_API_KEY}&token=${token}&api_sig=${getApiSig(token)}&format=json`;
    const response = await fetch(url);
    const data = await response.json();
    if (!data.session) return res.status(400).send('Failed to get session');
    await setUserLink(userId, data.session.name);
    res.send('Your Last.fm account has been linked! You can now use the /musicrate command in Discord.');
});

// Endpoint to get Last.fm username for a Discord user ID
app.get('/lastfm/user/:userId', async (req, res) => {
    const { userId } = req.params;
    const username = await getUserLink(userId);
    if (!username) return res.status(404).send('Not linked');
    res.json({ username });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Last.fm auth server running on port ${PORT}`);
});