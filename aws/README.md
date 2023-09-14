This dir contains a bunch of AWS resources that are used for Workout Stats.

The project is mostly hosted on GCP and the current intention is to host it on
one cloud for simplixity. However, there have been some recent issues with GCP
Cloud Functions in this project, and AWS is used temporarily while that is
being sorted.

At the time of writing AWS is used for two things:

* Hosting the compiled front end code (S3)
* A REST API to collect user feedback (Lambda + Dynamo)

Nothing here is automated (in terms of CI) or properly tested.
