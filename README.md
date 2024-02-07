# Moodbased

Moodbased is an application that utilizes the Spotify API to help users get a deeper understanding of the mood of their selected playlist. With its user-friendly interface, Moodbased provides three main features to its users:

Generates a bar graph that breaks down all the songs in the playlist based on their key and scale. This feature helps users gain insight into the tonality and musical characteristics of the playlist.

Breaks down the moods of each song in the selected playlist and presents them in a visually appealing donut chart, complete with emojis depicting different moods such as sadness, anger, happiness, euphoria, and more.

Identifies the top five saddest and happiest songs in the entire playlist (based on valence), giving users a quick and easy way to identify the most emotional songs in their playlist.

![Example of the Moodbased dashboard](https://i.imgur.com/qN6xbqt.png)

## Prerequisites

To use this app, you will need to have a _premium_ Spotify account and obtain a client ID and client secret from the Spotify Developer Dashboard.

## Installation

    1. Clone this repository to your local machine:
    2. Navigate to the directory where you cloned the repository:
    3. Install the required dependencies in frontend and backend:
    4. Create a .env file and add your Spotify client ID and client secret to it:

        CLIENT_SECRET=XXXX
        CLIENT_ID=XXXX
        PORT=XXXX

    5. Add the callback url for your app on the Spotify dashboard.

    If you are using a Mac with an M1 chip and get the following error after running `npm install` in backend:

    Error: Cannot find module 'node-bin-darwin-arm64/package.json

    Simply run the following to fix it:

    $ nvm uninstall 18
    $ arch -x86_64 zsh
    $ nvm install 18
    $ nvm alias default 18


## Disclaimer

This app is for educational purposes only and is not affiliated with Spotify. Use at your own risk.
