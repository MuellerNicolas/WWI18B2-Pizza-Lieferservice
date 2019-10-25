
class Bestellung{

    constructor{

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
