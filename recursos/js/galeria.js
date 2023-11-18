// Esta función se ejecuta cuando el documento HTML se ha cargado completamente
$(function() {
    // Itera sobre todos los elementos con la clase "img-w"
    $(".img-w").each(function() {
        // Envuelve cada elemento en un div con la clase "img-c"
        $(this).wrap("<div class='img-c'></div>");

        // Obtiene la fuente de la imagen y la establece como fondo del elemento
        let imgSrc = $(this).find("img").attr("src");
        $(this).css('background-image', 'url(' + imgSrc + ')');
    });

    // Cuando se hace clic en un elemento con la clase "img-c"
    $(".img-c").click(function() {
        // Obtiene dimensiones y posición del elemento "img-c" clicado
        let w = $(this).outerWidth();
        let h = $(this).outerHeight();
        let x = $(this).offset().left;
        let y = $(this).offset().top;

        // Elimina cualquier elemento con la clase "active" que no sea el clicado
        $(".active").not($(this)).remove();

        // Clona el elemento clicado y lo coloca encima de este
        let copy = $(this).clone();
        copy.insertAfter($(this)).height(h).width(w).delay(500).addClass("active");

        // Ajusta la posición del elemento clonado
        $(".active").css('top', y - 8);
        $(".active").css('left', x - 8);

        // Agrega una clase "positioned" al elemento clonado con un retraso mínimo
        setTimeout(function() {
            copy.addClass("positioned");
        }, 0);
    });
});

// Cuando se hace clic en un elemento con la clase "img-c" que también tiene la clase "active"
$(document).on("click", ".img-c.active", function() {
    // Obtiene el elemento clicado
    let copy = $(this);

    // Remueve las clases "positioned" y "active" y agrega la clase "postactive"
    copy.removeClass("positioned active").addClass("postactive");

    // Elimina el elemento después de un retraso de 500 milisegundos
    setTimeout(function() {
        copy.remove();
    }, 500);
});
