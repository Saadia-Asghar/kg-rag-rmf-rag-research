param([string]$Python = 'python', [int]$Port = 8766)
$ErrorActionPreference = 'Stop'
Push-Location $PSScriptRoot
try {
    & $Python -X utf8 -u research/scripts/local_query_app.py --port $Port
    if ($LASTEXITCODE -ne 0) { throw "Query app exited with code $LASTEXITCODE" }
} finally {
    Pop-Location
}
