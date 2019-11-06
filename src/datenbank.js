"use strict";

/**
 * Klasse Database: Kümmert sich um die Datenhaltung der App
 *
 * Diese Klasse beinhaltet alle Datensätze der App. Entgegen dem Namen handelt
 * es sich nicht wirklich um eine Datenbank, da sie lediglich ein paar statische
 * Testdaten enthält. Ausgefeilte Methoden zum Durchsuchen, Ändern oder Löschen
 * der Daten fehlen komplett, könnten aber in einer echten Anwendung relativ
 * einfach hinzugefügt werden.
 */
class Datenbank {
    /**
     * Konstruktor.
     */
    constructor() {
        this._data = [
            {
                id:          1,
                img:        "info/pizzabilder/1.jpg",
                name:       "Pizza Margherita",
                beschr:     "Pizza mit hausgemachter Tomatensauce, frischem Basilikum und Mozarella",
                preisKlein: "5,50€",
                preisGross: "7,50€",
            },{
                id:          2,
                img:        "info/pizzabilder/2.jpg",
                name:       "Pizza Funghi",
                beschr:     "Pizza mit hausgemachter Tomatensauce, frische Champions und Mozarella",
                preisKlein: "6,00€",
                preisGross: "8,00€",
            },{
                id:          3,
                img:        "info/pizzabilder/3.jpg",
                name:       "Pizza Vegetariana",
                beschr:     "Pizza mit hausgemachter Tomatensauce, saisonalem Gemüse und Mozarella",
                preisKlein: "6,50€",
                preisGross: "8,50€",
            },{
                id:          4,
                img:        "info/pizzabilder/4.jpg",
                name:       "Pizza Napoli",
                beschr:     "Pizza mit hausgemachter Tomatensauce, Sardellen, Kapern, Oliven und Mozarella",
                preisKlein: "7,00€",
                preisGross: "9,00€",
            },{
                id:          5,
                img:        "info/pizzabilder/5.jpg",
                name:       "Pizza Prosciutto",
                beschr:     "Pizza mit hausgemachter Tomatensauce, rohem Schinken, frischem Rucola, Parmesan und Mozarella",
                preisKlein: "7,00€",
                preisGross: "9,00€",
            },{
                id:          6,
                img:        "info/pizzabilder/6.jpg",
                name:       "Pizza Salami",
                beschr:     "Pizza mit hausgemachter Tomatensauce, Salami und frischem Basilikum",
                preisKlein: "7,00€",
                preisGross: "9,00€",
            }
        ];
    }

    /**
     * Diese Methode sucht einen Datensazt anhand seiner ID in der Datenbank
     * und liefert den ersten, gefundenen Treffer zurück.
     *
     * @param  {Number} id Datensatz-ID
     * @return {Object} Gefundener Datensatz
     */
    getRecordById(id) {
        id = parseInt(id);
        return this._data.find(r => r.id === id);
    }

    /**
     * Diese Methode gibt eine Liste mit allen Datensätzen zurück.
     * @return {Array} Liste aller Datensätze
     */
    getAllRecords() {
        return this._data;
    }
}
