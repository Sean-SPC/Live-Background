# Get all files in the 'music' folder
$files = Get-ChildItem -Path "..\music" -File

# Extract just the file names
$fileNames = $files | Select-Object -ExpandProperty Name

# Create a custom object with the "playlist" property to match your JS code
$data = @{
    "playlist" = $fileNames
}

# Convert to JSON and save to playlist.json
$data | ConvertTo-Json | Set-Content -Path "..\playlist.json" -Encoding UTF8

Write-Host "Successfully updated playlist.json!"
