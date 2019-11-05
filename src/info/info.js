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
//         this._renderBoatTiles(this._pageDom);

/*        let kreierenButton = this._pageDom.querySelector("#kreieren");
        kreierenButton.addEventListener("click", () => {
            location.hash = "#/Bestellung/";
        });

        let bestellenButton = this._pageDom.querySelector("#bestellen");
        bestellenButton.addEventListener("click", () => {
            location.hash = "#/Bestellung/";
        });


        let feedbackContainer = this._pageDom.querySelector("#feedback-container");
        let feedbackButton = this._pageDom.querySelector("#feedback");

        feedbackButton.addEventListener("click", () => {
            feedbackButton.classList.add("hidden");
            feedbackContainer.classList.remove("hidden");
        });

        let sendenButton = this._pageDom.querySelector("#senden");
        sendenButton.addEventListener("click", () => {
            feedbackButton.classList.remove("hidden");
            feedbackContainer.classList.add("hidden");
            alert("Vielen Dank für Ihr Feedback!");
        });
*/

        this._app.setPageTitle("Startseite");
        this._app.setPageCss(css);
        this._app.setPageContent(this._pageDom);
    }

    // Seite zur Anzeige bringen
    let pageDom = document.createElement("div");
    pageDom.innerHTML = html;

    this._renderPizzaTiles(pageDom);

    this._app.setPageTitle("Startseite");
    this._app.setPageCss(css);
    this._app.setPageHeader(pageDom.querySelector("header"));
    this._app.setPageContent(pageDom.querySelector("main"));
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

        this._app.database.getAllRecords().forEach(pizza => {
            let html = templateElement.innerHTML;
            html = html.replace("{HREF}", `#/Detail/${pizza.id}`);
            html = html.replace("{IMG}", pizza.img);
            html = html.replace("{NAME}", pizza.name);

            mainElement.innerHTML += html;
        });
    }


}
