#!/bin/bash

# Clean dist directory
rm -rf dist

# Build TypeScript
npm run build
if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi
# Copy package.json to dist
cp package.json dist/

# Install dependencies in dist
cd dist
npm install --production
cd ..

# Test running locally
node --experimental-specifier-resolution=node dist/index.js