# Chemin du dossier courant
$folderPath = Get-Location

# Chemin du fichier de sortie
$outputFile = Join-Path $folderPath "audiosNames.js"

# Liste tous les fichiers .ogg dans le dossier courant et les formate comme un tableau JavaScript
$audioFiles = Get-ChildItem -Path $folderPath -Filter "*.ogg" | ForEach-Object { "`"$($_.BaseName)`"," }

# Écrit les noms des fichiers dans le fichier de sortie avec le préfixe et le suffixe du tableau JavaScript
$audioFiles = " export const audioFiles = [" + ($audioFiles -join '') + "];"
$audioFiles | Out-File -FilePath $outputFile -Encoding utf8

Write-Host "Fichiers audio listés dans audiosNames.txt sous forme de tableau JavaScript :"
Get-Content -Path $outputFile
