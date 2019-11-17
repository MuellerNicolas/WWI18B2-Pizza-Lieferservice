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
    }

    /**
     * Seite anzeigen. Wird von der App-Klasse aufgerufen.
     */
    async show() {
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


//Klick-Event für den Bestellen-Button
        let bestellenButton = this._pageDom.querySelector("#bestellen");
        bestellenButton.addEventListener("click", () => {
            location.hash = "#/Bestellung/";
        });


        let feedbackContainer = this._pageDom.querySelector("#feedback-container");
        let feedbackButton = this._pageDom.querySelector("#feedback");

//Formular ist zu Beginn hidden
        feedbackContainer.classList.add("hidden");

//mit Klick auf den Feedback-Button wird das Formular angezeigt
        feedbackButton.addEventListener("click", () => {
            feedbackButton.classList.add("hidden");
            feedbackContainer.classList.remove("hidden");
        });

//Button-Listener für den Feedback-Senden-Button
        let sendenButton = this._pageDom.querySelector("#senden");
        sendenButton.addEventListener("click", () => {
            // Nicolas hinzugefügt:
            // dropdownGeschmack = document.getElementById("dropdownGeschmack").value;
            //     this._app.database.saveFeedback({
            //     "geschmack": dropdownGeschmack,
            //
            // });
            //Nicolas Ende
            this._onButtonFeedbackClicked();
            feedbackButton.classList.add("hidden");


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
//Vorlageelement für Schleife aus dem DOM-Baum entfernen
              templateElement.parentNode.removeChild(templateElement);
          }

//Methode für das Auslesen der ausgewählten Drop-Down-Menüs aus dem Feedbackbogen und Aufnahme in der Datenbank
          _onButtonFeedbackClicked(){
              let korrekt = true;
              let ausgabe = "";
              let geschmack, bestellung, lieferung, sonstiges, ergebnis;
              let selectedGeschmack, selectedBestellung, selectedLieferung, textSonstiges;

                    ergebnis= document.querySelector("#ergebnis");
                    geschmack = document.querySelector("#dropdownGeschmack");
                    bestellung = document.querySelector("#dropdownBestellvorgang");
                    lieferung = document.querySelector("#dropdownLieferung");
                    sonstiges = document.querySelector("#sonstiges");
                    let feedbackContainer= document.querySelector("#feedback-container");
                    let feedbackButton= document.querySelector("#senden");

                      selectedGeschmack = geschmack.options[geschmack.selectedIndex].text;
                      selectedBestellung = bestellung.options[bestellung.selectedIndex].text;
                      selectedLieferung = lieferung.options[lieferung.selectedIndex].text;
                      textSonstiges = sonstiges.value;

                      // Pizzasorte muss angegeben sein
                      if ( selectedGeschmack == "Bitte Auswählen") {
                          korrekt = false;
                          ergebnis.textContent = "Ihr Feedback kann nicht gesendet werden. Bitte bewerten Sie den Geschmack!";
                      }
                      // Stueckzahl muss angegeben sein
                      else if ( selectedBestellung == "Bitte Auswählen") {
                          korrekt = false;
                          ergebnis.textContent = "Ihr Feedback kann nicht gesendet werden. Bitte bewerten Sie den Bestellvorgang!";
                      }
                      // Lieferung muss ausgewaehlt sein
                      else if( selectedLieferung == "Bitte Auswählen") {
                          korrekt = false;
                          ergebnis.textContent = "Ihr Feedback kann nicht gesendet werden. Bitte bewerten Sie die Lieferung!"
                      }

                      if (korrekt) {
                          this._app.database.saveFeedback({
                              "id": "" + Math.random() * 1000000,     //eindeutige ID für die Pizza
                              "geschmack": selectedGeschmack,
                              "bestellung": selectedBestellung,
                              "lieferung": selectedLieferung,
                              "sonstiges": sonstiges.value,
                          });

//wenn alle Eingaben korrekt sind: Bedanken für das Feedback mit pop-up
                          alert("Vielen Dank für Ihr Feedback!");

/* Container wird nach Ausfüllen des Formulars wieder hidden gemacht. Feedback kann auch nur 1x ausgewählt werden.
der Button zum Auswählen bleibt auf hidden und dadurch kann das Formular auch nicht wieder angezeigt werden um
Mehrfach-Sendung von Feedbacks zu vermeiden. */
                          feedbackContainer.classList.add("hidden");
                      }
            }
}
