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
import { getFirestore } from "firebase-admin/firestore";
import { GarminActivity } from "./models/garmin";

import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { parseGarminActivity } from "./common/parseGarmin";

initializeApp();

const fadb = getFirestore();

// REST API

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  logger.info("Hello logs!", { structuredData: true });
  res.status(200).send("Hey there! We're now using express!");
});

app.post("/rawWorkout/garmin", async (req, res) => {
  const token = req.headers["x-extension-upload-token"];
  if (!token) {
    res.status(401).send({ error: "Missing upload token" });
    return;
  }
  const dbres = await fadb
    .collectionGroup("accessTokens")
    .where("extensionUploadToken", "==", token)
    .get();
  if (dbres.size !== 1) {
    res.status(401).send({ error: "Token not valid" });
    return;
  }

  const userId = (await dbres.docs[0].ref.parent.parent?.get())?.id;

  if (!userId) {
    res.status(401).send({ error: "Token not valid" });
    return;
  }

  const bw = fadb.bulkWriter();

  (req.body as GarminUploadRequestBody).activities.forEach((a) => {
    bw.set(
      fadb
        .collection("users")
        .doc(userId)
        .collection("rawWorkouts")
        .doc(`garmin_${a.activityId}`),
      a,
    );
  });
  bw.close();
  res.send({ status: "ok" });
});

app.post("/dummy-create-user-with-auth-token", (req, res) => {
  const d = req.body as DummyUserCreateRequest;

  fadb.doc(`users/${d.userId}/accessTokens/accessTokens`).create({
    extensionUploadToken: d.extensionUploadToken,
  });

  res.send({ status: "ok" });
});

type DummyUserCreateRequest = {
  userId: string;
  extensionUploadToken: string;
};

exports.app = onRequest(app);

type GarminUploadRequestBody = {
  activities: GarminActivity[];
};

// Firebase Event Triggered Functions

exports.parseRawWorkout = onDocumentWritten(
  "/users/{userId}/rawWorkouts/{rawWorkoutId}",
  (event) => {
    const original = event.data?.after.data();

    if (!original) {
      // This might mean that the document has been deleted. Currently the
      // system does not support deletions, so just ignoring it here.
      return;
    }

    const parsed = parseGarminActivity(original as GarminActivity);

    const userId = event.params.userId;
    const rawWorkoutId = event.params.rawWorkoutId;

    if (!parsed) {
      logger.error("Could not parse workout", { userId, rawWorkoutId });
      return;
    }

    fadb.doc(`users/${userId}/workouts/${rawWorkoutId}`).create(parsed);
  },
);
