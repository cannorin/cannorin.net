#!/bin/bash

SCRIPT_DIR=$(dirname "$0")

# Ensure that the working directory is the project root
cd $SCRIPT_DIR/../

# Read Terraform outputs and format it as .env
ENV_FILE_CONTENT=$(cd terraform && terraform output -json | jq -r "to_entries |map(\"\(.key)=\\\"\(.value.value)\\\"\")|.[]")

# Put .env files to each app directory
for d in apps/*/ ; do
  [ -L "${d%/}" ] && continue # Skip symlinks
  printf "$ENV_FILE_CONTENT" > $d/.env
  printf "$ENV_FILE_CONTENT" > $d/.dev.vars
done
