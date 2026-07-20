# Get all files in the 'media' folder
$files = Get-ChildItem -Path "..\media" -File

# Extract just the file names
$fileNames = $files | Select-Object -ExpandProperty Name

# Create a custom object with the "media" property to match your JS code
$data = @{
    "media" = $fileNames
}

# Convert to JSON and save to media.json
$data | ConvertTo-Json | Set-Content -Path "..\media.json" -Encoding UTF8

Write-Host "Successfully updated media.json!"
