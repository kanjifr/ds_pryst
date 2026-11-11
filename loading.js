// =====================================================================
//  Écran de chargement — logique (JavaScript ancien volontairement :
//  compatible avec le navigateur intégré de GMod, Awesomium comme Chromium)
// =====================================================================
(function () {
    var $ = function (id) { return document.getElementById(id); };

    // ---------- Mise à l'échelle de la scène (référence 1920 x 1080) ----------
    function ajuster() {
        var W = window.innerWidth, H = window.innerHeight;
        var s = W / 1920, w = 1920, h = H / s;
        if (h < 1080) { s = H / 1080; h = 1080; w = W / s; }
        var st = $("stage");
        st.style.width = w + "px";
        st.style.height = h + "px";
        st.style.webkitTransform = "scale(" + s + ")";
        st.style.transform = "scale(" + s + ")";
    }
    window.onresize = ajuster;
    ajuster();

    // ---------- Braises ----------
    var braises = $("embers");
    for (var i = 0; i < 45; i++) {
        var e = document.createElement("span");
        var taille = 3 + Math.random() * 7;
        var duree = 9 + Math.random() * 12;
        e.className = "ember";
        e.style.left = (Math.random() * 100) + "%";
        e.style.width = taille + "px";
        e.style.height = taille + "px";
        e.style.webkitAnimationDuration = duree + "s";
        e.style.animationDuration = duree + "s";
        e.style.webkitAnimationDelay = (-Math.random() * duree) + "s";
        e.style.animationDelay = (-Math.random() * duree) + "s";
        braises.appendChild(e);
    }

    // ---------- Textes de base ----------
    if (CONFIG.nomServeur) $("server-name").innerHTML = CONFIG.nomServeur;
    if (CONFIG.sousTitre) $("subtitle").innerHTML = CONFIG.sousTitre.replace("⚔", '<span class="sep">⚔</span>');

    function param(nom) {
        var m = new RegExp("[?&]" + nom + "=([^&]*)").exec(window.location.search);
        return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : "";
    }
    function nomMap(m) { return (CONFIG.nomsMaps && CONFIG.nomsMaps[m]) || m; }
    if (param("map")) $("map").innerHTML = nomMap(param("map"));

    // ---------- Astuces ----------
    var astuces = CONFIG.astuces || [];
    var indexAstuce = Math.floor(Math.random() * Math.max(1, astuces.length));
    var points = $("tip-dots");
    for (var a = 0; a < astuces.length; a++) points.appendChild(document.createElement("span"));

    function montrerAstuce() {
        if (!astuces.length) return;
        var t = $("tip-text");
        t.className = "hide";
        setTimeout(function () {
            t.innerHTML = astuces[indexAstuce];
            var p = points.getElementsByTagName("span");
            for (var k = 0; k < p.length; k++) p[k].className = (k === indexAstuce) ? "on" : "";
            t.className = "";
            indexAstuce = (indexAstuce + 1) % astuces.length;
        }, 600);
    }
    montrerAstuce();
    setInterval(montrerAstuce, (CONFIG.dureeAstuce || 7) * 1000);

    // ---------- Progression ----------
    var total = 0, restants = 0, affiche = 0;
    function majBarre(p) {
        p = Math.max(0, Math.min(1, p));
        if (p < affiche) return; // ne recule jamais
        affiche = p;
        $("gauge-fill").style.width = (p * 100) + "%";
        $("percent").innerHTML = Math.round(p * 100) + " %";
    }
    function majFichiers() {
        if (total > 0) majBarre((total - restants) / total);
    }

    function traduire(statut) {
        var s = (statut || "").toLowerCase();
        for (var cle in CONFIG.statuts) {
            if (CONFIG.statuts.hasOwnProperty(cle) && s.indexOf(cle) !== -1) return CONFIG.statuts[cle];
        }
        return statut;
    }

    // ---------- Musique ----------
    var musique = $("music");
    function lancerMusique(volume) {
        if (!CONFIG.musique || !musique) return;
        try {
            musique.src = CONFIG.musique;
            var cible = Math.max(0, Math.min(1, (volume === undefined ? 1 : volume) * (CONFIG.volumeMax || 0.2)));
            // montée douce du volume sur 3 s
            musique.volume = 0;
            var r = musique.play();
            // un navigateur normal bloque le son tant qu'on n'a pas cliqué (pas GMod)
            if (r && r["catch"]) r["catch"](function () {
                document.onclick = document.onkeydown = function () { musique.play(); document.onclick = document.onkeydown = null; };
            });
            var pas = 0;
            var fondu = setInterval(function () {
                pas++;
                musique.volume = Math.min(cible, cible * pas / 30);
                if (pas >= 30) clearInterval(fondu);
            }, 100);
        } catch (err) {}
    }

    // =================================================================
    //  Fonctions appelées par Garry's Mod
    // =================================================================
    window.GameDetails = function (servername, serverurl, mapname, maxplayers, steamid, gamemode, volume, language) {
        if (!CONFIG.nomServeur && servername) $("server-name").innerHTML = servername;
        if (mapname) $("map").innerHTML = nomMap(mapname);
        if (maxplayers) $("players").innerHTML = maxplayers + " joueurs max";
        lancerMusique(volume);
    };
    window.SetFilesTotal = function (n) { total = Math.max(total, n); restants = n; majFichiers(); };
    window.SetFilesNeeded = function (n) { restants = n; majFichiers(); };
    window.DownloadingFile = function (fichier) {
        $("file").innerHTML = (fichier || "").replace(/</g, "&lt;");
        $("status").innerHTML = CONFIG.statuts.downloading;
    };
    window.SetStatusChanged = function (statut) {
        $("status").innerHTML = traduire(statut);
        var s = (statut || "").toLowerCase();
        // sans téléchargement, on avance quand même la barre selon l'étape
        if (s.indexOf("sending client info") !== -1) majBarre(0.85);
        if (s.indexOf("client info sent") !== -1) majBarre(0.9);
        if (s.indexOf("lua") !== -1) majBarre(0.95);
        if (s.indexOf("precaching") !== -1 || s.indexOf("starting lua") !== -1) majBarre(0.98);
    };

    // =================================================================
    //  Démo dans un navigateur : ouvre index.html?demo
    // =================================================================
    // (aussi automatique quand on ouvre le fichier en double-cliquant dessus)
    if (/[?&]demo/.test(window.location.search) || window.location.protocol === "file:") {
        window.GameDetails("Demon Slayer RP", "", "rp_kido_ds5", 64, "", "darkrp", 0.4, "fr");
        var n = 240;
        window.SetFilesTotal(n);
        window.SetStatusChanged("Retrieving server info...");
        var demo = setInterval(function () {
            n -= Math.ceil(Math.random() * 4);
            if (n <= 0) {
                n = 0; clearInterval(demo);
                window.SetStatusChanged("Sending client info...");
                setTimeout(function () { window.SetStatusChanged("Starting Lua..."); }, 1500);
            } else {
                window.DownloadingFile("materials/fauch_inv/ui2/fichier_" + n + ".png");
            }
            window.SetFilesNeeded(n);
        }, 120);
    }
})();
