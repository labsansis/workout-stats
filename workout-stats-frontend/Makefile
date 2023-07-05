format:
	npx prettier -w .

# Deploy to prod. For now this is just an S3 bucket with a manually
# configured CloudFront distribution sitting in front of it.
deploy-prod:
	npm run build
	cd build && aws s3 sync ./ ${FRONTEND_S3_BUCKET_URL_PROD}
	aws cloudfront create-invalidation \
		--distribution-id ${FRONTEND_CLOUDFRONT_DISTRO_ID} \
		--paths "/*"