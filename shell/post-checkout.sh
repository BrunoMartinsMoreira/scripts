#!/bin/bash

  if [ -d "node_modules" ]; then
    echo "Removing existing node_modules..."
    rm -rf node_modules
  fi

  echo "Running npm install to synchronize dependencies..."
  npm install

  echo "Building internal packages..."
  npm run rebuild

  echo "Dependencies and packages are up to date."

exit 0