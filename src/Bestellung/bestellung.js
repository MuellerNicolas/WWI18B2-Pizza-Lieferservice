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

        let buttonAddPizza = this._pageDom.querySelector("#addPizza");
        buttonAddPizza.addEventListener("click", () => this._onAddPizzaClicked());

        let buttonDeletePizza = this._pageDom.querySelector("#deletePizza1");
        buttonDeletePizza.addEventListener("click", () => this._onDeletePizzaClicked());

        let dropdownPizza = this._pageDom.querySelector("#dropdownPizza");
        dropdownPizza.addEventListener("change", () => this._onDropdownPizzaChanged(dropdownPizza));

/*        let dropdownGroesse = this._pageDom.querySelector("#dropdownGroesse");
        dropdownGroesse.addEventListener("select", ())=> this._onDropdownGroesseSelected(dropdownGroesse));

        let inputStueck = this._pageDom.querySelector("#stueck");
        inputStueck.addEventListener("click", ())=> this._onInputStueckClicked());
*/
        let buttonOrder = this._pageDom.querySelector("#order");
        buttonOrder.addEventListener("click", () => this._onButtonOrderClicked());

        this._app.setPageTitle("Bestellung aufgeben", {isSubPage: true});
        this._app.setPageCss(css);
        this._app.setPageContent(this._pageDom);
    }

    _onAddPizzaClicked(){
        let new_row_id, base_row_id, new_label_id, base_label_id, base_btn_id, new_btn_id;

        //benötigte Elemente auswählen
        let row = document.querySelector("#auswahlZeile1");
        let target = document.querySelector("#pizza");
        let btn = document.querySelector("#deletePizza1");

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
        clonedRow.querySelector("#deletePizza1").setAttribute("id", new_btn_id);
        clonedRow.querySelector("#deletePizza" + this.ele_nr).addEventListener("click", () => this._onDeletePizzaClicked(clonedRow));
        clonedRow.querySelector("#dropdownPizza").addEventListener("change", () => this._onDropdownPizzaChanged());
        clonedRow.querySelector("#stueck").value = "0";

        //Klon hinzufügen
        /*let tempObj=target.lastChild;
        while(tempObj.nodeType!=1 && tempObj.previousSibling!=null){
            tempObj=tempObj.previousSibling;
        }*/
        let laenge = target.childNodes.length
        target.insertBefore(clonedRow, target.childNodes[laenge]);


    }

    _onDeletePizzaClicked(clonedRow) {
        if(clonedRow == null){
            alert("Die erste Pizza kann aus systemtechnischen Gründen nicht gelöscht werden!")
        } else {
        let id_nr = clonedRow.getAttribute("id").replace(/[a-z]/g, "").replace(/[A-Z]/g, "");
        let target = document.querySelector("#pizza");
        let row = document.querySelector("#auswahlZeile" + id_nr);
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
            let row = document.querySelector("#auswahlZeile" + i);
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
        this._pizzenArray = objectPizzen;

        if (korrekt) {
            /* this._app.database.savePizza({
                "id": "" + Math.random() * 1000000,     //eindeutige ID für die Pizza
                "pizzen": objectPizzen
            }); */
            // zu Bestellungsseite wechseln
            location.hash = "#/Lieferung/";
        }



    }
    _onDropdownPizzaChanged(){
        let pizzaSorte, groesse, stueck, selectedPizzaSorte, selectedGroesse, selectedStueck;
        let newP = document.createElement("p");
        let oldP = document.querySelector("#preis");
        let preisParent = document.querySelector("#preisParent");
        let textNode;
        let korrekt = true;

        for(let i = 1; i <= this.ele_nr; i++) {
            let row = document.querySelector("#auswahlZeile" + i);
            if(row == null){
                continue;
            } else {
                pizzaSorte = row.querySelector("#dropdownPizza");
                groesse = row.querySelector("#dropdownGroesse");
                stueck = row.querySelector("#stueck");

                selectedPizzaSorte = pizzaSorte.options[pizzaSorte.selectedIndex].text;
                selectedGroesse = groesse.options[groesse.selectedIndex].text;
                selectedStueck = stueck.value;

                switch (selectedPizzaSorte) {
                    case "Waehlen":
                        break;
                    case "Margherita":
                    debugger;
                        if (selectedStueck != "0" && selectedGroesse =="klein"){
                            textNode = "" + (parseFloat(this._app.datenbank.getRecordById(1).preisKlein) * parseInt(selectedStueck));
                        } else if(selectedStueck != "0" && selectedGroesse =="groß"){
                            textNode = "" + this._app.datenbank.getRecordById(1).preisGross;
                        } else {
                            korrekt = false;
                        }
                        break;
                    case "Funghi":
                        if (selectedStueck != "0" && selectedGroesse =="klein"){
                            textNode = "" + this._app.datenbank.getRecordById(2).preisKlein;
                        } else if(selectedStueck != "0" && selectedGroesse =="groß"){
                            textNode = "" + this._app.datenbank.getRecordById(2).preisGross;
                        } else {
                            korrekt = false;
                        }
                        break;
                    case "Vegetariana":
                        if (selectedStueck != "0" && selectedGroesse =="klein"){
                            textNode = "" + this._app.datenbank.getRecordById(3).preisKlein;
                        } else if(selectedStueck != "0" && selectedGroesse =="groß"){
                            textNode = "" + this._app.datenbank.getRecordById(3).preisGross;
                        } else {
                            korrekt = false;
                        }
                        break;
                    case "Napoli":
                        if (selectedStueck != "0" && selectedGroesse =="klein"){
                            textNode = "" + this._app.datenbank.getRecordById(4).preisKlein;
                        } else if(selectedStueck != "0" && selectedGroesse =="groß"){
                            textNode = "" + this._app.datenbank.getRecordById(4).preisGross;
                        } else {
                            korrekt = false;
                        }
                        break;
                    case "Prosciutto":
                        if (selectedStueck != "0" && selectedGroesse =="klein"){
                            textNode = "" + this._app.datenbank.getRecordById(5).preisKlein;
                        } else if(selectedStueck != "0" && selectedGroesse =="groß"){
                            textNode = "" + this._app.datenbank.getRecordById(5).preisGross;
                        } else {
                            korrekt = false;
                        }
                        break;
                    case "Salami":
                        if (selectedStueck != "0" && selectedGroesse =="klein"){
                            textNode = "" + this._app.datenbank.getRecordById(6).preisKlein;
                        } else if(selectedStueck != "0" && selectedGroesse =="groß"){
                            textNode = "" + this._app.datenbank.getRecordById(6).preisGross;
                        } else {
                            korrekt = false;
                        }
                        break;
                }
            }
        }
        if (korrekt == false){
            textNode = "Preis kann nicht berechnet werden. Bitte überprüfen Sie, ob alle Angaben gemacht wurden.";
        }
        newP.textContent = textNode;
        newP.setAttribute("id", "preis");
        preisParent.replaceChild(newP, oldP);

    }

    _onDropdownGroesseSelected(){
        let ausgefüllt = false;
        let selectedGroesse = groesse.options[groesse.selectedIndex].text;

        return ausgefuellt;

    }

    _onInputStueckClicked(){
        let ausgefüllt = false;
        let selectedStueck = stueck.value;

        return ausgefuellt;
    }
}

class Pizza{
    constructor(sorte, groesse, stueck){
        this.sorte = sorte;
        this.groesse = groesse;
        this.stueck = stueck;
    }
}
