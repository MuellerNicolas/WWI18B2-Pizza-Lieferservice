//////////////////////////////////
//     Formularüberprüfung      //
//////////////////////////////////
let validiereBestellung = event => {
    let formular = document.getElementById("formular");
    let korrekt = true;
    let ausgabe = "";

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
    let ergebnisElement = document.getElementById("ergebnis");

    if (korrekt) {
        ausgabe = "Vielen Dank für Ihre Bestellung! </br> Sie können ihre Lieferung nun tracken.";
        ergebnisElement.classList.add("korrekt");
    } else {
        ergebnisElement.classList.remove("korrekt");
    }
    debugger;
    ergebnisElement.innerHTML = ausgabe;

    // if (!korrekt) {
        event.preventDefault();
    // } else {
    if(korrekt){
        bestellt = true;

        //////////////////////////////////
        //   GoogleFirebase speichern   //
        //////////////////////////////////
        database._db.collection("bestellungen").add({
            vorname: formular.vorname.value,
            nachname: formular.nachname.value,
            plz: formular.plz.value,
            ort: formular.ort.value,
            strasse: formular.strasse.value,
            hausnummer: formular.hausnummer.value
        })
    }
}

// Der Zähler für den Countdown wurde als globale Variable definiert,
// damit der Countdown auch nach gestartetem Tracking und
// darauf folgenden Unterseiten wechseln fortlaufend runter zählt.
// Ähnlich ist dies beim flag status, dass angiebt ob der Countdown läuft
let zaehler = 0;
let status = false;

// Das flag bestellt deaktiviert das Tracking solange das Bestellformular
// nicht abgesendet wurde
let bestellt = false;

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
        let zaehlerInitial = 1800000;   //1000 entspricht einer Sekunde
        let letztesUpdate = 0;
        let aktiv = false;  //Wird benötigt um doppeltes Herunterzählen zu verhindern
        //Button der den Countdown triggert --> zu ersetzen durch onsubmit!!!
        buttonStart.addEventListener("click", () => {
            if(status === false && bestellt === true){
                aktiv = true;
                letztesUpdate = Date.now();
                zaehler = zaehlerInitial;
               window.requestAnimationFrame(countdownAktualisieren);
               status = true;
            }
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
