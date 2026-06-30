const DEFAULT_FALLBACK_PLAYLIST_ID = "2TWRgyhokbTzmxcNtSlSa6";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const SPOTIFY_API = "https://api.spotify.com/v1";

const EMPTY_PLAYLIST_TRACK = {
  albumImageUrl: null,
  artist: "Fallback playlist returned no track",
  id: "spotify-empty-playlist",
  isPlaying: false,
  source: "playlist",
  title: "Playlist signal unavailable",
  url: null,
};

function extractPlaylistId(value) {
  if (!value) {
    return DEFAULT_FALLBACK_PLAYLIST_ID;
  }

  const match = value.match(/playlist\/([A-Za-z0-9]+)/);
  return match?.[1] ?? value;
}

function mapSpotifyTrack(track, source) {
  if (!track || track.type === "episode") {
    return null;
  }

  return {
    albumImageUrl: track.album?.images?.[0]?.url ?? null,
    artist: track.artists?.map((artist) => artist.name).filter(Boolean).join(", ") ?? "Unknown artist",
    id: track.id,
    isPlaying: source === "live",
    source,
    title: track.name,
    url: track.external_urls?.spotify ?? null,
  };
}

function pickFallbackOffset(total, random = Math.random) {
  if (!total || total < 1) {
    return 0;
  }

  return Math.min(total - 1, Math.floor(random() * total));
}

async function getAccessToken(fetchImpl = fetch) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetchImpl(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error(`Spotify token refresh failed with ${response.status}`);
  }

  const data = await response.json();
  return data.access_token ?? null;
}

async function getCurrentlyPlaying(accessToken, fetchImpl = fetch) {
  const response = await fetchImpl(`${SPOTIFY_API}/me/player/currently-playing`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (response.status === 204 || response.status === 202) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Spotify currently-playing failed with ${response.status}`);
  }

  const data = await response.json();
  if (!data?.is_playing || data.currently_playing_type !== "track") {
    return null;
  }

  return mapSpotifyTrack(data.item, "live");
}

async function getPlaylistFallback(accessToken, fetchImpl = fetch) {
  const playlistId = extractPlaylistId(
    process.env.SPOTIFY_FALLBACK_PLAYLIST_ID ?? process.env.SPOTIFY_FALLBACK_PLAYLIST_URL,
  );
  const baseUrl = `${SPOTIFY_API}/playlists/${playlistId}/tracks`;
  const initial = await fetchImpl(`${baseUrl}?limit=1&fields=total,items(track(id,name,type,artists(name),album(images(url,width,height)),external_urls))`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!initial.ok) {
    throw new Error(`Spotify playlist fallback failed with ${initial.status}`);
  }

  const initialData = await initial.json();
  const total = initialData.total ?? 0;
  const offset = pickFallbackOffset(total);
  const selected =
    offset === 0
      ? initialData
      : await fetchImpl(
          `${baseUrl}?limit=1&offset=${offset}&fields=items(track(id,name,type,artists(name),album(images(url,width,height)),external_urls))`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        ).then((response) => {
          if (!response.ok) {
            throw new Error(`Spotify playlist fallback offset failed with ${response.status}`);
          }
          return response.json();
        });

  return mapSpotifyTrack(selected.items?.[0]?.track, "playlist");
}

async function getListeningTrack(fetchImpl = fetch) {
  const accessToken = await getAccessToken(fetchImpl);
  if (!accessToken) {
    return {
      albumImageUrl: null,
      artist: "Spotify uplink pending",
      id: "spotify-not-configured",
      isPlaying: false,
      source: "unconfigured",
      title: "Signal offline",
      url: null,
    };
  }

  return (
    (await getCurrentlyPlaying(accessToken, fetchImpl)) ??
    (await getPlaylistFallback(accessToken, fetchImpl)) ??
    EMPTY_PLAYLIST_TRACK
  );
}

module.exports = {
  DEFAULT_FALLBACK_PLAYLIST_ID,
  EMPTY_PLAYLIST_TRACK,
  extractPlaylistId,
  getAccessToken,
  getCurrentlyPlaying,
  getListeningTrack,
  getPlaylistFallback,
  mapSpotifyTrack,
  pickFallbackOffset,
};
