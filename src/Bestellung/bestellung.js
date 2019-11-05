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
        this.ele_nr = app._ele_nr;
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
        let new_row_id, base_row_id, new_label_id, base_label_id, new_radio_name, base_radio_name,
            new_radio_id_eins, base_radio_id_eins, new_radio_id_zwei, base_radio_id_zwei;
debugger;
        //benötigte Elemente auswählen
        let row = document.querySelector("#auswahlZeileMenu" + this.ele_nr);
        let target = document.querySelector("#pizzaFromMenu");
        let label = document.querySelector("#kleinGrossM" + this.ele_nr);
        let radioBtn1 = document.querySelector("#groesseMEins" + this.ele_nr);
        let radioBtn2 = document.querySelector("#groesseMZwei" + this.ele_nr);

        this.ele_nr = ++this.ele_nr;

        //dynamische id für die ganze Zeile
        base_row_id = row.getAttribute("id").replace(/[0-9]/g, "");
        new_row_id = base_row_id + this.ele_nr;


        //dynamische id für das label
        base_label_id = label.getAttribute("id").replace(/[0-9]/g, "");
        new_label_id = base_label_id + this.ele_nr;

        //dynamischer name für radiobuttons
        base_radio_name = radioBtn1.getAttribute("name").replace(/[0-9]/g, "");
        new_radio_name = base_radio_name + this.ele_nr;
        base_radio_id_eins = radioBtn1.getAttribute("id").replace(/[0-9]/g, "");
        base_radio_id_zwei = radioBtn2.getAttribute("id").replace(/[0-9]/g, "");
        new_radio_id_eins = base_radio_id_eins + this.ele_nr;
        new_radio_id_eins = base_radio_id_zwei + this.ele_nr;

        //Klon erstellen
        let clonedRow = row.cloneNode(true);

        //Attribute setzen
        clonedRow.setAttribute("id", new_row_id);
        clonedRow.querySelector("#kleinGrossM" + (this.ele_nr-1)).setAttribute("id", new_label_id);
        //clonedRow.querySelector("groesseMEins" + (this.ele_nr-1)).setAttribute("name", new_radio_name);
        //clonedRow.querySelector("groesseMZwei" + (this.ele_nr-1)).setAttribute("name", new_radio_name);
        //clonedRow.querySelector("groesseMEins" + (this.ele_nr-1)).setAttribute("id", new_radio_id);
        //clonedRow.querySelector("groesseMZwei" + (this.ele_nr-1)).setAttribute("id", new_radio_id);

        //Klon hinzufügen
        target.insertBefore(clonedRow, row.nextSibling);

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
