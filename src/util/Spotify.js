import React from 'react';

const clientId = `7377fe011c744df18f95a5730440d08e`;
const redirectUrl = "http://localhost:3000/";
let userAccessToken = undefined;
let urlExpirationTime = undefined;


const Spotify = {

  getAccessToken() {
    if (userAccessToken) {
      return userAccessToken;
    } else {
      const accessToken = window.location.href.match(/access_token=([^&]*)/);
      const expirationTime = window.location.href.match(/expires_in=([^&]*)/);
      if (accessToken && expirationTime) {
        userAccessToken = accessToken[1];
        urlExpirationTime = expirationTime[1];
        window.setTimeout(() => userAccessToken = '', urlExpirationTime * 1000);
        window.history.pushState('Access Token', null, '/');
      } else {
        const newUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUrl}`;
        window.location = newUrl;
      }
    }
  },

  search(term) {
    this.getAccessToken();
    const searchUrl = `https://api.spotify.com/v1/search?type=track&q=${term}`;
    return fetch(searchUrl, {
      headers: {
        Authorization: `Bearer ${userAccessToken}`
      }
    }).then(response => response.json()).then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));
    })
  },

  savePlaylist(playlistName, trackUris) {
    if (!playlistName || !trackUris) {
      return;
    } else {
      const currentUserAccessToken = userAccessToken;
      const headers = {
        Authorization: `Bearer ${userAccessToken}`
      };
      let userId = undefined;
      let spotifyEndpoint = `https://api.spotify.com/v1/me`;
       return fetch(spotifyEndpoint, {
        headers: headers
      }).then(response => response.json()).then(jsonResponse => userId = jsonResponse.id).then(() => {
        const createPlaylistUrl = `/v1/users/${userId}/playlists`;
         return fetch(createPlaylistUrl, {
          headers: headers,
          method: 'POST',
          body: { uris: trackUris }
        })
      }).then(response => response.json()).then(jsonResponse => spotifyEndpoint = jsonResponse.id).then(() => {
          const addTracksToPlaylist = `https://api.spotify.com/v1/users/${userId}/playlists/${spotifyEndpoint}/tracks`;
           fetch(addTracksToPlaylist, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
              uris: trackUris
            })
          });
        })
    }
  }

};

export default Spotify;
