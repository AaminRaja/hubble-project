param(
    [string]$BaseUrl = "https://hubble-project-lake.vercel.app"
)

$after = -1
$done = $false

while (-not $done) {
    $url = "$BaseUrl/api/scrape/exhibitors?after=$after"
    Write-Host "Fetching: $url"
    $response = Invoke-RestMethod -Method Post -Uri $url
    Write-Host ($response | ConvertTo-Json -Compress)

    $done = $response.done
    $after = $response.after
    Start-Sleep -Milliseconds 300
}

Write-Host "Scrape complete."