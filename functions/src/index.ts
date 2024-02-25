/**
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import {setGlobalOptions} from "firebase-functions/v2";
// import * as logger from "firebase-functions/logger";
import * as express from "express";

import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {GarminActivity} from "./models/garmin";

setGlobalOptions({maxInstances: 10});

initializeApp();

const fadb = getFirestore();

// REST API

const app = express();
app.use(express.json());

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

  const userId = dbres.docs[0].id;

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

exports.app = onRequest({cors: true}, app);

type GarminUploadRequestBody = {
  activities: GarminActivity[];
};
