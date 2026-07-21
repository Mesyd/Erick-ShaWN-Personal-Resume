param(
  [string]$ProjectRoot = (Resolve-Path ".").Path,
  [string]$OutputDir = "outputs/cloudflare-pages"
)

$ErrorActionPreference = "Stop"

$project = Resolve-Path $ProjectRoot
$distClient = Join-Path $project "dist/client"
$distServer = Join-Path $project "dist/server"
$output = Join-Path $project $OutputDir

if (!(Test-Path (Join-Path $distClient "assets"))) {
  throw "Missing dist/client assets. Run the Vinext build first."
}

if (!(Test-Path (Join-Path $distServer "index.js"))) {
  throw "Missing dist/server/index.js. Run the Vinext build first."
}

if (Test-Path $output) {
  Remove-Item -LiteralPath $output -Recurse -Force
}

New-Item -ItemType Directory -Path $output -Force | Out-Null

Copy-Item -Path (Join-Path $distClient "*") -Destination $output -Recurse -Force

Copy-Item -Path (Join-Path $distServer "index.js") -Destination (Join-Path $output "_worker.js") -Force
Copy-Item -Path (Join-Path $distServer "__vite_rsc_assets_manifest.js") -Destination (Join-Path $output "__vite_rsc_assets_manifest.js") -Force
Copy-Item -Path (Join-Path $distServer "vinext-server.json") -Destination (Join-Path $output "vinext-server.json") -Force
Copy-Item -Path (Join-Path $distServer "vinext-externals.json") -Destination (Join-Path $output "vinext-externals.json") -Force
Copy-Item -Path (Join-Path $distServer "image-config.json") -Destination (Join-Path $output "image-config.json") -Force
Copy-Item -Path (Join-Path $distServer "ssr") -Destination (Join-Path $output "ssr") -Recurse -Force

$headers = Join-Path $output "_headers"
if (!(Test-Path $headers)) {
  New-Item -ItemType File -Path $headers -Force | Out-Null
}

Write-Host "Cloudflare Pages output prepared at: $output"
Write-Host "Deploy with: wrangler pages deploy `"$output`" --project-name <your-pages-project>"
