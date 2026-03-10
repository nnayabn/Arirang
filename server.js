// server.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

const clientId = '60a8cc35b3ad47598621c077d0ffde47';
const clientSecret = 'c53e769db69e4cbfbdd8daf6768d9af6';
const redirectUri = 'http://localhost:5500/callback.html'; // Must match Spotify app

app.get('/spotify/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send("No code received");

  // Exchange code for access token
  const body = new URLSearchParams();
  body.append('grant_type', 'authorization_code');
  body.append('code', code);
  body.append('redirect_uri', redirectUri);

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  });

  const data = await response.json();
  const access_token = data.access_token;

  if (!access_token) return res.send("Failed to get access token");

  // Save album to user library
  const albumId = '1DcxHW214MCDxXju71RbvX'; // BTS ARIRANG
  await fetch(`https://api.spotify.com/v1/me/albums?ids=${albumId}`, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + access_token
    }
  });

  // Redirect back to your main page with done=true
  res.redirect('http://localhost:5500/index.html?done=true');
});

app.listen(port, () => console.log(`Backend running on http://localhost:${port}`));