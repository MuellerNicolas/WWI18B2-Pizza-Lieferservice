window.addEventListener("load", () => {
    let countdown = document.getElementById("countdown");
    let running = false;
    let lastUpdate = 0;

    let stoppuhr = event => {
        let start = let now = Date.now();
        running = !running;
        lastUpdate = Date.now();
    };

    let displayAktualisieren = () => {
        let now = Date.now();

        if (now - lastUpdate >= 1000) {
            lastUpdate = now;

            if (running && counter > 0) {
                counter--;
            } else {
                running = false;
            }
        }
        countdown.textContent = counter;
        // Kontinuierliches Aufrufen der Funktion
        window.requestAnimationFrame(displayAktualisieren);
    };

    window.requestAnimationFrame(displayAktualisieren);
});
