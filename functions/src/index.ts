/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as express from "express";

import { initializeApp } from "firebase-admin/app";
// import {getFirestore} from "firebase-admin/firestore";

initializeApp();

// REST API

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  logger.info("Hello logs!", { structuredData: true });
  res.status(200).send("Hey there! We're now using express!");
});

app.post("/rawWorkout/garmin", (req, res) => {});
exports.app = onRequest(app);
