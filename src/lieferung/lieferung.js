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
        //////////////////////////////////
        //       SinglePageNachladen    //
        //////////////////////////////////
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

        //////////////////////////////////
        //     Formularüberprüfung      //
        //////////////////////////////////

        let validateForm = event => {
            let formular = document.getElementById("formular");
            let korrekt = true;
            let ausgabe = "";

            // Vorname muss angegeben sein
            if (form.vorname.value == "") {
                korrekt = false;
                message += "Bitte geben Sie ihren Vornamen ein. <br />";
            }
            // Nachname muss angegeben sein
            if (form.nachname.value == "") {
                korrekt = false;
                message += "Bitte geben Sie ihren Nachnamen ein. <br />";
            }
            // Postleitzahl muss angegeben sein
            if (form.plz.value == "" && form.plz.value.toString().length != 5) {
                korrekt = false;
                message += "Bitte geben Sie eine korrekte Postleitzahl ein. <br />";
            }
            // Ort muss angegeben sein
            if (form.ort.value == "") {
                korrekt = false;
                message += "Bitte geben Sie einen korrekten Ort ein. <br />";
            }
            // Straße muss angegeben sein
            if (form.strasse.value == "") {
                korrekt = false;
                message += "Bitte geben Sie eine korrekte Straße ein. <br />";
            }
            // Hausnummer muss angegeben sein
            if (form.hausnummer.value == "") {
                korrekt = false;
                message += "Bitte geben Sie eine korrekte Hausnummer ein. <br />";
            }
            // Ergebnis anzeigen
            let ergebnisElement = document.getElementById("ergebnis");

            if (korrekt) {
                message = "Vielen Dank für Ihre Bestellung! </br> Sie können ihre Lieferung nun tracken.";
                ergebnisElement.classList.add("korrekt");
            } else {
                ergebnisElement.classList.remove("korrekt");
            }

            ergebnisElement.innerHTML = message;

            if (!korrekt) {
                event.preventDefault();
            }
        }
        //////////////////////////////////
        //         Tracking             //
        //////////////////////////////////

        //Variablen
        let countdown = document.getElementById("countdown");
        let buttonStart = document.getElementById("startCountdown");
        let statusBild = document.getElementById("statusBild");
        let statusText = document.getElementById("statusText")
        let bestellStatus = "";
        let bestellStatusGeaendert;

        //Variablen Anzeige
        let aktiv = false;
        let zaehlerInitial = 1800000;   //1000 entspricht einer Sekunde
        let zaehler = zaehlerInitial;
        let letztesUpdate = 0;

        //Button der den Countdown triggert --> zu ersetzen durch onsubmit!!!
        buttonStart.addEventListener("click", () => {
            aktiv = true;
            letztesUpdate = Date.now();
        });

        //Ständiges aktualisieren des Displays
        let countdownAktualisieren = () => {
            //Performanceboost: Nach ablaufen der Zeit erzwungenes aktualisieren stoppen
            if(zaehler==0){
                return;
            }
            //Zeitpunkt
            let now = Date.now();

            //Herunterzählen
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

            //Funktion zum aktualisieren des Bildes
            //Um nicht dauerhaft das Bild zu aktualisieren erfolgt,
            //die Aktualisierung nur wenn der Bestellungsstatus geändert wurde
            if(zaehler == 0){
                bestellStatus = "zugestellt";
                bestellStatusGeaendert = true;
            }else if(zaehler < (zaehlerInitial * (2/3))){  //nach 1/3 der Zeit erfolgt die Zustellung
                bestellStatus = "in_Zustellung";
                bestellStatusGeaendert = true;
            } else if(zaehler < zaehlerInitial){
                bestellStatus = "in_Zubereitung";
                bestellStatusGeaendert = true;
            }

            //Bestellungsstatus hat sich geändert, richtiges Bild zuweisen
            if(bestellStatusGeaendert === true){
                switch (bestellStatus) {
                    case "in_Zubereitung":
                        statusBild.src = "pics/zubereitung_koch.png";
                        statusText.textContent = "In Zubereitung";
                        bestellStatusGeaendert = false;
                        break;
                        case "in_Zustellung":
                        statusBild.src = "pics/lieferant.png";
                        statusText.textContent = "In Zustellung";
                        bestellStatusGeaendert = false;
                        break;
                    case "zugestellt":
                        statusBild.src = "pics/haus.png";
                        statusText.textContent = "Zugestellt";
                        bestellStatusGeaendert = false;
                        break;
                }
            }

            // Kontinuierliches Aufrufen der Funktion
            window.requestAnimationFrame(countdownAktualisieren);
        };
        window.requestAnimationFrame(countdownAktualisieren);
    }
}
