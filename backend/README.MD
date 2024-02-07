# Moodbased

This application allows users to change the cover image of their Spotify playlists based on the average mood of the tracks in the playlist. The app analyzes the tracks in the selected playlist and calculates the average mood using the Spotify API. The user can then choose to update the cover image of the playlist with a pre-selected image that matches the calculated mood.

## Prerequisites

To use this app, you will need to have a _premium_ Spotify account and obtain a client ID and client secret from the Spotify Developer Dashboard.
You will also need to have a set of images that correspond to different moods and have their URLs ready to use.

## Installation

    1. Clone this repository to your local machine:
    2. Navigate to the directory where you cloned the repository:
    3. Install the required dependencies:
    4. Create a file called .env in the root directory of the project and
       add your Spotify client ID and client secret to it:
       
        CLIENT_SECRET=XXXX
        CLIENT_ID=XXXX
        PORT=XXXX

    5. In the .env file, add the URLs for the images that correspond to different moods.

## Usage

    1. Follow the prompts in the command line to log in to your Spotify account and select a playlist.
    2. The app will analyze the tracks in the playlist and calculate the average mood.
    3. You will be asked if you want to update the cover image of the playlist with a matching image.
       Choose Yes to proceed or No to cancel.
    4. If you choose to update the cover image, the app will set the cover image of the playlist to
       the pre-selected image that matches the calculated mood.

## Disclaimer

This app is for educational purposes only and is not affiliated with Spotify. Use at your own risk.
