class Lieferung {
    /**
     * Konstruktor
     * @param {App} app Zentrale Instanz der App-Klasse
     */
    constructor (app) {
        this._app = app;
        //Variablen des Countdowns
        this.zaehler = app._zaehler;
        this.bestellt = app.bestellt;
        this.aktiv = app.aktiv;
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

        // Registrierung Abschicken Button des Bestellformulars
        let formElement = this._pageDom.querySelector("form");
        formElement.addEventListener("submit", event => this._onFormSubmitClicked(event));

        this._app.setPageTitle("Lieferung verfolgen", {isSubPage: true});
        this._app.setPageCss(css);
        this._app.setPageContent(this._pageDom);

        // Formularanzeige & Ausgabebereich der Formularprüfung
        if(this._app._ausgabe != "") {
            if(this._app._bestellt === true) {
                document.getElementById("linkeSeite").classList.add("unsichtbar");
                document.getElementById("ergebnis").classList.add("korrekt");
            }
            document.getElementById("ergebnis").innerHTML = this._app._ausgabe;
        }
        //Trackingbutton Funktion registrieren, Sichtbarmachen des Countdowns und Bildes
        let trackbutton = document.getElementById("startCountdown");
        trackbutton.addEventListener("click", () => {
            document.getElementById("countdown").classList.remove("unsichtbar");
            document.getElementById("statusDiv").classList.remove("unsichtbar");
        });

        //////////////////////////////////
        //      Bestellübersicht        //
        //////////////////////////////////
        //Bestellübersicht nur anzeigen, wenn Pizzen bereits ausgewählt sind
        if(this._app._summe === 0){
            document.getElementById("rechteSeite").classList.add("unsichtbar");
        } else{
            this._bestelluebersichtAnzeigen(this._app);
        }

        //////////////////////////////////
        //         Tracking             //
        //////////////////////////////////
        //Variablen
        let countdown = document.getElementById("countdown");
        let statusBild = document.getElementById("statusBild");
        let statusText = document.getElementById("statusText")
        let bestellStatus = "";
        let bestellStatusGeaendert;

        //Variablen Anzeige
        let zaehlerInitial = 1800000;   //1000 entspricht einer Sekunde -> also eine halbe Stunde
        let letztesUpdate = this._app._letztesUpdate;
        //Ständiges aktualisieren des Displays
        let countdownAktualisieren = () => {
            let zaehler = this._app._zaehler;
            //Performance: Nach ablaufen der Zeit erzwungenes aktualisieren stoppen
            if(zaehler==0){
                return;
            }
            //Zeitpunkt
            let now = Date.now();

            //Herunterzählen
            if (now - letztesUpdate >= 1000) {
                letztesUpdate = now;

                if (this.aktiv && zaehler > 0) {
                    zaehler = zaehler - 1000; //1 Sekunde abziehen
                    this._app._zaehler = zaehler;
                } else {
                    this.aktiv = false;
                    this._app._aktiv = this.aktiv;
                }
            }

            //Anpassung des Ausgabeformats
            let sekunden = parseInt((zaehler/1000)%60)
            let minuten = parseInt((zaehler/(1000*60))%60);
            if (minuten < 10) {
                minuten = "0" + minuten + " Minuten "
            } else {
                minuten = minuten + " Minuten "
            }
            if (sekunden < 10) {
                sekunden = "0" + sekunden + " Sekunden"
            } else {
                sekunden = sekunden + " Sekunden"
            }
            let zaehlerFormat = minuten + sekunden;

            //Countdown anzeigen
            countdown.textContent = zaehlerFormat;

            //Abfrage zum aktualisieren des Bildes
            //Um nicht dauerhaft das Bild zu aktualisieren, erfolgt
            //die Aktualisierung nur wenn der Bestellungsstatus geändert wurde
            if(zaehler == 0) {
                bestellStatus = "zugestellt";
                bestellStatusGeaendert = true;
            } else if(zaehler < (zaehlerInitial * (2/3))) {  //nach 1/3 der Zeit erfolgt die Zustellung
                bestellStatus = "in_Zustellung";
                bestellStatusGeaendert = true;
            } else if(zaehler < zaehlerInitial) {
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

    /**
     * Formulareingaben prüfen und in der Datenbank speichern
     */
    _onFormSubmitClicked(event) {
        let formular = event.target;
        let korrekt = true;
        let ausgabe = "";

        // Bestellung ohne ausgewählte Pizzen verhindern
        if (this._app._summe === 0){
            korrekt = false;
            ausgabe += "Bitte wählen Sie unter \"Bestellung\" Ihre gewünschten Pizzen aus!";
        } else {
            // Vorname muss angegeben sein
            if (formular.vorname.value == "") {
                korrekt = false;
                ausgabe += "Bitte geben Sie ihren Vornamen ein. <br />";
            }
            // Nachname muss angegeben sein
            if (formular.nachname.value == "") {
                korrekt = false;
                ausgabe += "Bitte geben Sie ihren Nachnamen ein. <br />";
            }
            // Postleitzahl muss angegeben sein
            if (formular.plz.value == "" || formular.plz.value.toString().length != 5) {
                korrekt = false;
                ausgabe += "Bitte geben Sie eine korrekte Postleitzahl ein. <br />";
            } else if (formular.plz.value != 76133 ){
                korrekt = false;
                ausgabe += "Lieferung leider nur nach 76133 Karlsruhe Innenstadt-West möglich! <br />";
            }
            // Ort muss angegeben sein
            if (formular.ort.value == "") {
                korrekt = false;
                ausgabe += "Bitte geben Sie einen korrekten Ort ein. <br />";
            }
            // Straße muss angegeben sein
            if (formular.strasse.value == "") {
                korrekt = false;
                ausgabe += "Bitte geben Sie eine korrekte Straße ein. <br />";
            }
            // Hausnummer muss angegeben sein
            if (formular.hausnummer.value == "") {
                korrekt = false;
                ausgabe += "Bitte geben Sie eine korrekte Hausnummer ein. <br />";
            }
            // Ergebnis anzeigen
            let ergebnis = document.getElementById("ergebnis");
            if (korrekt) {
                ausgabe = "Vielen Dank für Ihre Bestellung! </br> Sie können ihre Lieferung nun tracken.";
                ergebnis.classList.add("korrekt");
            } else {
                ergebnis.classList.remove("korrekt");
            }
        }
        ergebnis.innerHTML = ausgabe;
        this._app._ausgabe = ausgabe;

        //Verhindern des Absendes
        event.preventDefault();

        if(korrekt){
            this.bestellt = true;
            this._app._bestellt = this.bestellt;

            //nach erfolgter Bestellung den Bestellbutton ausblenden
            document.getElementById("bestellbestätigung").classList.add("unsichtbar");

            //////////////////////////////////
            //   GoogleFirebase speichern   //
            //////////////////////////////////
            this._app.database.saveBestellung({
                // "id": "" + Math.random() * 1000000,     //eindeutige ID für die Bestellung
                "vorname": formular.vorname.value,
                "nachname": formular.nachname.value,
                "plz": formular.plz.value,
                "ort": formular.ort.value,
                "strasse": formular.strasse.value,
                "hausnummer": formular.hausnummer.value,
                "pizzen": this._app._pizzenArray
            }
            );

            //Eingabefelder leeren
            formular.vorname.value = "";
            formular.nachname.value = "";
            formular.plz.value = "";
            formular.ort.value = "";
            formular.strasse.value = "";
            formular.hausnummer.value = "";

            //Countdown starten
            this.aktiv = true;          //Flag, das vielfaches herunter zählen beim Tabwechsel verhindert
            this._app._aktiv = this.aktiv;
            this._app._letztesUpdate = Date.now();
            this._app._zaehler = 1800000
            this.show();
        }
    }

    //////////////////////////////////
    //  Bestellübersicht anzeigen  //
    /////////////////////////////////
    _bestelluebersichtAnzeigen(app){
        //Gesamtpreis anzeigen
        let gesamtpreis = document.getElementById("preis");
        let pElement = document.createElement("p");
        gesamtpreis.appendChild(pElement);
        let pContent = document.createTextNode(this._app._summe + "€")
        pElement.appendChild(pContent);

        //Übersicht der Pizzen anzeigen
        let pizzenArray = app._pizzenArray;
        let pizzenliste = document.getElementById("pizzen");
        //Für jede einzelne Pizza ein neues Dombaum-Element einfügen
        pizzenArray.forEach(pizza => {
                let pElement = document.createElement("p");
                pizzenliste.appendChild(pElement);
                let pContent = document.createTextNode(pizza.stueck + "x " + pizza.sorte + " " + pizza.groesse)
                pElement.appendChild(pContent);
        });
    }
}
