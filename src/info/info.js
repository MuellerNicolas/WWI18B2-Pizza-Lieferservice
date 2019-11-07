"use strict";

/**
 * Klasse PageOverview: Stellt die Startseite der App zur Verfügung
 */
class Info {
    /**
     * Konstruktor
     * @param {App} app Zentrale Instanz der App-Klasse
     */
    constructor(app) {
        this._app = app;
//kann evtl raus
//        this._recordId = -1;
//        this._data = null;
    }

    /**
     * Seite anzeigen. Wird von der App-Klasse aufgerufen.
     */
    async show() {
        // URL-Parameter auswerten
//        this._recordId = matches[1];
//        this._data = this._app.database.getRecordById(this._recordId);

        // Anzuzeigenden Seiteninhalt nachladen
        let html = await fetch("info/info.html");
        let css = await fetch("info/info.css");

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
        this._renderPizzaTiles(this._pageDom);

//        let kreierenButton = this._pageDom.querySelector("#kreieren");
//        kreierenButton.addEventListener("click", () => {
//            location.hash = "#/Bestellung/";
//        });


//Klick-Event für den Bestellen-Button
        let bestellenButton = this._pageDom.querySelector("#bestellen");
        bestellenButton.addEventListener("click", () => {
            location.hash = "#/Bestellung/";
        });

//Klick-Event für Kacheln, um auf Bestellen-Seite zu kommen
        /*let kachelKlick = this._pageDom.querySelector("#test");
               kachelKlick.addEventListener("click", () => {
               location.hash = "#/Bestellung/";
        });*/

        let feedbackContainer = this._pageDom.querySelector("#feedback-container");
        let feedbackButton = this._pageDom.querySelector("#feedback");

        feedbackButton.addEventListener("click", () => {
            feedbackButton.classList.add("hidden");
            feedbackContainer.classList.remove("hidden");
        });

        let sendenButton = this._pageDom.querySelector("#senden");
        sendenButton.addEventListener("click", () => {
            // Nicolas hinzugefügt:
            // dropdownGeschmack = document.getElementById("dropdownGeschmack").value;
            //     this._app.database.saveFeedback({
            //     "geschmack": dropdownGeschmack,
            //
            // });
            //Nicolas Ende
            feedbackButton.classList.remove("hidden");
            feedbackContainer.classList.add("hidden");
            alert("Vielen Dank für Ihr Feedback!");
        });


        function button_click(id) {
	           if (feedback-container.getElementById(id).checked == true) {
		                 alert ("Der Button " + id + " wurde ausgewählt.");
	           } else{
		                 alert ("Der Button " + id + " wurde abgewählt.");
             }
        }

        this._app.setPageTitle("Startseite");
        this._app.setPageCss(css);
        this._app.setPageContent(this._pageDom);
    }
           /**
           * Hilfsmethode, welche den HTML-Code zur Darstellung der Kacheln auf
           * der Startseite erzeugt.
           *
           * @param {HTMLElement} pageDom Wurzelelement der eingelesenen HTML-Datei
           * mit den HTML-Templates dieser Seite.
           */
          _renderPizzaTiles(pageDom) {
              let mainElement = pageDom.querySelector("main");
              let templateElement = pageDom.querySelector("#template-tile");

              this._app.datenbank.getAllRecords().forEach(pizza => {
                  let html = templateElement.innerHTML;

                  html = html.replace("{HREF}", `#/Bestellung/`);
                  html = html.replace("{ID}", pizza.id);
                  html = html.replace("{IMG}", pizza.img);
                  html = html.replace("{NAME}", pizza.name);
                  html = html.replace("{BESCHR}", pizza.beschr);
                  html = html.replace("{PREISKLEIN}", pizza.preisKlein);
                  html = html.replace("{PREISGROSS}", pizza.preisGross);

                 mainElement.innerHTML += html;


              });
          }

    //Feedbackeinträge prüfen und in Datenbank Speichern
    _onFeedbackSubmitClicked(event) {
        let feedback = event.target;
        let korrekt = true;
        let ausgabe = "";

        // Geschmack muss angegeben sein
        if (feedback.dropdownGeschmack.value != "Wahelen") {
            korrekt = false;
            ausgabe += "Bitte Bewerten Sie den Geschmack. <br />";
        }
        // Bestellvorgang muss bewertet sein
        if (feedback.dropdownBestellvorgang.value != "Wahelen") {
            korrekt = false;
            ausgabe += "Bitte Bewerten Sie den Bestellvorgang. <br />";
        }
        // Bestellvorgang muss bewertet sein
        if (feedback.dropdownLieferung.value != "Wahelen") {
            korrekt = false;
            ausgabe += "Bitte Bewerten Sie die Lieferung. <br />";
        }

        // Ergebnis anzeigen
        let ergebnisElement = document.getElementById("ergebnis");

        if (korrekt) {
            ausgabe = "Vielen Dank für Ihr Feedback";
            ergebnisElement.classList.add("korrekt");
        } else {
            ergebnisElement.classList.remove("korrekt");
        }

        ergebnisElement.innerHTML = ausgabe;

        event.preventDefault();

        if(korrekt){

            //////////////////////////////////
            //   GoogleFirebase speichern   //
            //////////////////////////////////
            this._app.database.saveFeedback({
                // "id": "" + Math.random() * 1000000,     //eindeutige ID für die Bestellung
                "dropdownGeschmack": feedback.dropdownGeschmack.value,
                "dropdownBestellvorgang": feedback.dropdownBestellvorgang.value,
                "dropdownLieferung": feedback.dropdownLieferung.value,
                "sonstiges": feedback.sonstiges.value,
            },
            {
                "feedback": this._feedbackArray
            });

        }
    }
}
