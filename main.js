/*const audiosContainer = document.getElementById('audios-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const audioPath = 'Audios-juil-22/'; // Chemin vers le dossier des fichiers audio

searchBtn.addEventListener('click', refreshAudios);

function refreshAudios() {
  const searchValue = searchInput.value.toLowerCase(); // Convertir la recherche en minuscules

  // Réinitialiser le conteneur d'audios
  audiosContainer.innerHTML = '';

  // Faire une requête AJAX pour obtenir la liste des fichiers audio
  fetch('Audios-juil-22/') // Remplacez cette URL par l'URL réelle de votre serveur
    .then(response => response.json())
    .then(audioFiles => {
      // Parcourir les fichiers audio dans la liste
      audioFiles.forEach(audioFile => {
        const audioFileName = audioFile.toLowerCase(); // Convertir le nom du fichier en minuscules

        // Vérifier si le nom du fichier audio contient le terme de recherche
        if (audioFileName.includes(searchValue)) {
          // Créer un élément audio pour chaque fichier audio correspondant
          const audioElement = document.createElement('audio');
          audioElement.controls = true;
          audioElement.src = audioPath + audioFile;

          // Ajouter l'élément audio au conteneur d'audios
          audiosContainer.appendChild(audioElement);
        }
      });
    });
  
}*/

import { audioFiles } from './Audios-juil-22/audiosNames.js';

const audiosContainer = document.getElementById('audios-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const audioPath = 'Audios-juil-22/'; // Chemin vers le dossier des fichiers audio
var audios;

searchBtn.addEventListener('click', refreshAudios);

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    refreshAudios();
  }
});

// Fonction pour supprimer les accents d'une chaîne de caractères
function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function refreshAudios() {
  const searchValue = removeAccents(searchInput.value.toLowerCase()); // Convertir la recherche en minuscules

  // Réinitialiser le conteneur d'audios
  audiosContainer.innerHTML = '';


  let nbResultats = 0;

  // Parcourir les fichiers audio dans le dossier /audios
  for (const audioFile of audioFiles) {
    const audioFileName = removeAccents(audioFile.toLowerCase()); // Convertir le nom du fichier en minuscules

    // Vérifier si le nom du fichier audio contient le terme de recherche
    if (audioFileName.includes(searchValue)) {
      nbResultats++;
      audiosContainer.insertAdjacentHTML('beforeend', `
      <figure class="single-audio-container">
  <figcaption class="audio-tag">${audioFile}</figcaption>
  <audio src="${audioPath + audioFile + '.ogg'}" controls></audio>
</figure>
      `);

    }
  }
  audiosContainer.insertAdjacentHTML('afterbegin', `<p class="res-nb">Résultats correspondants ${nbResultats}</p>`);
  reloadAudiosInDOM();
}

//un audio se lit ) la fois
function reloadAudiosInDOM() {
  // Récupérez tous les éléments audio
  const audios = document.querySelectorAll('.single-audio-container');

  audios.forEach(audioContainer => {
    const audio = audioContainer.querySelector('audio');
    const audioTag = audioContainer.querySelector('.audio-tag');

    audio.addEventListener('play', function (event) {
      // Lorsqu'un audio commence à jouer, ajoutez la classe "active" à son audio-tag
      audioTag.classList.add("active");

      // Lorsqu'un audio commence à jouer, vérifiez si d'autres sont en cours de lecture
      audios.forEach(otherAudioContainer => {
        if (otherAudioContainer !== audioContainer) {
          const otherAudioTag = otherAudioContainer.querySelector('.audio-tag');
          otherAudioTag.classList.remove("active");
          const otherAudio = otherAudioContainer.querySelector('audio');
          otherAudio.pause(); // Mettez en pause les autres audios
        }
      });
    });
  });

}

// Assurez-vous d'inclure la bibliothèque JSZip dans votre projet

document.getElementById('dl-all-btn').addEventListener('click', function () {
  // Créez une nouvelle instance de JSZip
  const zip = new JSZip();

  // Parcourez les fichiers audio et ajoutez-les au fichier ZIP
  audioFiles.forEach(audioFile => {
    // Récupérez le chemin complet du fichier audio
    const audioFilePath = audioPath + audioFile;

    // Ajoutez le fichier audio au ZIP en utilisant le nom du fichier comme clé
    zip.file(audioFile, fetch(audioFilePath).then(response => response.blob()));
  });

  // Génère le fichier ZIP
  zip.generateAsync({ type: 'blob' }).then(function (content) {
    // Créez un objet URL à partir du contenu du ZIP
    const zipBlobURL = URL.createObjectURL(content);

    // Créez un lien de téléchargement
    const a = document.createElement('a');
    a.href = zipBlobURL;
    a.download = 'audios.zip'; // Nom du fichier ZIP
    a.style.display = 'none';

    // Ajoutez le lien au document
    document.body.appendChild(a);

    // Cliquez sur le lien pour déclencher le téléchargement
    a.click();

    // Supprimez le lien du document
    document.body.removeChild(a);
  });
});

const readAllBtn = document.getElementById('read-all-btn');
let isReading = false; // Variable pour suivre l'état de la lecture automatique

readAllBtn.addEventListener('click', () => {
  const audios = document.querySelectorAll('.single-audio-container audio');

  if (!isReading) {
    isReading = true;
    readAllBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';

    // Fonction pour jouer les audios en séquence
    function playAudiosSequentially(index) {
      if (index < audios.length && isReading) {
        // Arrêtez tous les autres audios en cours de lecture
        audios.forEach((audio, i) => {
          if (i !== index) {
            audio.pause();
          }
        });

        // Jouez l'audio en cours
        audios[index].play();

        // Faites défiler l'élément audio en cours de lecture au centre de la vue
        audios[index].scrollIntoView({ behavior: 'smooth', block: 'center' });

        audios[index].addEventListener('ended', () => {
          playAudiosSequentially(index + 1);
        });
      } else {
        // Toute la lecture est terminée
        isReading = false;
        readAllBtn.innerHTML = '<i class="fa-solid fa-play"></i> Lire';
      }
    }


    // Commencez la lecture
    playAudiosSequentially(0);
  } else {
    // Arrêtez la lecture
    isReading = false;
    readAllBtn.innerHTML = '<i class="fa-solid fa-play"></i> Lire';
    audios.forEach(audio => audio.pause());
  }
});






// Simuler la liste des fichiers audio (remplacez cela par une vraie liste de noms de fichiers)
