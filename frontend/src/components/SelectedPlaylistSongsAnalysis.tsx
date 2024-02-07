// Utilize the Get Tracks’ Audio Features endpoint from Spotify

import { useEffect, useState } from "react";
import { fetchTracks, fetchTracksMetadata } from "../services/spotifyApi";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { MyResponsiveBar } from "./nivoCharts/responsiveBar";
import { noteNames } from "../utils/musicTheoryUtils";
import {
  barGraphData,
  pieChartData,
} from "../utils/nivoUtils/graphDataConverters";
import { MyResponsivePie } from "./nivoCharts/responsivePie";
import { Track } from "spotify-types";
import React from "react";
import { truncateTitle } from "../utils/songTitleUtils";
import spotifyLogo from "../images/spotify.png";

export interface TrackAnalysis {
  valence: number;
  valenceCollection: number[];
  tempo: number;
  energy: number;
  major: { key: string[] };
  minor: { key: string[] };
  count: number;
}

type TopFiveSaddestHappiest = {
  happiest: {
    valence: number[];
    track_id: (string | Track)[]; // Allow strings and Track objects
  };
  saddest: {
    valence: number[];
    track_id: (string | Track)[]; // Allow strings and Track objects
  };
};

export const SelectedPlaylistSongsAnalysis = ({
  trackIds,
}: {
  trackIds: string;
}): JSX.Element => {
  const [combinedScaleData, setCombinedScaleData] = useState<Array<{}>>([]);
  const [valenceData, setValenceData] = useState<Array<{}>>([]);
  const [TopFiveSaddestHappiest, setTopFiveSaddestHappiest] =
    useState<TopFiveSaddestHappiest>();

  const getTracks = async (track_id: string) => {
    const trackIds = track_id.split("%2c");

    const audioFeatures = [];

    try {
      for (let i = 0; i < trackIds.length; i += 50) {
        const chunk = trackIds.slice(i, i + 50).join("%2c");
        const audioFeaturesChunk = await fetchTracks(chunk);

        if (audioFeaturesChunk && audioFeaturesChunk.audio_features) {
          audioFeatures.push(
            ...audioFeaturesChunk.audio_features.filter(
              (feature) => feature !== null
            )
          );
        }
      }

      return audioFeatures;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  useEffect(() => {
    const analyzeTracks = async () => {
      try {
        let trackCalculations: TrackAnalysis = {
          valence: 0,
          valenceCollection: [],
          tempo: 0,
          energy: 0,
          major: { key: [] },
          minor: { key: [] },
          count: 0,
        };

        let TopFiveSaddestHappiest: TopFiveSaddestHappiest = {
          happiest: { valence: [], track_id: [] },
          saddest: { valence: [], track_id: [] },
        };

        const audio_features = await getTracks(trackIds);

        if (!audio_features) {
          return;
        }

        // Get valence, tempo, mode, key, energy.
        // valence: a measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. (Get average)
        // tempo: beats per minute. (Get average)
        // energy: Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity (Get average)
        // mode: major is represented by 1 and minor is 0. (Get most common)
        // key: The key the track is in. Integers map to pitches using standard Pitch Class notation.
        // E.g. 0 = C, 1 = C♯/D♭, 2 = D, and so on. If no key was detected, the value is -1 (Get most common)

        if (audio_features) {
          for (const track of audio_features) {
            if (track.mode === 1) {
              trackCalculations.major.key.push(noteNames[track.key]);
            } else {
              trackCalculations.minor.key.push(noteNames[track.key]);
            }
            trackCalculations.valence += track.valence;
            trackCalculations.valenceCollection.push(track.valence);
            trackCalculations.tempo += track.tempo;
            trackCalculations.energy += track.energy;
            trackCalculations.count++;

            setCombinedScaleData([
              barGraphData(trackCalculations.major.key, "Major"),
              barGraphData(trackCalculations.minor.key, "Minor"),
            ]);

            let currentValence = track.valence;
            let currentTrack = track.id;

            if (currentValence < 0.5) {
              TopFiveSaddestHappiest.saddest.valence.push(currentValence);
              TopFiveSaddestHappiest.saddest.track_id.push(currentTrack);
            } else {
              TopFiveSaddestHappiest.happiest.valence.push(currentValence);
              TopFiveSaddestHappiest.happiest.track_id.push(currentTrack);
            }
          }

          // Map valence and track_id arrays to an array of objects containing both
          const happiest = TopFiveSaddestHappiest.happiest.valence
            .map((valence, index) => ({
              valence,
              track_id: TopFiveSaddestHappiest.happiest.track_id[index],
            }))
            .filter((item) => item.valence !== 0);
          const saddest = TopFiveSaddestHappiest.saddest.valence
            .map((valence, index) => ({
              valence,
              track_id: TopFiveSaddestHappiest.saddest.track_id[index],
            }))
            .filter((item) => item.valence !== 0);

          // Sort the arrays of objects by valence
          if (happiest.length > 0) {
            happiest.sort((a, b) => b.valence - a.valence);

            // Extract the sorted valence and track_id arrays separately
            const sortedHappiestValence = happiest.map((item) => item.valence);
            const sortedHappiestTrackIds = happiest.map(
              (item) => item.track_id
            );

            // Update the original object with the sorted arrays
            TopFiveSaddestHappiest.happiest.valence = sortedHappiestValence;
            TopFiveSaddestHappiest.happiest.track_id = sortedHappiestTrackIds;

            const topFiveHappiest = await fetchTracksMetadata(
              TopFiveSaddestHappiest.happiest.track_id.slice(0, 5).join(",")
            );

            if (topFiveHappiest) {
              // Loop through each object in the `happiest` and `saddest` arrays
              for (let i = 0; i < topFiveHappiest.tracks.length; i++) {
                // Replace the `track_id` array in the `TopFiveSaddestHappiest` object with each object in the `tracks` array that holds objects in `topFiveHappiest`
                TopFiveSaddestHappiest.happiest.track_id[i] =
                  topFiveHappiest.tracks[i];
              }
            }
          }

          if (saddest.length > 0) {
            saddest.sort((a, b) => a.valence - b.valence);

            // Extract the sorted valence and track_id arrays separately
            const sortedSaddestValence = saddest.map((item) => item.valence);
            const sortedSaddestTrackIds = saddest.map((item) => item.track_id);

            // Update the original object with the sorted arrays;
            TopFiveSaddestHappiest.saddest.valence = sortedSaddestValence;
            TopFiveSaddestHappiest.saddest.track_id = sortedSaddestTrackIds;

            const topFiveSaddest = await fetchTracksMetadata(
              TopFiveSaddestHappiest.saddest.track_id.slice(0, 5).join(",")
            );

            if (topFiveSaddest) {
              // Loop through each object in the `happiest` and `saddest` arrays
              for (let i = 0; i < topFiveSaddest.tracks.length; i++) {
                // Replace the `track_id` array in the `TopFiveSaddestHappiest` object with each object in the `tracks` array that holds objects in `topFiveHappiest`
                TopFiveSaddestHappiest.saddest.track_id[i] =
                  topFiveSaddest.tracks[i];
              }
            }
          }
          setTopFiveSaddestHappiest(TopFiveSaddestHappiest);

          trackCalculations.tempo =
            trackCalculations.tempo / trackCalculations.count;
          trackCalculations.energy =
            trackCalculations.energy / trackCalculations.count;

          setValenceData(pieChartData(trackCalculations.valenceCollection));
        }
      } catch (error) {
        console.log(error);
      }
    };
    analyzeTracks();
  }, [trackIds]);

  return (
    <Paper
      sx={{
        borderRadius: 2,
        background: "linear-gradient(45deg, #1DB954, #21fa90ff, #1DB954)",
        width: "100%",
        marginX: 1,
      }}
    >
      <Typography variant="h5" textAlign={"center"} color="#191414">
        Moodbased
      </Typography>
      <Grid
        container
        sx={{
          background: "#191414",
          border: "1px solid #1DB954",
          maxWidth: "100%",
        }}
      >
        <>
          {trackIds ? (
            <>
              <Grid
                item
                xs={12}
                sm={6}
                lg={6}
                md={6}
                textAlign={"center"}
                width={"100%"}
              >
                <Typography variant="h5" marginTop={3} padding={1}>
                  Key and Scale Breakdown of Playlist Tracks
                </Typography>
                <Box height={425} width={"100%"}>
                  <MyResponsiveBar data={combinedScaleData}></MyResponsiveBar>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} lg={6} md={6} textAlign={"center"}>
                <Typography variant="h5" marginTop={3} padding={1}>
                  Distribution of Tracks by Mood
                </Typography>
                <Box height={400} width={"100%"}>
                  <MyResponsivePie
                    width={"100%"}
                    data={valenceData}
                  ></MyResponsivePie>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} lg={12} md={12} textAlign={"center"}>
                <Paper
                  elevation={7}
                  sx={{
                    width: "75%",
                    margin: "0 auto",
                    padding: 2,
                    marginBottom: 8,
                  }}
                >
                  <Typography variant="body1" width={"100%"} marginBottom={2}>
                    <b>Valence:</b> a metric that ranges from 0 to 100% and
                    indicates the level of positivity conveyed by a piece of
                    music
                  </Typography>
                  <Typography variant="body1" width={"100%"} marginBottom={2}>
                    <b>High Valence:</b> happy, cheerful, or euphoric{" "}
                    <span style={{ fontSize: 22 }}>😃</span>
                  </Typography>
                  <Typography variant="body1" width={"100%"}>
                    <b>Low Valence:</b> sad, depressed, or angry{" "}
                    <span style={{ fontSize: 22 }}>☹️</span>
                  </Typography>
                </Paper>
              </Grid>
              {TopFiveSaddestHappiest ? (
                <>
                  {TopFiveSaddestHappiest.happiest.valence.length > 0 && (
                    <Grid
                      item
                      xs={12}
                      sm={
                        TopFiveSaddestHappiest.saddest.valence.length > 0
                          ? 6
                          : 12
                      }
                      lg={
                        TopFiveSaddestHappiest.saddest.valence.length > 0
                          ? 6
                          : 12
                      }
                      md={
                        TopFiveSaddestHappiest.saddest.valence.length > 0
                          ? 6
                          : 12
                      }
                      width={"100%"}
                    >
                      <Box marginBottom={1} width={"100%"} padding={2}>
                        <Typography variant="h5" textAlign={"center"}>
                          Tracks With the Highest Valence
                        </Typography>
                      </Box>

                      <Grid item spacing={1} width={"100%"}>
                        {TopFiveSaddestHappiest?.happiest.track_id
                          .slice(0, 5)
                          .map((trackIdHappy, index) => {
                            const valence =
                              TopFiveSaddestHappiest?.happiest.valence[index];
                            if (typeof trackIdHappy === "string") {
                              // Handle the case where trackId is a string
                              return <div>{trackIdHappy}</div>;
                            } else {
                              // Handle the case where trackId is a Track object
                              return (
                                <Box key={trackIdHappy.id} width={"100%"}>
                                  <Grid
                                    container
                                    width={"100%"}
                                    marginBottom={3}
                                  >
                                    <Grid
                                      item
                                      xs={3}
                                      sm={
                                        TopFiveSaddestHappiest.saddest.valence
                                          .length > 0
                                          ? 3
                                          : 5
                                      }
                                      lg={
                                        TopFiveSaddestHappiest.saddest.valence
                                          .length > 0
                                          ? 3
                                          : 5
                                      }
                                      md={
                                        TopFiveSaddestHappiest.saddest.valence
                                          .length > 0
                                          ? 3
                                          : 5
                                      }
                                    >
                                      <Box textAlign={"center"} width={"100%"}>
                                        <img
                                          width={"60%"}
                                          src={trackIdHappy.album.images[1].url}
                                          alt={trackIdHappy.name}
                                        />
                                      </Box>
                                    </Grid>
                                    <Grid
                                      item
                                      xs={9}
                                      sm={
                                        TopFiveSaddestHappiest.saddest.valence
                                          .length > 0
                                          ? 9
                                          : 7
                                      }
                                      lg={
                                        TopFiveSaddestHappiest.saddest.valence
                                          .length > 0
                                          ? 9
                                          : 7
                                      }
                                      md={
                                        TopFiveSaddestHappiest.saddest.valence
                                          .length > 0
                                          ? 9
                                          : 7
                                      }
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <Box width="100%" minWidth="20%">
                                        <a
                                          style={{
                                            textDecoration: "none",
                                            color: "#FFFFFF",
                                          }}
                                          href={
                                            trackIdHappy.external_urls.spotify
                                          }
                                        >
                                          <span className="artist-name">
                                            {trackIdHappy.artists
                                              .map(
                                                (artistHappy) =>
                                                  artistHappy.name
                                              )
                                              .join(", ")}{" "}
                                            - {truncateTitle(trackIdHappy.name)}
                                          </span>
                                        </a>
                                      </Box>

                                      <Box
                                        style={{
                                          width: "100%",
                                        }}
                                      >
                                        {trackIdHappy.preview_url ? (
                                          <Box width={"75%"}>
                                            <audio
                                              style={{ width: "75%" }}
                                              src={trackIdHappy.preview_url}
                                              controls
                                              className="track-audio"
                                            />
                                          </Box>
                                        ) : (
                                          <div>
                                            Track preview not available...
                                          </div>
                                        )}

                                        <Box width={"100%"}>
                                          <span
                                            style={{
                                              marginRight: 2,
                                              maxWidth: "50%",
                                            }}
                                          >
                                            {valence ? (
                                              "Valence: " +
                                              (valence * 100).toFixed(1) +
                                              "%"
                                            ) : (
                                              <div>
                                                Track valence not available...
                                              </div>
                                            )}
                                          </span>
                                        </Box>
                                      </Box>
                                    </Grid>
                                  </Grid>
                                </Box>
                              );
                            }
                          })}
                      </Grid>
                    </Grid>
                  )}
                  {TopFiveSaddestHappiest.saddest.valence.length > 0 && (
                    <Grid
                      item
                      xs={12}
                      sm={
                        TopFiveSaddestHappiest.happiest.valence.length > 0
                          ? 6
                          : 12
                      }
                      lg={
                        TopFiveSaddestHappiest.happiest.valence.length > 0
                          ? 6
                          : 12
                      }
                      md={
                        TopFiveSaddestHappiest.happiest.valence.length > 0
                          ? 6
                          : 12
                      }
                      width={"100%"}
                    >
                      <Box marginBottom={1} width={"100%"} padding={2}>
                        <Typography variant="h5" textAlign={"center"}>
                          Tracks With the Lowest Valence
                        </Typography>
                      </Box>

                      <Grid item spacing={1} width={"100%"}>
                        {TopFiveSaddestHappiest?.saddest.track_id
                          .slice(0, 5)
                          .map((trackIdSad, index) => {
                            const valence =
                              TopFiveSaddestHappiest?.saddest.valence[index];
                            if (typeof trackIdSad === "string") {
                              // Handle the case where trackId is a string
                              return <div>{trackIdSad}</div>;
                            } else {
                              // Handle the case where trackId is a Track object
                              return (
                                <Box key={trackIdSad.id} width={"100%"}>
                                  <Grid
                                    container
                                    width={"100%"}
                                    marginBottom={3}
                                  >
                                    <Grid
                                      item
                                      xs={3}
                                      sm={
                                        TopFiveSaddestHappiest.happiest.valence
                                          .length > 0
                                          ? 3
                                          : 5
                                      }
                                      lg={
                                        TopFiveSaddestHappiest.happiest.valence
                                          .length > 0
                                          ? 3
                                          : 5
                                      }
                                      md={
                                        TopFiveSaddestHappiest.happiest.valence
                                          .length > 0
                                          ? 3
                                          : 5
                                      }
                                    >
                                      <Box textAlign={"center"} width={"100%"}>
                                        <img
                                          width={"60%"}
                                          src={trackIdSad.album.images[1].url}
                                          alt={trackIdSad.name}
                                        />
                                      </Box>
                                    </Grid>
                                    <Grid
                                      item
                                      xs={9}
                                      sm={
                                        TopFiveSaddestHappiest.happiest.valence
                                          .length > 0
                                          ? 9
                                          : 7
                                      }
                                      lg={
                                        TopFiveSaddestHappiest.happiest.valence
                                          .length > 0
                                          ? 9
                                          : 7
                                      }
                                      md={
                                        TopFiveSaddestHappiest.happiest.valence
                                          .length > 0
                                          ? 9
                                          : 7
                                      }
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <Box width="100%" minWidth="20%">
                                        <a
                                          style={{
                                            textDecoration: "none",
                                            color: "#FFFFFF",
                                          }}
                                          href={
                                            trackIdSad.external_urls.spotify
                                          }
                                        >
                                          <span className="artist-name">
                                            {trackIdSad.artists
                                              .map(
                                                (artistSad) => artistSad.name
                                              )
                                              .join(", ")}{" "}
                                            - {truncateTitle(trackIdSad.name)}
                                          </span>
                                        </a>
                                      </Box>

                                      <Box
                                        style={{
                                          width: "100%",
                                        }}
                                      >
                                        {trackIdSad.preview_url ? (
                                          <Box width={"75%"}>
                                            <audio
                                              style={{ width: "75%" }}
                                              src={trackIdSad.preview_url}
                                              controls
                                              className="track-audio"
                                            />
                                          </Box>
                                        ) : (
                                          <div>
                                            Track preview not available...
                                          </div>
                                        )}

                                        <Box width={"100%"}>
                                          <span
                                            style={{
                                              marginRight: 2,
                                              maxWidth: "50%",
                                            }}
                                          >
                                            {valence ? (
                                              "Valence: " +
                                              (valence * 100).toFixed(1) +
                                              "%"
                                            ) : (
                                              <div>
                                                Track valence not available...
                                              </div>
                                            )}
                                          </span>
                                        </Box>
                                      </Box>
                                    </Grid>
                                  </Grid>
                                </Box>
                              );
                            }
                          })}
                      </Grid>
                    </Grid>
                  )}
                </>
              ) : (
                <></>
              )}
              <Grid item width={"100%"} textAlign={"center"}>
                <img
                  src={spotifyLogo}
                  alt="spotify logo"
                  width={120}
                  min-width={120}
                  style={{ padding: 2 }}
                />
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12} sm={12} lg={12} md={12}>
                <Box
                  sx={{
                    background: "#191414",
                    margin: 2,
                    borderRadius: 2.5,
                    padding: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    width={"100%"}
                    marginBottom={2}
                  >
                    Moodbased is an application that utilizes the Spotify API to
                    help users get a deeper understanding of the mood of their
                    selected playlist{" "}
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    marginBottom={2}
                    width={"100%"}
                  >
                    With its user-friendly interface, Moodbased provides three
                    main features to its users:{" "}
                  </Typography>

                  <Typography variant="body1" width={"100%"} marginBottom={2}>
                    Firstly, the application generates a bar graph that breaks
                    down all the songs in the playlist based on their key and
                    scale. This feature helps users gain insight into the
                    tonality and musical characteristics of the playlist{" "}
                    <span style={{ fontSize: 22 }}>📊</span>
                  </Typography>

                  <Typography variant="body1" width={"100%"} marginBottom={2}>
                    Secondly, using valence, Moodbased calculates the
                    Distribution of Tracks in the playlist by Mood. This feature
                    gives users an overall understanding of the emotional tone
                    of the playlist <span style={{ fontSize: 22 }}>😃☹️</span>
                  </Typography>

                  <Typography variant="body1" width={"100%"} marginBottom={2}>
                    Lastly, Moodbased identifies the top five saddest and
                    happiest songs in the entire playlist, giving users a quick
                    and easy way to identify the most emotional songs in their
                    playlist <span style={{ fontSize: 22 }}>🎵</span>
                  </Typography>

                  <Typography
                    variant="h5"
                    textAlign={"center"}
                    marginTop={3}
                    width={"100%"}
                  >
                    <b>
                      {" "}
                      Select a playlist from the dropdown menu above to begin{" "}
                      <span style={{ fontSize: 22 }}>☝️</span>
                    </b>
                  </Typography>
                </Box>
              </Grid>
            </>
          )}
        </>
      </Grid>
    </Paper>
  );
};
