// =====================================================================
//  RÉGLAGES DE L'ÉCRAN DE CHARGEMENT — modifie seulement ce fichier
// =====================================================================
var CONFIG = {
    // Nom affiché en grand. Laisse "" pour utiliser le nom du serveur envoyé par GMod.
    nomServeur: "Pryst Demon Slayer",

    // Nom affiché pour chaque map (sinon le nom technique est affiché tel quel)
    nomsMaps: {
        "rp_kido_ds5": "rp_kido_ds5"
    },

    // Sous-titre sous le nom
    sousTitre: "Pourfendeurs ⚔ Démons",

    // Musique : mets un fichier "music.mp3" (ou .ogg) dans ce dossier. "" = pas de musique.
    musique: "music.mp3",
    volumeMax: 0.5,            // multiplié par le volume du jeu (0 à 1)

    // Temps entre deux astuces (secondes)
    dureeAstuce: 7,

    // Astuces affichées pendant le chargement
    astuces: [
        "Défie un autre joueur en <b>duel</b> pour prouver ta valeur et remporter une récompense.",
        "Forme une <b>escouade</b> avec tes compagnons pour partir en mission ensemble.",
        "Un poison reste actif jusqu'à ce qu'il soit soigné : garde toujours un <b>antipoison</b> sur toi.",
        "Enduis ta lame d'une potion pour empoisonner, affaiblir ou paralyser tes adversaires.",
        "L'<b>encens anti-confusion</b> protège aussi les alliés autour de toi.",
        "Dépose ton argent à la <b>banque</b> : il y est en sécurité.",
        "Rejoins un <b>clan</b> pour combattre aux côtés de tes alliés.",
        "Les démons craignent le <b>soleil</b>. Les pourfendeurs, eux, chassent la nuit.",
        "Capture des <b>territoires</b> pour faire gagner ta faction.",
        "Respecte le règlement et le roleplay des autres joueurs."
    ],

    // Textes affichés selon l'étape du chargement (GMod envoie le texte en anglais)
    statuts: {
        "retrieving server info": "Récupération des informations du serveur…",
        "mounting addons": "Montage des addons…",
        "workshop": "Téléchargement du Workshop…",
        "downloading": "Téléchargement des fichiers…",
        "sending client info": "Envoi des informations…",
        "client info sent": "Informations envoyées",
        "lua": "Chargement des scripts…",
        "starting lua": "Démarrage des scripts…",
        "precaching": "Préparation des ressources…",
        "parsing game info": "Lecture des informations…",
        "loading": "Chargement de la map…"
    }
};
