#!/bin/bash
# build
export REACT_APP_SENTRY_RELEASE=$(git rev-parse --short HEAD)
GENERATE_SOURCEMAP=true react-scripts --max_old_space_size=8192 build

# install sentry cli
echo "Installing and configuring sentry cli"
yarn run sentry-cli --version
export SENTRY_ORG=circlein
export SENTRY_PROJECT=web
# create sentry release and upload source maps
echo "Creating release"
yarn run sentry-cli releases new ${REACT_APP_SENTRY_RELEASE}
#echo "Setting release commits"
#yarn run sentry-cli releases set-commits --commit "https://bitbucket.org/MyQVO/web-app-frontend-v2/commits/@${REACT_APP_SENTRY_RELEASE}" ${REACT_APP_SENTRY_RELEASE}
echo "Link deploy to release"
yarn run sentry-cli releases deploys ${REACT_APP_SENTRY_RELEASE} new -e prod
echo "Uploading source maps"
if [ -d build ]; then
  yarn run sentry-cli releases files ${REACT_APP_SENTRY_RELEASE} upload-sourcemaps build/static/js/ --rewrite --url-prefix '~/static/js' || true
else 
  echo "No build dir"
fi
echo "Finalizing release"
yarn run sentry-cli releases finalize ${REACT_APP_SENTRY_RELEASE}

# delete sourcemaps
#echo "Deleting sourcemaps from netlify deploy"
#rm build/**/**/*.map
