# Workout Stats Frontend

This dir contains the web app (front end). It was bootstrapped with Create React
App and retains a lot of the default configuration from there.

At the time of writing, the backend is built fully serverless on Firebase, using
Firebase Auth for user management and Cloud Firestore as the db.

Currently all backend is configured manually via the Firebase console.

## Running

Running `npm install` and `npm start` should start the front end locally.

Note that it will by default talk to the prod backend, so be careful with
what data you upload etc.

## Data model

At the time of writing, each workout is stored as raw Garmin Workout
Downloader JSON and parsed upon fetching from the server.

The Cloud Firestore contains one top-level collection `users`, which contains
a sub-collection `rawWorkouts` where each document is the raw workout as received
from the Garmin Workout Downloader brower extension. The workout document id
follows the convention `garmin_xxxx` where xxxx is the activity id coming from
Garmin's systems.

The frontend simply pulls all of the user's workouts and then any manipulation
(sorting, filtering etc) is done purely on the client end. It's very far from
elegant or efficient because it's been built with initial dev speed and
flexibility as a priority. This can and should change in the future.
