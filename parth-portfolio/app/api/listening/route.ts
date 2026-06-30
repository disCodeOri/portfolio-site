import spotifyListening from "@/lib/spotify-listening";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const track = await spotifyListening.getListeningTrack();

    return Response.json(track, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Spotify error";

    return Response.json(
      {
        albumImageUrl: null,
        artist: message,
        id: "spotify-error",
        isPlaying: false,
        source: "error",
        title: "Signal interrupted",
        url: null,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
        status: 200,
      },
    );
  }
}
