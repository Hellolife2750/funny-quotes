// Obtenez une référence à l'élément d'entrée de recherche
const searchInput = document.getElementById("search-input");

// Obtenez une référence à l'élément du tableau des résultats
const resultsTable = document
  .getElementById("results-table")
  .getElementsByTagName("tbody")[0];

// Noms des fichiers .ogg dans votre dossier (exemple)
const audioFiles = [
  "audio1.ogg",
  "audio2.ogg",
  "audio3.ogg",
  "audio4.ogg",
  "audio5.ogg",
];

// Fonction pour mettre à jour les résultats en fonction de la recherche
function updateResults() {
  const searchTerm = searchInput.value.toLowerCase();

  // Effacez les résultats précédents
  resultsTable.innerHTML = "";

  // Filtrer les noms de fichiers correspondants au terme de recherche
  const matchingFiles = audioFiles.filter((fileName) =>
    fileName.toLowerCase().includes(searchTerm)
  );

  // Ajoutez les noms correspondants au tableau des résultats
  matchingFiles.forEach((fileName) => {
    const row = resultsTable.insertRow();
    const cell = row.insertCell(0);
    cell.textContent = fileName;
  });
}

// Écoutez les changements dans le champ de recherche
searchInput.addEventListener("input", updateResults);

// Appelez updateResults() une première fois pour gérer le contenu initial
updateResults();
