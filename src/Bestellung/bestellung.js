/**
 * Seite zum Aufgeben einer neuen Bestellung.
 */
class Bestellung{
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
        let html = await fetch("bestellung/bestellung.html");
        let css = await fetch("bestellung/bestellung.css");

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

        let buttonAddPizzaFromMenu = this._pageDom.querySelector("#addPizzaFromMenu");
        buttonAddPizzaFromMenu.addEventListener("click", () => this._onAddPizzaFromMenuClicked());

        let buttonDeletePizzaFromMenu = this._pageDom.querySelector("#deletePizzaFromMenu");
        buttonDeletePizzaFromMenu.addEventListener("click", () => this._onDeletePizzaFromMenuClicked());

        let buttonAddPizzaIndividual = this._pageDom.querySelector("#addPizzaIndividual");
        buttonAddPizzaIndividual.addEventListener("click", () => this._onAddIndividualClicked());

        let buttonOrder = this._pageDom.querySelector("#order");
        buttonOrder.addEventListener("click", () =>
            location.hash = "#/Lieferung/");

        this._app.setPageTitle("Bestellung aufgeben", {isSubPage: true});
        this._app.setPageCss(css);
        this._app.setPageContent(this._pageDom);
    }

    _onAddPizzaFromMenuClicked(){
        let row = document.querySelector("#auswahlZeileMenu");
        let target = document.querySelector("#pizzaFromMenu");

        let clonedRow = row.cloneNode(true);
        let div = document.createElement("div");
        div.classList.add("large");
        div.appendChild(clonedRow);
        row.parentNode.insertBefore(div, row);
    }

    _onAddIndividualClicked() {
        let row = document.querySelector("#auswahlZeileIndividuell");
        let target = document.querySelector("#pizzaIndividuell");

        let clonedRow = row.cloneNode(true);
        let div = document.createElement("div");
        div.classList.add("large");
        div.appendChild(clonedRow);
        row.parentNode.insertBefore(div, row);
    }

    _onDeletePizzaFromMenuClicked() {
        alert("Pizza gelöscht")
    }
}
