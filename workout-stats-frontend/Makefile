format:
	npx prettier -w .

# Deploy to prod. For now this is just an S3 bucket with a manually
# configured CloudFront distribution sitting in front of it.
# We exclude the garmin-workout-downloder directory when syncing because
# this dir may contain the self-published browser extension (upload logic
# for this is in the garmin-workout-downloader repo).
deploy-prod:
	npm run build
	cd build && aws s3 sync ./ ${FRONTEND_S3_BUCKET_URL_PROD} \
		--delete \
		--exclude "garmin-workout-downloader"
	aws cloudfront create-invalidation \
		--distribution-id ${FRONTEND_CLOUDFRONT_DISTRO_ID} \
		--paths "/*"
