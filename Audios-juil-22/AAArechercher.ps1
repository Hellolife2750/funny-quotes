# V�rifie si l'argument de recherche est sp�cifi�
if ($args.Count -eq 0) {
    Write-Host "Veuillez sp�cifier un terme de recherche."
    exit
}

# Terme de recherche pass� en argument
$searchTerm = $args[0]

# R�cup�re le chemin du dossier courant
$sourceFolder = (Get-Location).Path

# Chemin du dossier de r�sultat
$resultFolder = Join-Path $sourceFolder "result"

# Supprime les fichiers existants dans le dossier de r�sultat
if (Test-Path -Path $resultFolder -PathType Container) {
    Remove-Item -Path "$resultFolder\*" -Force
}

# V�rifie si le dossier de r�sultat n'existe pas, le cr�e
if (-not (Test-Path -Path $resultFolder -PathType Container)) {
    New-Item -Path $resultFolder -ItemType Directory | Out-Null
}

# Copie les fichiers correspondant au terme de recherche dans le dossier de r�sultat
Get-ChildItem -Path $sourceFolder -Filter "*.ogg" | ForEach-Object {
    $fileNameWithoutExtension = [System.IO.Path]::GetFileNameWithoutExtension($_.Name)
    if ($fileNameWithoutExtension -match $searchTerm) {
        Copy-Item -Path $_.FullName -Destination $resultFolder -Force
        Write-Host "Copi� : $($_.Name)"
    }
}

Write-Host "Termin�."
