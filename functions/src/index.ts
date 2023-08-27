/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import {setGlobalOptions} from "firebase-functions/v2";
import * as logger from "firebase-functions/logger";
import * as express from "express";

import {initializeApp} from "firebase-admin/app";
import {credential as fbsCredential} from "firebase-admin";
import {getFirestore} from "firebase-admin/firestore";
import {GarminActivity} from "./models/garmin";
import * as serviceAccount from "./serviceAccount.json";

setGlobalOptions({maxInstances: 10});

initializeApp({
  credential: fbsCredential.cert(serviceAccount),
});

const fadb = getFirestore();

// REST API

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("oki dokes");
});

app.get("/again", (req, res) => {
  res.send("oki dokes again");
});

app.get("/create", async (req, res) => {
  const wr = await fadb
    .collection("dummyRecords")
    .doc(String(Math.floor(Math.random() * 1000)))
    .create({hello: "world"});
  logger.info("WRITE RESULT");
  logger.info(wr);
  res.send("created");
});

app.post("/rawWorkout/garmin", async (req, res) => {
  // retrieve the upload token from the header
  const token = req.headers["x-extension-upload-token"];
  if (!token) {
    res.status(401).send({error: "Missing upload token"});
    return;
  }

  // find the corresponding user id
  const dbres = await fadb
    .collection("userSensitiveData")
    .where("extensionUploadToken", "==", token)
    .get();
  if (dbres.size !== 1) {
    res.status(401).send({error: "Token not valid"});
    return;
  }

  const userId = (await dbres.docs[0].ref.parent.parent?.get())?.id;

  if (!userId) {
    res.status(401).send({error: "Token not valid"});
    return;
  }

  // write all raw workouts to db
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
  await bw.close();
  res.send({status: "ok"});
});

exports.app = onRequest(app);

type GarminUploadRequestBody = {
  activities: GarminActivity[];
};
