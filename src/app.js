/**
 * Klasse App: Steuert die Navigation innerhalb der Anwendung
 *
 * Diese Klasse ist sozusagen die Hauptklasse unserer Anwendung. Sie kümmert
 * sich darum, den richtigen Inhalt zu finden und einzublenden, den der
 * Anwender gerade sehen will, wobei der Inhalt selbst hierfür von anderen
 * Klassen bereitgestellt wird.
 */
class App {

    //// Funktionert so nicht!
    // database = new Database();
    // halloString = "Hallo, Welt";

    /**
     * Konstruktor. Im Parameter pages muss eine Liste mit den vorhandenen
     * Seiten der App übergeben werden. Die Liste muss folgendes Format haben:
     *
     *      [
     *          {
     *              url: "^/$"              // Regulärer Ausdruck zur URL
     *              klass: PageOverview     // Klasse zur Darstellung der Seite
     *          }, {
     *              url: "^/Details/(.*)$"  // Regulärer Ausdruck zur URL
     *              klass: PageDetails      // Klasse zur Darstellung der Seite
     *          },
     *          ...
     *      ]
     *
     * @param {String} title Anzuzeigender Name der App
     * @param {List} pages Definition der in der App verfügbaren Seiten
     */
    constructor(title, pages) {
        this._title = title;
        this._pages = pages;

        this.datenbank = new Datenbank();
        this.database = new Database();
        this._currentPageObject = null;

        //Variablen für das Tracking
        this._zaehler = 0;
        this._status = false;
        this._bestellt = false;
        this._aktiv = false;
        this._letztesUpdate = 0;
        this._ausgabe = "";
        //Variable für dynamische Bezeichnung der Reihen
        this._ele_nr = 1;

        //Array mit Pizzen der Bestellung
        this._pizzenArray;
        this._summe = 0;

        //Daten in der Session speichern
        this._daten;
    }

    run() {
        // Klick auf das Hamburger-Menu abfangen
        let menuIcon = document.querySelector("header nav .toggle-menu a");
        menuIcon.addEventListener("click", this.toggleHamburgerMenu);

        // Klick auf den Zurück-Pfeil abfangen
        let backIcon = document.querySelector("header nav .go-back a");
        backIcon.addEventListener("click", () => window.history.back());

        // Single Page Router starten und die erste Seite aufrufen
        window.addEventListener("hashchange", () => this._handleRouting());
        this._handleRouting();
    }

    toggleHamburgerMenu(event) {
        // Menü ein- oder ausblenden
        let menuList = document.querySelector("header nav .menu-right");

        if (menuList.classList.contains("small-screen-hidden")) {
            menuList.classList.remove("small-screen-hidden");
        } else {
            menuList.classList.add("small-screen-hidden");
        }

        // Weitere Behandlung des Click-Events unterbinden, da wir hier keine
        // neue Seite anfordern wollen.
        if (event) {
            event.preventDefault();
        }
    }

    /**
     * Diese Methode wertet die aktuelle URL aus und sorgt dafür, dass die
     * dazu passende App-Seite geladen und angezeigt wird. Der Einfachheit
     * halber wird eine sog. Hash-URL verwendet, bei der die aufzurufende
     * Seite nach einem #-Zeichen stehen muss. Zum Beispiel:
     *
     *   http://localhost:8080/index.html#/Detail/1234
     *
     * Hier beschreibt "/Detail/1234" den Teil der URL mit der darzustellenden
     * Seite. Der Vorteil dieser Technik besteht darin, dass ein Link mit einer
     * solchen URL keine neue Seite vom Server lädt, wenn sich der vordere Teil
     * der URL (alles vor dem #-Zeichen) nicht verändert. Stattdessen wird
     * ein "hashchange"-Ereignis generiert, auf das wir hier reagieren können,
     * um die sichtbare Unterseite der App auszutauschen.
     *
     * Auf Basis der History-API und dem "popstate"-Ereignis lässt sich ein
     * noch ausgefeilterer Single Page Router entwickeln, der bei Bedarf auch
     * ohne das #-Zeichen in der URL auskommt. Dies würde jedoch sowohl mehr
     * Quellcode in JavaScript sowie eine spezielle Server-Konfiguration
     * erfordern, so dass der Server bei jeder URL immer die gleiche HTML-Seite
     * an den Browser schickt. Diesen Aufwand sparen wir uns deshalb hier. :-)
     */
    _handleRouting() {
        let pageUrl = location.hash.slice(1);

        if (pageUrl.length === 0) {
            pageUrl = "/";
        }

        let matches = null;
        let page = this._pages.find(p => matches = pageUrl.match(p.url));

        if (!page) {
            console.error(`Keine Seite zur URL ${pageUrl} gefunden!`);
            return;
        }

        this._currentPageObject = new page.klass(this);
        this._currentPageObject.show(matches);
    }

