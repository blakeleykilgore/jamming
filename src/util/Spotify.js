const clientId = 7377fe011c744df18f95a5730440d08e;
const redirectUrl = "http://localhost:3000/";
import React from 'react';

const accessToken;
const Spotify = {
  getAccessToken() {
    if (token) {
      return token;
    }
    const accessToken = window.location.href.match(/access_token=([^&]*)/);
    const expirationTime = window.location.href.match(/expires_in=([^&]*)/);
    if (accessToken && expirationTime) {
      token = accessToken[1];
      time = expirationTime[1];
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
    } else {
      const newUrl = `https://accounts.spotify.com/authorize?client_id=CLIENT_ID&response_type=token&scope=playlist-modify-public&redirect_uri=REDIRECT_URI`;
      window.location = redirectUrl;
    }
};

export default Spotify;
