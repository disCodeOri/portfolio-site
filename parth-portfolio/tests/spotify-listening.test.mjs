import test from "node:test";
import assert from "node:assert/strict";
import {
  extractPlaylistId,
  getListeningTrack,
  mapSpotifyTrack,
  pickFallbackOffset,
} from "../lib/spotify-listening.js";

test("extractPlaylistId reads Spotify playlist URLs", () => {
  assert.equal(
    extractPlaylistId("https://open.spotify.com/playlist/2TWRgyhokbTzmxcNtSlSa6?si=180c577f685c4971"),
    "2TWRgyhokbTzmxcNtSlSa6",
  );
});

test("mapSpotifyTrack returns the listening card data", () => {
  const track = mapSpotifyTrack(
    {
      id: "track-1",
      name: "Night City Glow",
      external_urls: { spotify: "https://open.spotify.com/track/track-1" },
      album: {
        images: [
          { url: "large.jpg", width: 640, height: 640 },
          { url: "small.jpg", width: 64, height: 64 },
        ],
      },
      artists: [{ name: "V" }, { name: "Samurai" }],
    },
    "live",
  );

  assert.deepEqual(track, {
    albumImageUrl: "large.jpg",
    artist: "V, Samurai",
    id: "track-1",
    isPlaying: true,
    source: "live",
    title: "Night City Glow",
    url: "https://open.spotify.com/track/track-1",
  });
});

test("pickFallbackOffset clamps empty playlists to zero", () => {
  assert.equal(pickFallbackOffset(0, () => 0.9), 0);
});

test("pickFallbackOffset returns a deterministic bounded random offset", () => {
  assert.equal(pickFallbackOffset(25, () => 0.5), 12);
  assert.equal(pickFallbackOffset(25, () => 0.999), 24);
});

test("getListeningTrack returns an unavailable state when fallback playlist has no usable track", async () => {
  const previousEnv = { ...process.env };
  process.env.SPOTIFY_CLIENT_ID = "client";
  process.env.SPOTIFY_CLIENT_SECRET = "secret";
  process.env.SPOTIFY_REFRESH_TOKEN = "refresh";

  const responses = [
    { ok: true, json: async () => ({ access_token: "access" }) },
    { ok: true, status: 204 },
    { ok: true, json: async () => ({ total: 0, items: [] }) },
  ];
  const fetchImpl = async () => responses.shift();

  const track = await getListeningTrack(fetchImpl);

  assert.equal(track.id, "spotify-empty-playlist");
  assert.equal(track.title, "Playlist signal unavailable");
  process.env = previousEnv;
});

test("getListeningTrack returns public-safe copy when Spotify credentials are missing", async () => {
  const previousEnv = { ...process.env };
  delete process.env.SPOTIFY_CLIENT_ID;
  delete process.env.SPOTIFY_CLIENT_SECRET;
  delete process.env.SPOTIFY_REFRESH_TOKEN;

  const track = await getListeningTrack(async () => {
    throw new Error("fetch should not run without credentials");
  });

  assert.equal(track.id, "spotify-not-configured");
  assert.equal(track.title, "Signal offline");
  assert.equal(track.artist, "Spotify uplink pending");
  process.env = previousEnv;
});
