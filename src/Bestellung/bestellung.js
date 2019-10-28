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

        let buttonAddTopping = this._pageDom.querySelector("#addTopping");
        buttonAddTopping.addEventListener("click", () => this._onAddToppingClicked());

        this._app.setPageTitle("Bestellung aufgeben", {isSubPage: true});
        this._app.setPageCss(css);
        this._app.setPageContent(this._pageDom);
    }

    _onAddToppingClicked() {
        alert("Add Topping!");
    }

    klick () {
        let pizzaMenuButton = document.getElementById("addPizzaFromMenu");
        pizzaMenuButton.addEventListener("click", addPizzaFromMenu);

        let toppingButton = document.querySelector("addTopping");
        toppingButton.addEventListener("click", () => this.addTopping);

        let pizzaIndividualButton = document.querySelector("addPizza");
        pizzaIndividualButton.addEventListener("click", () => this.addPizza);

        let bestellenButton = document.querySelector("order");
        bestellenButton.addEventListener("click", /*Methode*/);

    }

    addPizzaFromMenu () {
        //neue Pizzazeile hinzufügen
        // let liste = document.getElementById("pizzaAuswaehlen");
        // let liElement = document.getElementById("auswahlZeile");
        // liste.appendChild(liElement);
        alert ("Hello!");
    }

    addTopping(){
        //neue Toppingzeile hinzufügen
    }

    addPizza(){
        //neue Pizzazeile hinzufügen (selbstkreierte Pizza)
    }
}
