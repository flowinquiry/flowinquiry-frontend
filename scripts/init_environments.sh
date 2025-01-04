#!/bin/bash

# Define file paths
output_file=".env.local"
backup_file=".env.local.backup"

# Check if the output file already exists
if [ -f "$output_file" ]; then
    # Ask for confirmation to overwrite the file
    read -p "$output_file already exists. Do you want to replace it? (y/n): " confirm
    if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
        echo "Aborting. $output_file will not be replaced."
        exit 0
    fi

    # Backup the existing file
    echo "Backing up $output_file to $backup_file..."
    cp "$output_file" "$backup_file"
fi

# Create an empty file
echo "Creating an empty $output_file..."
> "$output_file" # Use > to truncate and create an empty file

# Prompt user for backend server URL (with optional port)
while true; do
    read -p "Enter the FlowInquiry back-end server URL address (e.g., http://localhost or http://localhost:8080). This is the server hosting the FlowInquiry back-end services: " backend_server
    if [[ $backend_server =~ ^http(s)?://[a-zA-Z0-9.-]+(:[0-9]{1,5})?$ ]]; then
        break
    else
        echo "Invalid input. Please enter a valid URL (e.g., http://localhost or http://localhost:8080)."
    fi
done

# Append to the .env.local file
cat <<EOL >> "$output_file"
NEXT_PUBLIC_BASE_URL="$backend_server"
BACK_END_URL="$backend_server"
EOL


# Run npx auth and append its output to .env
npx auth secret >> "$output_file"

# Check if the npx auth command succeeded
if [ $? -ne 0 ]; then
    echo "Failed to run npx auth. Exiting."
    exit 1
else
    echo "Appended output of npx auth to $output_file."
fi

echo "Initialization complete."