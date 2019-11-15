"use strict";

/**
 * Zentrale Klasse für alle Datenbazugriffe. Diese Klasse versteckt die
 * Einzelheiten der Firebase-Datenbank vor dem Rest der Anwendung, indem
 * sie für alle benötigten Datenbankzugriffe eine Methode definiert, in der
 * der Zugriff auf Firebase ausprogrammiert wurde.
 *
 * Vgl. https://firebase.google.com/docs/firestore?authuser=0
 * Vgl. https://firebase.google.com/docs/firestore/query-data/get-data?authuser=0
 * Vgl. https://firebase.google.com/docs/firestore/query-data/get-data?authuser=0
 * Vgl. https://firebase.google.com/docs/firestore/query-data/get-data?authuser=0
 * Vgl. https://firebase.google.com/docs/firestore/query-data/get-data?authuser=0
 */
class Database {
    /**
     * Konstruktor. Hier wird die Verbindung zur Firebase-Datenbank
     * hergestellt.
     *
     * Vgl. https://firebase.google.com/docs/firestore/quickstart
     */
    constructor() {
        // Diese Informationen müssen aus der Firebase-Konsole ermittelt
        // werden, indem dort ein neues Projekt mit einer neuen Datenbank
        // angelegt und diese dann mit einer neuen App verknüpft wird.
            firebase.initializeApp({
                apiKey: "AIzaSyBvvY1ivHWBmIyY69AQK77LQ_kDCCRQ-kU",
                authDomain: "webprog-pizza-lieferservice.firebaseapp.com",
                databaseURL: "https://webprog-pizza-lieferservice.firebaseio.com",
                projectId: "webprog-pizza-lieferservice",
                storageBucket: "webprog-pizza-lieferservice.appspot.com",
                messagingSenderId: "948842043852",
                appId: "1:948842043852:web:026661354ccd6fabe3a569"
            });

            // Dieses Objekt dient dem eigentlichen Datenbankzugriff.
            // Dabei können beliebig viele "Collections" angesprochen werden,
            // die in etwa den Tabellen einer klassischen Datenbank entsprechen.
            this._db = firebase.firestore();
            this._bestellungen = this._db.collection("bestellungen");
            this._feedback = this._db.collection("feedback");
    }

    /**
     * Speichern einer neuen Bestellung
     */
    saveBestellung(bestellung) {
        this._bestellungen.doc().set(bestellung);
    }
    /**
     * Speichern von Feedback
     */
    saveFeedback(feedback){
        this._feedback.doc().set(feedback);
    }
}
