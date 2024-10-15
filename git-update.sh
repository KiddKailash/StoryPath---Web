#!/bin/bash

# Check the status of the repository
echo "Checking the status of the repository..."
git status

# Add all changes to the staging area
echo "Adding changes to the staging area..."
git add .

# Ask the user for a commit message
echo "Enter a commit message: "
read commit_message

# Commit the changes
echo "Committing changes with message: '$commit_message'"
git commit -m "$commit_message"

# Push changes to the main branch
echo "Pushing changes to GitHub..."
git push origin main

# Pull in any remote changes from GitHub (optional step if needed)
echo "Pulling latest changes from GitHub..."
git pull origin main

# Confirm successful execution
echo "Git repository updated successfully!"
