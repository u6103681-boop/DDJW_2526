load', function() {

    $("#play").click(function(){
        window.location.assign("./html/game.html");
    });
    $("#options").click(function(){
        console.error("Opció no implementada");
    });
    $("#saves").click(function(){
        console.error("Opció no implementada");
    });

    $("#exit").click(function(){
        console.warn("No es pot sortir!");
    });
});
