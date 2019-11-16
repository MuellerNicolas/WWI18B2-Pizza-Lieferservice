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
        //this.ele_nr = app._ele_nr;
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
        debugger;
        this._pageDom = document.createElement("div");

        if (typeof this._app._daten === "undefined"){
            this._pageDom.innerHTML = html;
        } else {
            this._pageDom.innerHTML = this._app._daten;
        }

        let buttonAddPizza = this._pageDom.querySelector("#addPizza");
        buttonAddPizza.addEventListener("click", () => this._onAddPizzaClicked());

        let buttonDeletePizza = this._pageDom.querySelector("#deletePizza1");
        buttonDeletePizza.addEventListener("click", () => this._onDeletePizzaClicked());

        let dropdownPizza = this._pageDom.querySelector("#dropdownPizza");
        dropdownPizza.addEventListener("change", () => this._onChanged());

        let dropdownGroesse = this._pageDom.querySelector("#dropdownGroesse");
        dropdownGroesse.addEventListener("change", ()=> this._onChanged());

        let inputStueck = this._pageDom.querySelector("#stueck");
        inputStueck.addEventListener("click", ()=> this._onChanged());

        let buttonOrder = this._pageDom.querySelector("#order");
        buttonOrder.addEventListener("click", () => this._onButtonOrderClicked());

        this._app.setPageTitle("Bestellung aufgeben", {isSubPage: true});
        this._app.setPageCss(css);
        this._app.setPageContent(this._pageDom);

        let array = JSON.parse(sessionStorage.getItem("daten"));
        if (typeof array === "undefined"){
            //do nothing
        } else {
            for(let i = 0; i < array.length;  i++){
                let row = document.querySelector("#auswahlZeile" + (i+1));
                if(row == null){
                    continue;
                } else {
                    row.querySelector("#dropdownPizza").value = array[i].sorte;
                    row.querySelector("#dropdownGroesse").value = array[i].groesse;
                    row.querySelector("#stueck").value = array[i].stueck;

                    if(i != 0){
                    row.querySelector("#deletePizza" + (i+1)).addEventListener("click", () => this._onDeletePizzaClicked(row));
                    row.querySelector("#dropdownPizza").addEventListener("click", () => this._onChanged());
                    row.querySelector("#dropdownGroesse").addEventListener("click", () => this._onChanged());
                    row.querySelector("#stueck").addEventListener("click", () => this._onChanged());
                    this._gesamtPreisBerechnenUndAusgeben();
                    }
                }
            }
        }
    }

    _onAddPizzaClicked(){
        let new_row_id, base_row_id, new_label_id, base_label_id, base_btn_id, new_btn_id;

        //benötigte Elemente auswählen
        let row = document.querySelector("#auswahlZeile1");
        let target = document.querySelector("#pizza");
        let btn = document.querySelector("#deletePizza1");

        this._app._ele_nr = ++this._app._ele_nr;

        //dynamische id für die ganze Zeile
        base_row_id = row.getAttribute("id").replace(/[0-9]/g, "");
        new_row_id = base_row_id + this._app._ele_nr;

        //dynamische id für Löschbutton bei Pizza von Menu
        base_btn_id = btn.getAttribute("id").replace(/[0-9]/g, "");
        new_btn_id = base_btn_id + this._app._ele_nr;

        //Klon erstellen
        var clonedRow = row.cloneNode(true);

        //Attribute setzen
        clonedRow.setAttribute("id", new_row_id);
        clonedRow.querySelector("#deletePizza1").setAttribute("id", new_btn_id);
        clonedRow.querySelector("#deletePizza" + this._app._ele_nr).addEventListener("click", () => this._onDeletePizzaClicked(clonedRow));
        clonedRow.querySelector("#dropdownPizza").addEventListener("change", () => this._onChanged());
        clonedRow.querySelector("#dropdownGroesse").addEventListener("change", ()=> this._onChanged());
        clonedRow.querySelector("#stueck").addEventListener("change", ()=> this._onChanged());
        clonedRow.querySelector("#stueck").value = "0";

        //Klon hinzufügen
        /*let tempObj=target.lastChild;
        while(tempObj.nodeType!=1 && tempObj.previousSibling!=null){
            tempObj=tempObj.previousSibling;
        }*/
        let laenge = target.childNodes.length;
        target.insertBefore(clonedRow, target.childNodes[laenge]);

        //Preis ungültig machen
        let newSpan = document.createElement("span");
        let oldSpan = document.querySelector("#preis");
        let preisParent = document.querySelector("#preisParent");
        let textNode = "Ihre Angaben sind unvollständig.";
        newSpan.textContent = textNode;
        newSpan.setAttribute("id", "preis");
        preisParent.replaceChild(newSpan, oldSpan);

        this._saveSession();
        this._app._daten = document.querySelector("#app-main-area").innerHTML;

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
        this._gesamtPreisBerechnenUndAusgeben();

        this._saveSession();
        this._app._daten = document.querySelector("#app-main-area").innerHTML;
    }

    _onButtonOrderClicked(){
        let korrekt = true;
        let ausgabe = "";
        let pizzaSorte, groesse, stueck;
        let selectedPizzaSorte, selectedGroesse, selectedStueck;
        let pizzen = new Array;
        let zaehler = 0;
        let popUp = false;

        //Überprüfung, ob alle benötigten Felder ausgefüllt wurden
        for(let i = 1; i <= this._app._ele_nr; i++) {
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
                    if (popUp == false){
                        ausgabe = "<br> Bitte geben Sie die gewünschte Pizzasorte an.";
                        popUp = true;
                    }
                }
                // Stueckzahl muss angegeben sein
                else if ( selectedStueck == "0") {
                    korrekt = false;
                    if (popUp == false){
                        ausgabe = "<br> Bitte geben Sie die gewünschte Stückzahl an.";
                        popUp = true;
                    }
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

        ergebnis.innerHTML = ausgabe;

        //Umwandlung des pizzaarrays in Object (notwendig für Speicherung in Datenbank)
        let objectPizzen = pizzen.map((obj)=> {return Object.assign({}, obj)})

        //Speichern des Array in app.js
        this._app._pizzenArray = objectPizzen;

        if (korrekt) {
            // zu Bestellungsseite wechseln
            location.hash = "#/Lieferung/";
        }
    }

    _onChanged(){
        //let ausgabe = "";
        this._gesamtPreisBerechnenUndAusgeben();
        //ergebnis.innerHTML = ausgabe;

        this._saveSession();
    }

    _gesamtPreisBerechnenUndAusgeben(){
        let pizzaSorte, groesse, stueck, selectedPizzaSorte, selectedGroesse, selectedStueck;
        let newSpan = document.createElement("span");
        let oldSpan = document.querySelector("#preis");
        let preisParent = document.querySelector("#preisParent");
        let textNode;
        let korrekt = true;
        this._app._summe = 0;

        for(let i = 1; i <= this._app._ele_nr; i++) {
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
                    case "Bitte Wählen":
                            korrekt = false;
                        break;
                    case "Margherita":
                        if (selectedStueck != "0" && selectedGroesse =="klein"){
                            this._app._summe = this._app._summe + (Number(this._app.datenbank.getRecordById(1).preisKlein) * Number(selectedStueck));
                        } else if(selectedStueck != "0" && selectedGroesse =="groß"){
                            this._app._summe = this._app._summe + (Number(this._app.datenbank.getRecordById(1).preisGross) * Number(selectedStueck));
                        } else {
                            korrekt = false;
                        }
                        break;
                    case "Funghi":
                        if (selectedStueck != "0" && selectedGroesse =="klein"){
                            this._app._summe = this._app._summe + (Number(this._app.datenbank.getRecordById(2).preisKlein) * Number(selectedStueck));
                        } else if(selectedStueck != "0" && selectedGroesse =="groß"){
                            this._app._summe = this._app._summe + (Number(this._app.datenbank.getRecordById(2).preisGross) * Number(selectedStueck));
                        } else {
                            korrekt = false;
                        }
                        break;
                    case "Vegetariana":
                        if (selectedStueck != "0" && selectedGroesse =="klein"){
                            this._app._summe = this._app._summe + (Number(this._app.datenbank.getRecordById(3).preisKlein) * Number(selectedStueck));
                        } else if(selectedStueck != "0" && selectedGroesse =="groß"){
                            this._app._summe = this._app._summe + (Number(this._app.datenbank.getRecordById(3).preisGross) * Number(selectedStueck));
                        } else {
                            korrekt = false;
                        }
                        break;
                    case "Napoli":
                        if (selectedStueck != "0" && selectedGroesse =="klein"){
                            this._app._summe = this._app._summe + (Number(this._app.datenbank.getRecordById(4).preisKlein) * Number(selectedStueck));
                        } else if(selectedStueck != "0" && selectedGroesse =="groß"){
                            this._app._summe = this._app._summe + (Number(this._app.datenbank.getRecordById(4).preisGross) * Number(selectedStueck));
                        } else {
                            korrekt = false;
                        }
                        break;
                    case "Prosciutto":
                        if (selectedStueck != "0" && selectedGroesse =="klein"){
                            this._app._summe = this._app._summe + (Number(this._app.datenbank.getRecordById(5).preisKlein) * Number(selectedStueck));
                        } else if(selectedStueck != "0" && selectedGroesse =="groß"){
                            this._app._summe = this._app._summe + (Number(this._app.datenbank.getRecordById(5).preisGross) * Number(selectedStueck));
                        } else {
                            korrekt = false;
                        }
                        break;
                    case "Salami":
                        if (selectedStueck != "0" && selectedGroesse =="klein"){
                            this._app._summe = this._app._summe + (Number(this._app.datenbank.getRecordById(6).preisKlein) * Number(selectedStueck));
                        } else if(selectedStueck != "0" && selectedGroesse =="groß"){
                            this._app._summe = this._app._summe + (Number(this._app.datenbank.getRecordById(6).preisGross) * Number(selectedStueck));
                        } else {
                            korrekt = false;
                        }
                        break;
                }
            }
        }
        if (korrekt == false){
            textNode = "Ihre Angaben sind unvollständig.";
            newSpan.textContent = textNode;
        } else {
            newSpan.textContent = this._app._summe.toFixed(2) + "€";
        }
        newSpan.setAttribute("id", "preis");
        preisParent.replaceChild(newSpan, oldSpan);
    }

    _saveSession(){
        let zaehler = 0;
        let daten = new Array;
        let pizzaSorte, groesse, stueck, selectedPizzaSorte, selectedGroesse, selectedStueck;
        //Sessionspeicherung

        for(let i = 1; i <= this._app._ele_nr; i++) {
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

                let p = new Pizza;
                p.sorte = selectedPizzaSorte;
                p.groesse = selectedGroesse;
                p.stueck = selectedStueck;
                daten[i-1] = p;
            }
        }
        sessionStorage.clear();
        sessionStorage.setItem("daten", JSON.stringify(daten));
        console.log(JSON.parse(sessionStorage.getItem("daten")));
    }

}

class Pizza{
    constructor(sorte, groesse, stueck){
        this.sorte = sorte;
        this.groesse = groesse;
        this.stueck = stueck;
    }
}
