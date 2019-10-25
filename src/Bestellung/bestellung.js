
class Bestellung{

    constructor(app) {
        this._app = app;
    }

    addListItem () {
        var myLi = document.createElement('li');
        var myContent = document.createTextNode('Eine sehr dynamische Seite');
        myLi.appendChild(myContent);
        var Ausgabebereich = document.getElementById('pizzaAuswaehlen');
        Ausgabebereich.appendChild(myLi);
    }

    init () {
        var element  = document.getElementById ('addPizzaFromMenu');
        element.addEventListener ('click', addAChild);
    }

    document.addEventListener('DOMContentLoaded', init);
    }
