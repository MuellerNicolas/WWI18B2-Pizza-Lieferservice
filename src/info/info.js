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

        let kreierenButton = this._pageDom.querySelector("#kreieren");
        kreierenButton.addEventListener("click", () => {
            location.hash = "#/Bestellung/";
        });

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
    // _renderBoatTiles(pageDom) {
    //     let mainElement = pageDom.querySelector("main");
    //     let templateElement = pageDom.querySelector("#template-tile");
    //
    //     this._app.database.getAllRecords().forEach(boat => {
    //         let html = templateElement.innerHTML;
    //         html = html.replace("{HREF}", `#/Detail/${boat.id}`);
    //         html = html.replace("{IMG}", boat.img);
    //         html = html.replace("{NAME}", boat.name);
    //
    //         mainElement.innerHTML += html;
    //     });
    // }


}