    /**
     * Angezeigten Titel der App-Seite setzen. Diese Methode muss von den
     * Page-Klassen aufgerufen werden, um den sichtbaren Titel einer Seite
     * festzulegen. Der Titel wird dann in der Titelzeile des Browsers sowie
     * im Kopfbereich der App angezeigt.
     *
     * Über das optionale Konfigurationsobjekt kann gesteuert werden, ob
     * neben dem Seitentitel ein Zurück-Button eingeblendet wird:
     *
     *      {
     *          isSubPage: true,
     *      }
     *
     * Der Zurück-Button wird nur eingeblendet, wenn isSubPage = true gesetzt
     * wird. Die Idee dahinter ist, dass eine App meistens eine zentrale
     * Startseite hat, von der aus in verschiedene Unterseiten verzweigt werden
     * kann. Jede von der Startseite aus direkt oder indirekt aufgerufene Seite
     * ist daher eine Unterseite mit Zurück-Button. Die Startseite hingegen als
     * Mutter aller Seiten besitzt keinen Zurück-Button.
     *
     * @param {String} title   Anzuzeigender Titel der App-Seite
     * @param {Object} options Detailoptionen zur Steuerung der Anzeige
     */
    setPageTitle(title, options) {
        // Optionen auswerten
        options = options ? options : {};
        let isSubPage = options.isSubPage ? options.isSubPage : false;

        // Titel setzen
        document.querySelectorAll(".page-name").forEach(e => e.textContent = title);
        document.title = `${title} – ${this._title}`;

        // Entscheiden, ob der Zurückbutton angezeigt wird, oder nicht
        if (isSubPage) {
            document.querySelector("header nav .go-back").classList.remove("hidden");
            document.querySelector("header nav .dont-go-back").classList.add("hidden");
        } else {
            document.querySelector("header nav .go-back").classList.add("hidden");
            document.querySelector("header nav .dont-go-back").classList.remove("hidden");
        }
    }

    /**
     * Seitenspezifischen CSS-Code aktivieren. Diese Methode muss von den
     * Page-Klassen aufgerufen werden, um seitenspezifische Stylesheet-Regeln
     * zu aktivieren. Das Stylesheet muss hierfür als String übergeben werden.
     *
     * @param {String} css Seitenspezifischer CSS-Code
     */
    setPageCss(css) {
        document.querySelector("#page-css").innerHTML = css;
    }

    /**
     * Austauschen des Inhalts im Hauptbereich der App. Diese Methode muss
     * von den Page-Klassen aufgerufen werden, um etwas im Hauptbereich der
     * App anzuzeigen. Hierfür muss ein (ggf. dynamisch nachgeladenes)
     * HTML-Element mit dem anzuzeigenden Inhalt übergeben werden.
     *
     * BEACHTE: Nicht das HTML-Element selbst, sondern seine Kindelemente
     * werden in der App angezeigt. Somit werden Probleme vermieden, wenn
     * das nachgeladene Element selbst ein <header> oder <main> ist, für
     * dass in der app.css bereits globale Layoutoptionen definiert sind.
     *
     * @param {HTMLElement} element HTML-Element mit dem anzuzeigenden Inhalt
     */
    setPageContent(element) {
        let container = document.querySelector("#app-main-area");
        container.innerHTML = "";

        if (!element) return;
        let len = element.childNodes.length;

        for (var i = 0; i < len; i++) {
            let child = element.childNodes[0];
            element.removeChild(child);
            container.appendChild(child);
        }
    }
}
