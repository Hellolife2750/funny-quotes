# Vérifie si l'argument de recherche est spécifié
if ($args.Count -eq 0) {
    Write-Host "Veuillez spécifier un terme de recherche."
    exit
}

# Récupère le chemin du dossier courant
$sourceFolder = (Get-Location).Path

# Terme de recherche passé en argument
$searchTerm = $args[0]

# Chemin du dossier de résultat
$resultFolder = Join-Path $sourceFolder "result"

# Vérifie si le dossier de résultat n'existe pas, le crée
if (-not (Test-Path -Path $resultFolder -PathType Container)) {
    New-Item -Path $resultFolder -ItemType Directory | Out-Null
}

# Copie les fichiers correspondant au terme de recherche dans le dossier de résultat
Get-ChildItem -Path $sourceFolder -Filter "*$searchTerm*.ogg" | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $resultFolder -Force
    Write-Host "Copié : $($_.Name)"
}

Write-Host "Terminé."
