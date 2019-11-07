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

/*
        let buttonAddPizzaIndividual = this._pageDom.querySelector("#addPizzaIndividual");
        buttonAddPizzaIndividual.addEventListener("click", () => this._onAddIndividualClicked());
*/

        let buttonOrder = this._pageDom.querySelector("#order");
        buttonOrder.addEventListener("click", () => this._onButtonOrderClicked());

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
        clonedRow.querySelector("#stueck").value = "0";

        //Klon hinzufügen
        /*let tempObj=target.lastChild;
        while(tempObj.nodeType!=1 && tempObj.previousSibling!=null){
            tempObj=tempObj.previousSibling;
        }*/
        let laenge = target.childNodes.length
        target.insertBefore(clonedRow, target.childNodes[laenge]);


    }

/*    _onAddIndividualClicked() {
        let row = document.querySelector("#auswahlZeileIndividuell");
        let target = document.querySelector("#pizzaIndividuell");

        let clonedRow = row.cloneNode(true);
        let div = document.createElement("div");
        div.classList.add("large");
        div.appendChild(clonedRow);
        row.parentNode.insertBefore(div, row);
    }
*/

    _onDeletePizzaFromMenuClicked(clonedRow) {
        if(clonedRow == null){
            alert("Die erste Pizza kann aus systemtechnischen Gründen nicht gelöscht werden!")
        } else {
        let id_nr = clonedRow.getAttribute("id").replace(/[a-z]/g, "").replace(/[A-Z]/g, "");
        let target = document.querySelector("#pizzaFromMenu");
        let row = document.querySelector("#auswahlZeileMenu" + id_nr);
        target.removeChild(row);
        }
    }

    _onButtonOrderClicked(){
        let korrekt = true;
        let ausgabe = "";
        let pizzaSorte, groesse, stueck;
        let selectedPizzaSorte, selectedGroesse, selectedStueck;
        let pizzen = new Array;
        let zaehler = 0;

        //Überprüfung, ob alle benötigten Felder ausgefüllt wurden
        for(let i = 1; i <= this.ele_nr; i++) {
            let row = document.querySelector("#auswahlZeileMenu" + i);
            if(row == null){
                continue;
            } else {
                pizzaSorte = row.querySelector("#dropdownPizza");
                groesse = row.querySelector("#dropdownGroesse");
                stueck = row.querySelector("#stueck");

                selectedPizzaSorte = pizzaSorte.options[pizzaSorte.selectedIndex].text;
                selectedGroesse = groesse.options[groesse.selectedIndex].text;
                selectedStueck = stueck.value;

                // Pizzasorte muss angegeben sein
                if ( selectedPizzaSorte == "Bitte Wählen") {
                    korrekt = false;
                    alert("Bitte geben Sie die gewünschte Pizzasorte an.");
                }
                // Stueckzahl muss angegeben sein
                else if ( selectedStueck == "0") {
                    korrekt = false;
                    alert("Bitte geben Sie die gewünschte Stückzahl an.");
                } else {
                    //Speichern der Pizzadaten in einem Array
                    let p = new Pizza;
                    p.sorte = selectedPizzaSorte;
                    p.groesse = selectedGroesse;
                    p.stueck = selectedStueck;
                    pizzen[zaehler] = p;
                    zaehler++;
                }
            }
        }

        //Umwandlung des pizzaarrays in Object (notwendig für Speicherung in Datenbank)
        let objectPizzen = pizzen.map((obj)=> {return Object.assign({}, obj)})
        //Speichern des Array in app.js
        this._app._pizzenArray = objectPizzen;

        if (korrekt) {
            /* this._app.database.savePizza({
                "id": "" + Math.random() * 1000000,     //eindeutige ID für die Pizza
                "pizzen": objectPizzen
            }); */
            // zu Bestellungsseite wechseln
            location.hash = "#/Lieferung/";
        }



    }
}

class Pizza{
    constructor(sorte, groesse, stueck){
        this.sorte = sorte;
        this.groesse = groesse;
        this.stueck = stueck;
    }
}
