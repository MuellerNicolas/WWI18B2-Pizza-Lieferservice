class Lieferung {
    /**
     * Konstruktor
     * @param {App} app Zentrale Instanz der App-Klasse
     */
    constructor (app) {
        this._app = app;
    }

    /**
     * Seite anzeigen. Wird von der App-Klasse aufgerufen.
     */
    async show(matches) {
        // Anzuzeigenden Seiteninhalt nachladen
        let html = await fetch("lieferung/lieferung.html");
        let css = await fetch("lieferung/lieferung.css");

        if (html.ok && css.ok) {
            html = await html.text();
            css = await css.text();
        } else {
            console.error("Fehler beim Laden des HTML/CSS-Inhalts");
            return;
        }

        // Seite zur Anzeige bringen
        this._pageDom = document.createElement("div");
        this._pageDom.innerHTML = html;

        this._app.setPageTitle("Lieferung verfolgen", {isSubPage: true});
        this._app.setPageCss(css);
        this._app.setPageContent(this._pageDom);
    }
}

/*
window.addEventListener("load", () => {
    //Variablen
    let countdown = document.getElementById("countdown");
    let buttonStart = document.getElementById("startCountdown");

    //Variablen Anzeige
    let aktiv = false;
    let zaehler = 1800000;  //in Millisekunden
    let letztesUpdate = 0;

    //Button der den Countdown triggert --> zu ersetzen durch onsubmit!!!
    buttonStart.addEventListener("click", () => {
        aktiv = true
        letztesUpdate = Date.now();
    });

    //Ständiges aktualisieren des Displays
    let countdownAktualisieren = () => {
        let now = Date.now();

        if (now - letztesUpdate >= 1000) {
            letztesUpdate = now;

            if (aktiv && zaehler > 0) {
                zaehler = zaehler - 1000; //1 Sekunde abziehen
            } else {
                aktiv = false;
            }
        }

        //Anpassung des Ausgabeformats
        let sekunden = parseInt((zaehler/1000)%60)
        , minuten = parseInt((zaehler/(1000*60))%60);
        if (minuten < 10) {
            minuten = "0" + minuten + " Minuten "
        } else {
            minuten = minuten + " Minuten "
        }
        if (sekunden < 10){
            sekunden = "0" + sekunden + " Sekunden"
        } else {
            sekunden = sekunden + " Sekunden"
        }
        let zaehlerFormat = minuten + sekunden;

        //Countdown anzeigen
        countdown.textContent = zaehlerFormat;

        // Kontinuierliches Aufrufen der Funktion
        window.requestAnimationFrame(countdownAktualisieren);
    };
    window.requestAnimationFrame(countdownAktualisieren);
});
*/
