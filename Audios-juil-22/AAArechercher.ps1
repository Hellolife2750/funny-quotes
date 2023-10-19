# Vérifie si l'argument de recherche est spécifié
if ($args.Count -eq 0) {
    Write-Host "Veuillez spécifier un terme de recherche."
    exit
}

# Terme de recherche passé en argument
$searchTerm = $args[0]

# Récupère le chemin du dossier courant
$sourceFolder = (Get-Location).Path

# Chemin du dossier de résultat
$resultFolder = Join-Path $sourceFolder "result"

# Supprime les fichiers existants dans le dossier de résultat
if (Test-Path -Path $resultFolder -PathType Container) {
    Remove-Item -Path "$resultFolder\*" -Force
}

# Vérifie si le dossier de résultat n'existe pas, le crée
if (-not (Test-Path -Path $resultFolder -PathType Container)) {
    New-Item -Path $resultFolder -ItemType Directory | Out-Null
}

# Copie les fichiers correspondant au terme de recherche dans le dossier de résultat
Get-ChildItem -Path $sourceFolder -Filter "*.ogg" | ForEach-Object {
    $fileNameWithoutExtension = [System.IO.Path]::GetFileNameWithoutExtension($_.Name)
    if ($fileNameWithoutExtension -match $searchTerm) {
        Copy-Item -Path $_.FullName -Destination $resultFolder -Force
        Write-Host "Copié : $($_.Name)"
    }
}

Write-Host "Terminé."
