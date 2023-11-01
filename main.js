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
  <audio src="${audioPath + audioFile}" controls></audio>
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
const audioFiles = ["15h par jour.ogg","2 salles 2 ambiances.ogg","a lot of.ogg","ah c'est ici.ogg","ah d'accord.ogg","ah je suis trop fort.ogg","ah malaisant-cringe.ogg","ah ouais bonne nouvelle.ogg","ah ouais là c'est bien.ogg","ah ouais.ogg","ahah nice.ogg","ahahah.ogg","ahlala.ogg","allez vous faire enculer.ogg","alléluia.ogg","alright j'ai assez glande.ogg","alright les boys.ogg","although.ogg","and his neck is unable to move.ogg","arrête de m'énerver.ogg","arrête tes conneries je fais attention tu te sens bien toi.ogg","arrête.ogg","aspirateur à femmes.ogg","attendez une seconde.ogg","avec la quéquette je fais les pompes.ogg","avouez que la life est belle.ogg","bad boy2.ogg","bhe non c'est pas obligatoire alors.ogg","bhe non.ogg","bhe ouais logique.ogg","bite entre la main.ogg","bordel je me tourne.ogg","brained.ogg","branlette.ogg","but we ain't talking to that right now.ogg","c'est allé très loin cette histoire.ogg","c'est amusant de faire sa toilette.ogg","c'est ben nice.ogg","c'est bien beau.ogg","c'est chelou.ogg","c'est claqué c'est éclaté de ouf.ogg","c'est dans la vraie vie que ça se passe.ogg","c'est de la daube-merde.ogg","c'est de la merde ou j'ai un problème.ogg","c'est de la merde à l'état pur.ogg","c'est de la merde.ogg","c'est des raisonnements à la con.ogg","c'est direct et cash.ogg","c'est encore plus drôle car ya le patron.ogg","c'est fait pour s'essuyer son cul pas sa bite.ogg","c'est génial hein.ogg","c'est honteux.ogg","c'est important mon cul.ogg","c'est impressionant.ogg","c'est inadmissible.ogg","c'est la devise.ogg","c'est le 93 qui ressort.ogg","c'est le délire.ogg","c'est mon père qui a fait ça avec sa bite.ogg","c'est pareil pour moi.ogg","c'est parfait ça.ogg","c'est pas bien ça.ogg","c'est pas carré carré quoi toi tu préfères quand c'est carré carré quoi.ogg","c'est pas fini.ogg","c'est pas logique.ogg","c'est pas normal.ogg","c'est pas un vrai travail.ogg","c'est pas évident.ogg","c'est qu'un facebook.ogg","c'est qu'à force de leur lécher la bite .ogg","c'est quoi ce bordel.ogg","c'est ridicule.ogg","c'est se moquer du monde.ogg","c'est surement ce qu'il s'est passe.ogg","c'est trop.ogg","c'est un perfect.ogg","c'est un truc de fou.ogg","c'est une arme de guerre connard.ogg","c'est une blague ou quoi.ogg","c'est une vieille pute.ogg","c'est vraiment très sale.ogg","c'est à peu près ce que j'en pense.ogg","c'est ça qui est ça.ogg","c'est-à-dire.ogg","c'était avant.ogg","c'était avec des copains.ogg","c'était pas aussi fou que ça.ogg","c'était pour te dire va te faire enculer.ogg","c'était sûr en fait.ogg","c'était une bombe atomique.ogg","calm down.ogg","carrément.ogg","ce que tu dis n'a auncun sens.ogg","ce que tu m'as fait vivre là c'est la mer à boire.ogg","ce qui est grave.ogg","certains vices.ogg","cette phrase vaut son pesant de cacahuètes.ogg","chasser une femme seul.ogg","clignotant.ogg","comme ça suffisait pas c'est reparti pour un tour.ogg","complètement abusé.ogg","complètement merdique.ogg","conduire sans assurance.ogg","connard tête de bite.ogg","connard.ogg","cris de frayeur.ogg","dans son oeil.ogg","de toute façon tu vas pas me faire chier.ogg","dis pas nawak.ogg","don't fuck with me.ogg","don't have all day.ogg","donc c'est plutôt pas dégueulasse.ogg","doubler.ogg","du genre.ogg","dégage je te pine tes morts.ogg","délirer du prépuce.ogg","eh bin si.ogg","eh c'est le remède.ogg","eh ouais frère.ogg","Eh oui 1.ogg","Eh oui 2.ogg","Eh oui 3.ogg","eh vous voulez.ogg","elle est bonne.ogg","elle est très bien.ogg","elle m'a fait jouir.ogg","elle va se régaler.ogg","elle vous fait un honneur.ogg","elles kiffent ça.ogg","en avait plein le cul.ogg","en effet 2.ogg","en effet.ogg","en gros c'est ça ouais.ogg","encore en train de se branler les puceaux.ogg","enculé va.ogg","enfin ça c'est une autre histoire.ogg","environ 50 80 90 50.ogg","est complètement baisé.ogg","est n'est pas belle l'histoire.ogg","est-ce que c'est bon pour vous.ogg","est-ce que c'est bon pour vous2.ogg","et alors.ogg","et c'était pas banal.ogg","et tout et tout et tout.ogg","et tu te tues toi.ogg","et ça recommence.ogg","evidemment voyons donc.ogg","excuse-moi.ogg","excusez moi.ogg","exité par papa teub.ogg","fais attention à toi.ogg","fais moi une pipe.ogg","faut que j'aille chier.ogg","fdp ta mère je la baise.ogg","feux rouges.ogg","finalement on a compris que le mec était un peu mogolien.ogg","flemmards de ricains.ogg","fracassés on était il nous a tués.ogg","franchement les mecs vous êtes des gros crados quoi.ogg","fuck misses.ogg","fuck really.ogg","fuck that means.ogg","fuck you goddamn asshole.ogg","fuck you.ogg","fucking gamer.ogg","fucking my girl is wrong.ogg","fucking pc.ogg","fucking stupid game.ogg","fucking twat.ogg","gg bouboule.ogg","go fuck yourself.ogg","goinfrer comme des porcs.ogg","grave belle frappe atomique.ogg","grillé de quoi.ogg","gros mytho que je suis.ogg","halluciner du prépuce.ogg","han ouais.ogg","he is fucking dangerous.ogg","hein oh oh oh oh.ogg","hin hin hin hin.ogg","holy god jesus.ogg","holy god what the hell.ogg","i just wanna play.ogg","i know there ain't no rules but this gotta be some kind of crime.ogg","i speak wery well english.ogg","il est en train de me prendre la tête.ogg","il est tellement cute.ogg","il faut en profiter tant qu'on est jeunes.ogg","il faut te calmer.ogg","il faut tourner la page.ogg","il le plombe l'insulte l'encule.ogg","il n'y a pas de problème là dessus.ogg","il s'en bat les couilles de ma couille.ogg","il s'est mis bien lui.ogg","il se fait baiser ya 2 jours.ogg","il y avait de quoi à la limite.ogg","ils vous en faut peu.ogg","im bout to fuck this meth man.ogg","impossiblou.ogg","in roblox in real life with fucking strange voice.ogg","indian tutorial.ogg","it doesn't make any sense.ogg","it works.ogg","j'ai aucun problème avec l'alcool.ogg","j'ai capté je vois.ogg","j'ai cru que j'allais péter une durite j'étais au bord d'exploser là.ogg","j'ai de l'essence dans la bagnole.ogg","j'ai envie de baiser.ogg","j'ai envie de péter un cable tout de suite maintenant.ogg","j'ai l'impression qu'on va s'enculer.ogg","j'ai le cul qui baille.ogg","j'ai mal aux couilles.ogg","j'ai pas trop le choix.ogg","j'ai trop les nefs.ogg","j'ai une surprise.ogg","j'ai été très déçu.ogg","j'aime et je défonce les grosses chiennes.ogg","j'aime pas les enfants qui se disputent.ogg","j'aime te défoncer.ogg","j'avais de la merde sur le teub.ogg","j'avais vraiment du mal.ogg","j'en ai jamais nické.ogg","j'en ai marre que tu te comportes comme une baltringue.ogg","j'en ai plein le cul de ce jeu.ogg","j'en ai plein le cul.ogg","j'en ai ras la bite.ogg","j'en aurai des nouvelles.ogg","j'en mettrais presque ma bite à couper.ogg","j'en peux plus.ogg","j'espère que vous avez compris.ogg","j'espère que vous êtes contents.ogg","j'étais dernier quel honneur.ogg","j'étais raide.ogg","je comprends rien.ogg","je comprends.ogg","je cours aux chiottes.ogg","je crois qu'il a peur.ogg","je devrai nettoyer.ogg","je devrais les tuer.ogg","je dis bien fait pour sa gueule.ogg","je fais tout pour qu'il ait du bien.ogg","je joue de la musique avec mon pipo.ogg","je le marbre je luis mets un tampon pas 2 je lui fais avaler toutes ses chicots.ogg","je lui dis frère oh rajoute-en.ogg","je lui mets un tampon pas deux.ogg","je m'en bats les couilles que je fais n'importe quoi.ogg","je m'en vais bye bye.ogg","je me fais chier féroce.ogg","je me faisais du bien.ogg","je me régalais.ogg","je me suis fait avoir.ogg","je me suis fait gg.ogg","je me suis pas réveillé un beau jour.ogg","je me touche les tétons.ogg","je ne l'avais pas vu.ogg","je ne la supporte plus.ogg","je ne savais pas que.ogg","je ne trouve juste rien.ogg","je ne veux pas faire bruler.ogg","je passe pour un gland.ogg","je pense pas non.ogg","je pense qu'ils vont l'envoyer chier.ogg","je poigné une flèche dans la gueule.ogg","je préfère travailler qu'aller en prison.ogg","je racle le poteau.ogg","je sais même pas d'où il sort c'est ça le problème.ogg","je sais.ogg","je saute dessus.ogg","je suis bien gentil.ogg","je suis choqué les gars sans déconner.ogg","je suis con.ogg","je suis dans la merde.ogg","je suis malade je sui en trans.ogg","je suis pas au courant.ogg","je suis quoi.ogg","je suis un boss.ogg","je suis un dinosaure.ogg","je t'ai enculé.ogg","je te nicke ta race moi.ogg","je te sers la main à la ricaine bonjour.ogg","je travaille pas je fais rien je me branle les couilles.ogg","je vais chier.ogg","je vais faire une crise cardiaque.ogg","je vais jouir.ogg","je vais pas y aller.ogg","je vais vous fair un discours avec un micro.ogg","je vais y aller franco.ogg","je veux baiser.ogg","je veux faire top1 fortnite profesionnellement parlant.ogg","je viens pour te parler.ogg","je voulais être plus vieux.ogg","je vous défonce quand vous voulez.ogg","just in case.ogg","kings bow to gods.ogg","l'ennemi de mon ami.ogg","la carburation injection de tes morts.ogg","la meuf sert à rien.ogg","la preuve en images.ogg","la seringue qui déglingue.ogg","la strangulation.ogg","la vie est belle.ogg","le pauvre chawrzenneger.ogg","le plus tôt ça sera le mieux.ogg","logique pas une pipe.ogg","look how unaffected he was by a kick in the stomach.ogg","là il vient de pisser sur le ring théoriquement on est exclus.ogg","lâchez moi le prépuce.ogg","magnifique t'es le mec le plus sale que j'aie rencontré jusqu'à présent.ogg","mainant karma.ogg","mais c'est de la merde.ogg","mais c'est pas garanti.ogg","mais t'es fou.ogg","mais tout à fait ya pas de problème.ogg","mais vous le savez je m'en branle.ogg","mal se garer.ogg","malheureusement j'en ai attrapée qu'une.ogg","me raser la méduse.ogg","merci poto.ogg","merde (pleure).ogg","merde.ogg","mettez vous à 4 pattes.ogg","mettre en pls les sous-doués.ogg","mon boule est bien galbé.ogg","mon doux jesus.ogg","my bad my bad my bad.ogg","my bad.ogg","my boy... my dude.ogg","my dude.ogg","my troat dry as motherfucker.ogg","nan.ogg","naughty boy.ogg","no wait oh brother.ogg","Nom de dieu de putain de bordel de merde de saloperie de connard denculé de ta mère.ogg","non c'est pas vrai.ogg","non pas du tout.ogg","non.ogg","not fucking nice.ogg","obama say fuck you.ogg","obamacfuck you goddamn assholes.ogg","officer.ogg","oh boy yo les potos.ogg","oh le dégradé dégradant.ogg","oh my god.ogg","oh my lord.ogg","oh putain QI de 143.ogg","oh yeah daddy.ogg","ohlala mon seigneur.ogg","on a envie de se faire défoncer.ogg","on commence le travail on le termine.ogg","on dirait un guignole.ogg","on dirait un scato.ogg","on est pas en maternelle.ogg","on l'avait mis dans la bagnole ouais.ogg","on m'a coupé au nez.ogg","on m'appelle OVNI.ogg","on n'est pas chez toi ici.ogg","on s'en bat les couilles 2.ogg","on s'en bat les couilles.ogg","on s'en bat les glaouis.ogg","on sait jamais.ogg","on se retire les doigts.ogg","on va jouer les bonhommes.ogg","on va te plier en 2.ogg","ouais nickel.ogg","ouais ouais tu te fous te ma gueule ou quoi toi.ogg","ouais super.ogg","oui allez oh dégage c'est bon.ogg","panique à bord hallucinant.ogg","panique à bord.ogg","pas de problemo amigo.ogg","pas faire durer intéraction.ogg","pas très bien mais c'est pas mal.ogg","pauvre con va.ogg","permis de conduire et de séduire.ogg","peut-être il n'était pas loin de la sodomie.ogg","piler.ogg","plus d'agriculture.ogg","poor deluded chris.ogg","pose ton gun même.ogg","pour une fois t'as pas dit des conneries.ogg","pour vous faire chier.ogg","prends tes affaires et casse toi si t'en as rien à foutre.ogg","promis garanti.ogg","psartek.ogg","push pop slice.ogg","putain mais tu blagues pas hein.ogg","putain que ça m'énerve.ogg","putain.ogg","qu'est ce que tu branles.ogg","qu'est ce que tu me racontes là .ogg","qu'est ce que tu vas faire.ogg","qu'est ce que tu veux de plus.ogg","qu'est ce que tu veux.ogg","qu'est ce qui est jaune et qui attend.ogg","qu'est-ce qu'elle a à gueuler.ogg","qu'est-ce que t'as encore fait gros dégueulasse.ogg","quand est-ce que la dernière fois qu'on t'a défoncée.ogg","quel plaisir.ogg","quelque chose de jouissif.ogg","qui déchire tous les prépuces.ogg","quoi c'était marrant.ogg","quoi d'enfiler.ogg","quoi.ogg","rah my boy.ogg","randonnée chaussure tu racontes.ogg","rechauffement climatique.ogg","relativiser.ogg","rien de concret à part du foutage de gueule.ogg","rien ne va dans ce monde de merde.ogg","rigolo va.ogg","rire cringe-malaisant2.ogg","rire cringe3.ogg","rire cringe4.ogg","rire idiot.ogg","rire machiavelique.ogg","rire malaisant 2.ogg","rire malaisant 3.ogg","rire malaisant 4.ogg","réfléchissez bien.ogg","s'il vous plait.ogg","saperlipopette d'enculé de merde.ogg","say fuck you twat.ogg","se branler c'est important.ogg","sens interdit.ogg","si j'ai beaucoup de change on trouvera un dent plantée dans le bitume.ogg","si tu veux je te suce.ogg","si tu veux.ogg","si-non.ogg","sois moins ghetto.ogg","sois raisonnable.ogg","sois un peu moins ghetto.ogg","soleil carbonisé neurones.ogg","stranger stranger.ogg","stranger what you need that for.ogg","sucer c'est très facile.ogg","sur wish c'était mieux foutu que votre merdier.ogg","système bluetooth.ogg","t'as compris.ogg","t'as cru que c'était la route à ta mère ya un problème.ogg","t'as dead ça.ogg","t'as pas les épaules t'as rien dans le slip dégage.ogg","t'as une sale gueule.ogg","t'es gâté.ogg","t'es puni.ogg","t'es sérieux là.ogg","t'es un grand malade.ogg","t'es un queutar.ogg","that was so easy to do.ogg","this fat son of bitch he's fat.ogg","this is the end of me.ogg","ths is not good.ogg","tiktok petite note.ogg","toi je t'aime bien.ogg","toujours gaie nounours.ogg","tout le monde est tiguidou.ogg","tout ça c'est de la daube de la merde.ogg","tu commences pas à me choper par le colback.ogg","tu cours un danger.ogg","tu crois que ça me fait rire.ogg","tu es content.ogg","tu fais quoi là.ogg","tu m'as pris pour ta pute ou quoi.ogg","tu me déconcentres.ogg","tu me gaves.ogg","tu nous prends pour des blaireaux.ogg","tu peux pas mettre une nuisette au lieu de ton kimono de guerre.ogg","tu refais ça je te marbre la gueule.ogg","tu sais plus puisque eux ne savent pas.ogg","tu te fiches de moi.ogg","tu te fous de sa gueule.ogg","tu te tires une balle dans le pied.ogg","tu veux pas ferme ta gueule.ogg","tu veux que j'appelle la police.ogg","tu vois pas le temps qu'on a mis.ogg","tutti quanti.ogg","tête de bite je vais descendre et t'enculer.ogg","u got nothin to lose but your teeth.ogg","un cycle vicieux pas vraiment vicieux.ogg","une autre délirante.ogg","une débilité sans pareil.ogg","viens chercher ta merde.ogg","vilain nounours.ogg","voilà elle s'énerve c'est ça qui m'agace.ogg","voilà je suis prêt.ogg","voilà.ogg","vous allez adorer.ogg","vous avez tout compris.ogg","vous avez vu la-bas.ogg","vous croyez que c'est normal.ogg","vous ferez attention à éteindre vos caméras.ogg","vous imaginez le délire.ogg","vous m'entendez.ogg","vous n'etes pas serieux oh oh oh.ogg","vous êtes prêts allez y.ogg","vous êtes une bande de branleurs.ogg","voyons donc.ogg","vu qu'il a un QI de poule voire de blaireau.ogg","watch that bluber fly.ogg","what did you do.ogg","what the hell.ogg","windows.ogg","wise choice mate.ogg","wow wo wo wo.ogg","wtf je ne comprends pas.ogg","ya pas de petrole.ogg","ya pas le choix.ogg","ya quelqu'un qui veut ma peau.ogg","ya tout ce qu'il faut.ogg","yabebe voilà.ogg","Yamete Kudasai.ogg","yolo we never know brothers.ogg","you are fucked.ogg","you shouldn't fucked with me.ogg","you're fucking piece of absolute shit mate.ogg","à tirelarigot.ogg","ça a pas l'air apétissant c'est de la merde.ogg","ça c'est déconner.ogg","ça c'est mystique.ogg","ça c'est un moulage de ma bite.ogg","ça commence à bien faire.ogg","ça déchire grave.ogg","ça fait 6 ans que j'ai pas eu d'occasion.ogg","ça fait extrêmement plaisir.ogg","ça fait longtemps.ogg","ça fait mal.ogg","ça fait peur on va pas se le cacher.ogg","ça fait plaisir c'est toujours ça.ogg","ça fait un vacarne.ogg","ça j'ai envie de te dire mon frère ça fait plaisir.ogg","ça l'avait étonnée.ogg","ça lui avait fait plaisir.ogg","ça marche bien.ogg","ça me casse les couilles quand même.ogg","ça me casse pas mal les couilles.ogg","ça me fait bander.ogg","ça me fait jouir.ogg","ça me met les nerfs.ogg","ça me pique au bout de la flûte.ogg","ça me rend fou.ogg","ça ne laisse pas indifférent.ogg","ça ne parait pas hein.ogg","ça peut couler dessus.ogg","ça peut être très gênant.ogg","ça pousse.ogg","ça sert à rien que j'aille en cours.ogg","ça suffit.ogg","ça va faire du bruit.ogg","ça va mal mon affaire.ogg","ça va péter.ogg","ça vaut le détour.ogg","ça vous donne un poussée dans le sens de la marche.ogg","écoute ce qu'on va faire oh oui.ogg","écraser les piétons.ogg",];
