# Uso (desde la raiz del repo frontend):  ./deploy/publicar.ps1
$ErrorActionPreference = 'Stop'

npm run build
if ($LASTEXITCODE -ne 0) { throw 'Fallo npm run build' }

$destino = 'servidor/src/main/resources/static'
if (Test-Path $destino) { Remove-Item -Recurse -Force $destino }
New-Item -ItemType Directory -Force $destino | Out-Null
Copy-Item -Recurse -Force 'dist/*' $destino

Write-Host 'Listo. Ahora haz git add, git commit y git push.'