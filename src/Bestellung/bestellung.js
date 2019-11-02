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

        let buttonAddTopping = this._pageDom.querySelector("#addTopping");
        buttonAddTopping.addEventListener("click", () => this._onAddToppingClicked());

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
        // alert("Add Pizza from Menu!");
        var listenitem = this._pageDom.querySelector("auswahlZeile");
        var liste = this._pageDom.querySelector("pizzaAuswaehlen");

        liste.appendchild(listenitem.cloneNode(true));


    }

    _onAddToppingClicked() {
        alert("Add Topping!");
    }

    _onAddIndividualClicked() {
        alert("Add individual Pizza!")
    }
}
