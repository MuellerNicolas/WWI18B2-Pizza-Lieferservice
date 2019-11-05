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

        let buttonDeletePizzaFromMenu = this._pageDom.querySelector("#deletePizzaFromMenu1");
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
        let new_row_id, base_row_id, new_label_id, base_label_id, base_btn_id, new_btn_id;

        //benötigte Elemente auswählen
        let row = document.querySelector("#auswahlZeileMenu1");
        let target = document.querySelector("#pizzaFromMenu");
        let btn = document.querySelector("#deletePizzaFromMenu1");

        this.ele_nr = ++this.ele_nr;

        //dynamische id für die ganze Zeile
        base_row_id = row.getAttribute("id").replace(/[0-9]/g, "");
        new_row_id = base_row_id + this.ele_nr;

        //dynamische id für Löschbutton bei Pizza von Menu
        base_btn_id = btn.getAttribute("id").replace(/[0-9]/g, "");
        new_btn_id = base_btn_id + this.ele_nr;

        //Klon erstellen
        var clonedRow = row.cloneNode(true);

        //Attribute setzen
        clonedRow.setAttribute("id", new_row_id);
        clonedRow.querySelector("#deletePizzaFromMenu1").setAttribute("id", new_btn_id);
        clonedRow.querySelector("#deletePizzaFromMenu" + this.ele_nr).addEventListener("click", () => this._onDeletePizzaFromMenuClicked(clonedRow));

        //Klon hinzufügen
        let tempObj=target.lastChild;
        while(tempObj.nodeType!=1 && tempObj.previousSibling!=null){
            tempObj=tempObj.previousSibling;
        }
        target.insertBefore(clonedRow, tempObj);


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


    _onDeletePizzaFromMenuClicked(clonedRow) {
        let id_nr = clonedRow.getAttribute("id").replace(/[a-z]/g, "").replace(/[A-Z]/g, "");
        if(id_nr == 1){
            alert("Die erste Pizza kann nicht gelöscht werden!")
        } else {
        let target = document.querySelector("#pizzaFromMenu");
        let row = document.querySelector("#auswahlZeileMenu" + id_nr);
        target.removeChild(row);
        }
    }
}
