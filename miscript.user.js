// ==UserScript==
// @name miscript
// @namespace amc252
// @version 0.1
// @author Alejandro Martinez
// @description Web aumentada de planificación de viajes
// @match https://www.alicanteturismo.com/*
// @grant none
// @require http://code.jquery.com/jquery-3.5.1.min.js
// ==/UserScript==

var $ = window.jQuery;

var tipo_punto = {
    museo: 'museum',
    parque: 'park',
    restaurante: 'restaurant',
    estacion_tren: 'rail',
    triangulo: 'triangle',
    recarga_electrica: 'charging-station', // este no funca
    centros_asistencia: 'doctor',
    centros_salud: 'hospital',
    clinica_privada: 'defibrillator', // este no funca
    centros_deportivos: 'volleyball', // este no funca
    hoteles: 'lodging',
    centros_educativos: 'school',
    estaciones_alcoi: 'rail-light',
    gasolineras: 'fuel',
    farmacias: 'pharmacy',
    autobuses: 'bus',
    policia: 'police',
    ruta_ovidi: 'marker',
    ruta_camilo_sesto: 'marker',
    ruta_industrial: 'marker',
    puntos_wifi: 'viewpoint', // este no funca
    piscinas_publicas: 'swimming',
    bar: 'bar',
    cafe: 'cafe',
    tienda: 'grocery',
    plaza: 'monument',
    panaderia: 'bakery',
    heladeria: 'ice-cream',
    gato: 'cat', // esto es la prueba de poner iconos propios
    cuadrado: 'square',
    sol: 'sun',
    nubes: 'clouds',
    parcialmente_nublado_dia: 'partly-cloudy-day',
    parcialmente_nublado_noche: 'partly-cloudy-night',
    nubes_relampago: 'cloud-lighting',
    lluvia_ligera: 'light-rain',
    lluvia: 'rain',
    parcialmente_nublado_lluvia: 'partly-cloudy-rain',
    nieve: 'snow',
    niebla_noche: 'fog-night',
    niebla_dia: 'fog-day',
    viento: 'wind',
};

var map;

// var proxy_cors = "https://cors-anywhere.herokuapp.com/";
var proxy_cors = "https://afternoon-oasis-49174.herokuapp.com/";


$(function () {
    $('#top-menu').append(
        $('<li>')
            .attr("id", "menu-item-alcoy")
            .append(
                $('<a>').attr('href', "https://www.alicanteturismo.com/alcoy").append(
                    $('<span>').attr('class', 'tab').append("Alcoy")
                ))
            .click(function () {
                // alert("alcoy");
            }));
    $('#top-menu').append(
        $('<li>')
            .attr("id", "menu-item-prueba")
            .append(
                $('<a>').attr('href', "https://www.alicanteturismo.com/prueba").append(
                    $('<span>').attr('class', 'tab').append("prueba")
                ))
            .click(function () {
                // var win = window.open("result.html");
                // $(win).load(function () {
                //     $("body").append("<p>Result</p>");
                // });
            }));
    $('#menu-item-161754 > .sub-menu').append(
        $('<li>')
            .attr("id", "menu-item-tiempo")
            .attr("class", "menu-item menu-item-type-post_type menu-item-object-page menu-item-tiempo")
            .append(
                $('<a>').attr('href', "https://www.alicanteturismo.com/tiempo").append(
                    $('<span>').attr('class', 'tab').append("Tiempo Alicante")
                ))
            .click(function () {
                alert("Tiempo Alicante");
                // var win = window.open("result.html");
                // $(win).load(function () {
                //     $("body").append("<p>Result</p>");
                // });
            }));
    $('#menu-item-161754 > .sub-menu').append(
        $('<li>')
            .attr("id", "menu-item-tiempo-alicante")
            .attr("class", "menu-item menu-item-type-post_type menu-item-object-page menu-item-tiempo-alicante")
            .append(
                $('<a>').attr('href', "https://www.alicanteturismo.com/tiempo-alicante").append(
                    $('<span>').attr('class', 'tab').append("Tiempo")
                ))
            .click(function () {
                alert("Tiempo");
                // var win = window.open("result.html");
                // $(win).load(function () {
                //     $("body").append("<p>Result</p>");
                // });
            }));

    // console.log("cargó todo");
});

$(document).ready(function () {
    var pathname = window.location.pathname;
    // alert(pathname);
    // alert("la pagina ha cargado");
    // si es igual a 0, el id post-0 no existe
    // este id es el que aparece cuando la página no existe
    // si no existe este id entonces ha cargado algún articulo
    if ($("#post-0").length != 0) {
        $("#post-0").remove();
        if (pathname == "/alcoy") {
            cargaAlcoy();
        }
    }
    else {
        // alert("si existe la pagina");
        if (pathname == "/contacto/") {
            // cargaContacto();
            cargarProvinciaRuta();

            setTimeout(
                function () {
                    // cargarTiempo();
                }, 1000);
        }
    }
});

$("#menu-item-162356").click(function () {
    // $("p").hide();
    // alert("contacto");
});

$("#menu-item-alcoy").click(function () {
    // alert("alcoy");
    // openPrint();
});

function cargaAlcoy() {
    // alert("en alcoy estoy");
    $("#left-area")
        .append($('<a>').attr('href', "https://es.wikipedia.org/wiki/Alicante").append(
            $('<span>').append("Enlace Wikipedia1")
        ))
        .append($('<div>').attr("id", "div_carga1"));

}

function cargaContacto() {
    //esto es porque desaparecen unas imagenes sin motivo
    $(".jetpack-lazy-image").removeAttr("data-lazy-src");
    $(".jetpack-lazy-image").removeAttr("srcset");

    $("#mapa-contacto").remove();

    $(".et_pb_row_2").empty();
    $(".et_pb_row_3").empty();
    $(".et_pb_row_1").empty();
    $(".et_pb_row_1")
        .append($('<a>').attr('href', "https://es.wikipedia.org/wiki/Alicante").append(
            $('<span>').append("Enlace Wikipedia1")
        ));

    $.ajax({
        url: "https://es.wikipedia.org/w/api.php?origin=*&format=json&action=parse&page=Alicante",
        type: "get",
        dataType: "jsonp",
        success: function (data) {
            // console.log("princiupio data");
            // console.log(data);
            // console.log("fin data");
            $(".et_pb_row_1").append($('<p>').append(data.parse.title));
            $(".et_pb_row_1").append('<hr>');


            // console.log(data.parse.images[6]);
            $.ajax({
                url: "https://es.wikipedia.org/w/api.php?origin=*&format=json&action=query&titles=File:" + data.parse.images[6] + "&prop=imageinfo&iiprop=url",
                type: "get",
                dataType: "jsonp",
                success: function (data_image) {
                    // console.log(data_image);
                    // console.log(data_image.query.pages[-1].imageinfo[0].url);

                    $("#image_wiki").append("ini foto");
                    $("#image_wiki").append($('<img>').attr('width', 150).attr("src", data_image.query.pages[-1].imageinfo[0].url));
                    $("#image_wiki").append("fin foto");
                },
                error: function (errorMessage) {
                    console.log("error_imagen");
                    console.log(errorMessage);
                }
            });
            $(".et_pb_row_1").append($('<div>').attr("id", "image_wiki"));
            $(".et_pb_row_1").append('<hr>');

            //carga el articulo entero de la wikipedia y lo pone bonito
            var markup = data.parse.text["*"];
            // var i = $('<div></div>').html(markup);
            // $(".et_pb_row_1").append(i);
            // $(".et_pb_row_1").append($('<div>').append(markup));
            $(".et_pb_row_1").append('<hr>');

            $(".et_pb_row_1").append($('<div>').attr("id", "datos_alcoi_museos"));
            $("#datos_alcoi_museos").append($('<div>').attr("id", "mapa").attr("style", 'height: 500px;background-color:#08c;width: 1000px;'));
            crearCheckBoxMapa();
            cargarMapa("mapa");

            $(".et_pb_row_1").append('<hr>');
            $(".et_pb_row_1").append($('<div>').attr("id", "datos_renfe_estaciones"));

            $(".et_pb_row_1").append('<hr>');
            // a veces carga muy rapido y se adelanta al mapa y por eso da error
            setTimeout(
                function () {
                    cargarFourSquare();
                    cargarYelp();
                    cargarHere();
                }, 1000);
        },
        error: function (errorMessage) {
            console.log("error_wikipedia");
            console.log(errorMessage);
        }
    });
}

function cargarProvinciaRuta() {

    //esto es porque desaparecen unas imagenes sin motivo
    $(".jetpack-lazy-image").removeAttr("data-lazy-src");
    $(".jetpack-lazy-image").removeAttr("srcset");

    $("#mapa-contacto").remove();

    $(".et_pb_row_2").empty();
    $(".et_pb_row_3").empty();
    $(".et_pb_row_1").empty();
    $("div.et_builder_inner_content, div.et_pb_gutters3")
        .prepend($(
            '<div class="et_pb_section et_pb_section_0 et_pb_with_background et_pb_fullwidth_section et_section_regular">' +
            '<section id="cabecera-fondo-imagen" class="et_pb_module et_pb_fullwidth_header et_pb_fullwidth_header_0 et_pb_bg_layout_dark et_pb_text_align_left">' +
            '<div class="et_pb_fullwidth_header_container left">' +
            '<div class="header-content-container center">' +
            '<div class="header-content">' +
            '<div class="et_pb_header_content_wrapper">' +
            '<h1 class="cabecera-home" style="text-align: center;">' +
            '<img class="icono-cabecera aligncenter" src="/wp-content/uploads/2018/06/MAS-INFORMACION-PRACTICAb.png"> Planifica tu ruta por la provincia de Alicante</h1>' +
            '<div style="clear: both; text-align: center;">&nbsp;</div>' +
            '<h4 style="text-align: center;">Indica la pronvicia y usa el buscador para trazar una ruta con la información sobre alojamientos, restaurantes, parques...</h4></div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="et_pb_fullwidth_header_overlay"></div>' +
            '<div class="et_pb_fullwidth_header_scroll"></div>'));

    $(".et_pb_row_1")
        .append($('<a>').attr('href', "https://es.wikipedia.org/wiki/Alicante").append(
            $('<span>').append("Enlace Wikipedia1")
        ));

}

function crearCheckBoxMapa() {
    //open data alcoi https://opendata.alcoi.org/es/
    $("#datos_alcoi_museos").append($('<input>').attr('id', 'cb_museos').attr('type', 'checkbox')).append('Museos');
    $('#cb_museos').change(function () {
        if (this.checked) {
            //cagar museos en el mapa
            cargarOpenDataAlcoi("https://opendata.alcoi.org/data/dataset/886eddf5-dd23-4d71-a498-b3ec2ed8cdab/resource/9baf3624-2862-4eaa-919c-630099e4663b/download/museus.kml", "museos", tipo_punto.museo);
        }
        else {
            borrarPuntosMapa('museos');
        }
    });
    $("#datos_alcoi_museos").append($('<input>').attr('id', 'cb_parques').attr('type', 'checkbox')).append('Parques');
    $('#cb_parques').change(function () {
        if (this.checked) {
            //cagar parques en el mapa
            cargarOpenDataAlcoi("https://opendata.alcoi.org/data/dataset/7386134f-5065-4470-8323-45fd076d7619/resource/387fdca3-a8a8-4dc0-91f8-2eb80c3e8933/download/parques.kml", "parques", tipo_punto.parque);
        }
        else {
            borrarPuntosMapa('parques');
        }
    });
    // $("#datos_alcoi_museos").append($('<input>').attr('id', 'cb_recarga_electrica').attr('type', 'checkbox')).append('Recarga Electrica');
    // $('#cb_recarga_electrica').change(function () {
    //     if (this.checked) {
    //         // cargar recarga_electrica en el mapa
    //         cargarOpenDataAlcoi("https://opendata.alcoi.org/data/dataset/64897e59-7fee-4511-9d5c-b8513ead0782/resource/c667d555-a05d-4cba-ac11-8172c0fbbdc3/download/recarga_electrica.kml", "recarga_electrica", tipo_punto.recarga_electrica);
    //     }
    //     else {
    //         borrarPuntosMapa('recarga_electrica');
    //     }
    // });
    $("#datos_alcoi_museos").append($('<input>').attr('id', 'cb_centros_asistencia').attr('type', 'checkbox')).append('Centros de Asistencia');
    $('#cb_centros_asistencia').change(function () {
        if (this.checked) {
            // cargar centros_asistencia en el mapa
            cargarOpenDataAlcoi("https://opendata.alcoi.org/data/dataset/8049b77a-580c-4944-9bbc-2c7cccbf45dc/resource/9b35456d-c852-4cab-b5ea-17aa451ae84a/download/asistencia.kml", "centros_asistencia", tipo_punto.centros_asistencia);
        }
        else {
            borrarPuntosMapa('centros_asistencia');
        }
    });
    $("#datos_alcoi_museos").append($('<input>').attr('id', 'cb_centros_salud').attr('type', 'checkbox')).append('Centros de Salud');
    $('#cb_centros_salud').change(function () {
        if (this.checked) {
            // cargar centros_salud en el mapa
            cargarOpenDataAlcoi("https://opendata.alcoi.org/data/dataset/727ad49c-137f-41dd-aaeb-3dca09a2d980/resource/8936a486-afbf-4c3d-84cc-14e686776305/download/centro_salud.kml", "centros_salud", tipo_punto.centros_salud);
        }
        else {
            borrarPuntosMapa('centros_salud');
        }
    });
    // $("#datos_alcoi_museos").append($('<input>').attr('id', 'cb_clinica_privada').attr('type', 'checkbox')).append('Clínica privada');
    // $('#cb_clinica_privada').change(function () {
    //     if (this.checked) {
    //         // cargar clinica_privada en el mapa
    //         cargarOpenDataAlcoi("https://opendata.alcoi.org/data/es/dataset/2810577f-9625-4dbc-ad29-cc1c82381399/resource/afb7dcc9-7171-42d2-90f0-c05efd3e49fc/download/clinica_privada.kml", "clinica_privada", tipo_punto.clinica_privada);
    //     }
    //     else {
    //         borrarPuntosMapa('clinica_privada');
    //     }
    // });
    // $("#datos_alcoi_museos").append($('<input>').attr('id', 'cb_centros_deportivos').attr('type', 'checkbox')).append('Centros Deportivos');
    // $('#cb_centros_deportivos').change(function () {
    //     if (this.checked) {
    //         // cargar centros_deportivos en el mapa
    //         cargarOpenDataAlcoi("https://opendata.alcoi.org/data/dataset/73088621-45b9-41a0-9060-c90ab20daf76/resource/f461d0c0-8d6a-43df-b0fa-0c4437732c9a/download/deporte.kml", "centros_deportivos", tipo_punto.centros_deportivos);
    //     }
    //     else {
    //         borrarPuntosMapa('centros_deportivos');
    //     }
    // });
    $("#datos_alcoi_museos").append($('<input>').attr('id', 'cb_hoteles').attr('type', 'checkbox')).append('Hoteles');
    $('#cb_hoteles').change(function () {
        if (this.checked) {
            // cargar hoteles en el mapa
            cargarOpenDataAlcoi("https://opendata.alcoi.org/data/dataset/1e3fd057-0b79-4997-9422-ae8f8a6e6ea2/resource/58182c8d-1806-45a5-bdfb-c8e427ba959e/download/hotels.kml", "hoteles", tipo_punto.hoteles);
        }
        else {
            borrarPuntosMapa('hoteles');
        }
    });
    $("#datos_alcoi_museos").append($('<input>').attr('id', 'cb_centros_educativos').attr('type', 'checkbox')).append('Centros Educativos');
    $('#cb_centros_educativos').change(function () {
        if (this.checked) {
            // cargar centros_educativos en el mapa
            cargarOpenDataAlcoi("https://opendata.alcoi.org/data/dataset/257d0a70-f8dd-4d6e-afe5-24f8d122ea03/resource/20b226d4-b1b7-49cc-a2f8-a6b76716c04b/download/colegios.kml", "centros_educativos", tipo_punto.centros_educativos);
        }
        else {
            borrarPuntosMapa('centros_educativos');
        }
    });
    $("#datos_alcoi_museos").append($('<input>').attr('id', 'cb_estaciones_alcoi').attr('type', 'checkbox')).append('Estaciones Alcoi');
    $('#cb_estaciones_alcoi').change(function () {
        if (this.checked) {
            // cargar estaciones_alcoi en el mapa
            cargarOpenDataAlcoi("https://opendata.alcoi.org/data/dataset/c2503a3a-b70d-4259-9b7d-27fe07b0d5ce/resource/347e3601-c328-4471-af77-0e0252735a0c/download/transportes.kml", "estaciones_alcoi", tipo_punto.estaciones_alcoi);
        }
        else {
            borrarPuntosMapa('estaciones_alcoi');
        }
    });
    $("#datos_alcoi_museos").append($('<input>').attr('id', 'cb_gasolineras').attr('type', 'checkbox')).append('Gasolineras');
    $('#cb_gasolineras').change(function () {
        if (this.checked) {
            // cargar gasolineras en el mapa
            cargarOpenDataAlcoi("https://opendata.alcoi.org/data/dataset/eaa35b18-783f-425f-be0d-e469188b487e/resource/20f0fcee-ca1d-4318-8f33-02c06ed0c7bb/download/gasolineras.kml", "gasolineras", tipo_punto.gasolineras);
        }
        else {
            borrarPuntosMapa('gasolineras');
        }
    });
    $("#datos_alcoi_museos").append($('<input>').attr('id', 'cb_farmacias').attr('type', 'checkbox')).append('Farmacias');
    $('#cb_farmacias').change(function () {
        if (this.checked) {
            // cargar farmacias en el mapa
            cargarOpenDataAlcoi("https://opendata.alcoi.org/data/dataset/cca2e6d6-6dd0-4f8e-9b8d-ae4b39bbbf4b/resource/5f8fa016-dc53-458f-af09-a8199bc6dd2c/download/farmacia.kml", "farmacias", tipo_punto.farmacias);
        }
        else {
            borrarPuntosMapa('farmacias');
        }
    });
    $("#datos_alcoi_museos").append($('<input>').attr('id', 'cb_autobuses').attr('type', 'checkbox')).append('Autobuses');
    $('#cb_autobuses').change(function () {
        if (this.checked) {
            // cargar autobuses en el mapa
            cargarOpenDataAlcoi("https://opendata.alcoi.org/data/dataset/51685e35-1a3b-4694-abd6-0e51dede36d0/resource/5831ce6b-f6b4-4265-a6d8-b91f994da0a6/download/bus.kml", "autobuses", tipo_punto.autobuses);
        }
        else {
            borrarPuntosMapa('autobuses');
        }
    });
    $("#datos_alcoi_museos").append($('<input>').attr('id', 'cb_policia').attr('type', 'checkbox')).append('Policia');
    $('#cb_policia').change(function () {
        if (this.checked) {
            // cargar policia en el mapa
            cargarOpenDataAlcoi("https://opendata.alcoi.org/data/dataset/6e95f359-2d97-4faf-9891-3ea11f1ae23e/resource/91f30501-7660-47ff-8f93-e0ddd609fac6/download/policia.kml", "policia", tipo_punto.policia);
        }
        else {
            borrarPuntosMapa('policia');
        }
    });
    $("#datos_alcoi_museos").append($('<input>').attr('id', 'cb_ruta_ovidi').attr('type', 'checkbox')).append('Ruta Ovidi');
    $('#cb_ruta_ovidi').change(function () {
        if (this.checked) {
            // cargar ruta_ovidi en el mapa
            cargarOpenDataAlcoi("https://opendata.alcoi.org/data/dataset/8bae00bc-bae7-4c10-93ad-3c6c6fb121c3/resource/f7ffb02f-3cf8-4629-801d-0dfeb1a32c7c/download/ruta_ovidi.kml", "ruta_ovidi", tipo_punto.ruta_ovidi);
        }
        else {
            borrarPuntosMapa('ruta_ovidi');
        }
    });
    $("#datos_alcoi_museos").append($('<input>').attr('id', 'cb_ruta_camilo_sesto').attr('type', 'checkbox')).append('Ruta Camilo Sesto');
    $('#cb_ruta_camilo_sesto').change(function () {
        if (this.checked) {
            // cargar ruta_camilo_sesto en el mapa
            cargarOpenDataAlcoi("https://opendata.alcoi.org/data/dataset/afebbf99-6580-488c-8538-9a8145de54a2/resource/871ab35c-3ed9-48b6-8f5c-ab40a08a5ef9/download/camilo_sesto.kml", "ruta_camilo_sesto", tipo_punto.ruta_camilo_sesto);
        }
        else {
            borrarPuntosMapa('ruta_camilo_sesto');
        }
    });
    $("#datos_alcoi_museos").append($('<input>').attr('id', 'cb_ruta_industrial').attr('type', 'checkbox')).append('Ruta Industrial');
    $('#cb_ruta_industrial').change(function () {
        if (this.checked) {
            // cargar ruta_industrial en el mapa
            cargarOpenDataAlcoi("https://opendata.alcoi.org/data/dataset/d9394450-5857-447a-8c8b-1a5c44656f0d/resource/d7c7728a-e7c4-4fa2-a1dc-c15f2a28cc51/download/ruta_industrial.kml", "ruta_industrial", tipo_punto.ruta_industrial);
        }
        else {
            borrarPuntosMapa('ruta_industrial');
        }
    });
    // $("#datos_alcoi_museos").append($('<input>').attr('id', 'cb_puntos_wifi').attr('type', 'checkbox')).append('Puntos WIFI');
    // $('#cb_puntos_wifi').change(function () {
    //     if (this.checked) {
    //         // cargar puntos_wifi en el mapa
    //         cargarOpenDataAlcoi("https://opendata.alcoi.org/data/dataset/87ffa879-1fe1-48e0-91e8-c1e04a1729ef/resource/7fca4f39-fff3-40dd-80fb-d8d905664882/download/puntoswifi.kml", "puntos_wifi", tipo_punto.puntos_wifi);
    //     }
    //     else {
    //         borrarPuntosMapa('puntos_wifi');
    //     }
    // });
    $("#datos_alcoi_museos").append($('<input>').attr('id', 'cb_piscinas_publicas').attr('type', 'checkbox')).append('Piscinas Públicas');
    $('#cb_piscinas_publicas').change(function () {
        if (this.checked) {
            // cargar piscinas_publicas en el mapa
            cargarOpenDataAlcoi("https://opendata.alcoi.org/data/dataset/d4543768-4d8d-42ab-a708-c1d4b68ae74d/resource/ba8e46cc-4018-4cee-94d8-b20e415b23df/download/piscinas_publicas.kml", "piscinas_publicas", tipo_punto.piscinas_publicas);
        }
        else {
            borrarPuntosMapa('piscinas_publicas');
        }
    });

    // open data renfe https://data.renfe.com/
    $("#datos_alcoi_museos").append($('<input>').attr('id', 'cb_estaciones').attr('type', 'checkbox')).append('Estaciones');
    $('#cb_estaciones').change(function () {
        if (this.checked) {
            cargarDataRenfeEstaciones(); //cargar estaciones en el mapa
        }
        else {
            borrarPuntosMapa('estaciones');
        }
    });
}

function cargarMapa(id_div_mapa) {
    //cargar mapa y sus cosas
    API_js_callback = "https://api.mapbox.com/mapbox-gl-js/v2.0.0/mapbox-gl.js";
    API_js_callback_css = "https://api.mapbox.com/mapbox-gl-js/v2.0.0/mapbox-gl.css";

    // var script = document.createElement('script');
    // script.src = API_js_callback;
    // var link = document.createElement('link');
    // link.href = API_js_callback_css;
    // link.rel = 'stylesheet';
    // var head = document.getElementsByTagName("head")[0];
    // (head || document.body).appendChild(script);
    // (head || document.body).appendChild(link);

    var script_mapbox_api = $("<script>").attr("src", API_js_callback)[0];
    // console.log(script_mapbox_api);
    var link_css_mapbox = $("<link />").attr("href", API_js_callback_css).attr("rel", 'stylesheet')[0];
    // console.log(link_css_mapbox);


    $("head")[0].append(script_mapbox_api);
    $("head")[0].append(link_css_mapbox);
    // console.log($("head")[0]);

    $.getScript('https://api.mapbox.com/mapbox-gl-js/v2.0.0/mapbox-gl.js', function () {
        // console.log("cargo el mapa")
        mapboxgl.accessToken = 'pk.eyJ1IjoiYW1jMjUyIiwiYSI6ImNramJuaXZ1dDA5emkyc3Aybzdna2wxZXUifQ.kbehf-GRfLRd1vt5UaRVQg';

        map = new mapboxgl.Map({
            container: id_div_mapa, // container id
            style: 'mapbox://styles/mapbox/streets-v10', // style URL
            // style: 'mapbox://styles/amc252/ckk5m88ne18qr18nx52qly643', //estilo propio sin labels
            center: [-0.4743200, 38.7054500], // starting position [lng, lat]
            zoom: 13 // starting zoom
        });

        $(".mapboxgl-control-container").remove();

        $("<style> .mapboxgl-popup { max-width: 400px; font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif; } </style>").appendTo("head");

        // Pintar los puntos (esto ya no va que he cambiado la forma del json)
        // $.each(alcoi_data["items"], function (n, item) {
        //     var longitud = item["coordinates"].split(",")[0];
        //     var latitud = item["coordinates"].split(",")[1];
        //     // console.log(longitud);
        //     // console.log(latitud);
        //     var marker = new mapboxgl.Marker({
        //         color: "#" + n + "F0F0F",
        //     })
        //         .setLngLat([longitud, latitud])
        //         .addTo(map);
        // });

        // cuando carga ya las layers del mapa
        var mapa_limpio = false;
        map.on('sourcedata', function (e) {
            if (e.isSourceLoaded) {
                // quitamos las layers referentes a cosas que ya marco, para que no salga duplicadas, ej: museos, estaciones, parques
                // console.log("ini layers");
                // console.log(map.getStyle().layers);
                if (!mapa_limpio) {
                    map.style.stylesheet.layers.forEach(function (layer) {
                        // el poi es point of interest, y es para quitar los iconos y etiquetas
                        if ((layer.id).toLowerCase().indexOf("poi") >= 0) {
                            // console.log(layer.id);
                            map.removeLayer(layer.id);
                        }
                    });
                    mapa_limpio = true;
                }
                // console.log('fin layers');
            }
        });
        // cargar una imagen como icono
        // map.on('load', function () {
        //     map.loadImage(
        //         'https://img.icons8.com/officel/2x/sun.png',
        //         function (error, image) {
        //             if (error) { throw error };
        //             map.addImage('sun', image);
        //         }
        //     );
        // });

        //cargar los iconos para que esten disponibles en el mapa
        var id_icono_tiempo = [
            'sun',
            'clouds',
            'partly-cloudy-day',
            'partly-cloudy-night',
            'cloud-lighting',
            'light-rain',
            'rain',
            'partly-cloudy-rain',
            'snow',
            'fog-night',
            'fog-day',
            'wind'
        ];

        id_icono_tiempo.forEach(function (id) {
            map.on('load', function () {
                map.loadImage(
                    'https://img.icons8.com/officel/2x/' + id + '.png',
                    function (error, image) {
                        if (error) { throw error };
                        map.addImage(id, image);
                    }
                );
            });
        })

        // cargarFourSquare();
    });
}

function pintarPuntosMapa(conjunto_puntos, id_conjunto_puntos) {

    map.addSource(id_conjunto_puntos, {
        'type': 'geojson',
        'data': conjunto_puntos,
    });

    // if (map._container.id === "mapa_tiempo") {
    if (id_conjunto_puntos === "info_tiempo") {
        map.addLayer({
            'id': id_conjunto_puntos,
            'type': 'symbol',
            'source': id_conjunto_puntos,
            'layout': {
                'icon-image': '{icon}',
                'icon-allow-overlap': true,
                'icon-size': 0.25,
                'text-allow-overlap': true,
                'text-field': '{nombre}',
                'text-size': 16,
                'text-variable-anchor': ['left'],
                'text-radial-offset': 1,
                'text-justify': 'center',
            }
        });
    } else {
        map.addLayer({
            'id': id_conjunto_puntos,
            'type': 'symbol',
            'source': id_conjunto_puntos,
            'layout': {
                'icon-image': '{icon}-15',
                'icon-allow-overlap': true,
                // 'text-allow-overlap': true,
                // 'text-field': '{nombre}',
                'text-size': 12,
                'text-variable-anchor': ['top'],
                'text-radial-offset': 0.5,
                'text-justify': 'center',
            }
        });
    }

    var popup_personalizado = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    // evento click en el mapa
    // en los puntos que hay dibujados se abre un popup
    // map.on('click', id_conjunto_puntos, function (e) {
    map.on('mouseenter', id_conjunto_puntos, function (e) {

        map.getCanvas().style.cursor = 'pointer';

        var coordinates = e.features[0].geometry.coordinates.slice();
        var nombre = e.features[0].properties.nombre;
        var direccion = e.features[0].properties.direccion;
        var info_adicional = e.features[0].properties.info_adicional;
        var bool_direccion = true;
        var bool_info_adicional = true;
        if (typeof direccion === 'undefined') {
            direccion = '';
            bool_direccion = false;
        }
        if (typeof info_adicional === 'undefined') {
            info_adicional = '';
            bool_info_adicional = false;
        }
        var mas_info = '';
        if (bool_direccion && bool_info_adicional) {
            mas_info = "<p>" + direccion + "<br>" + info_adicional + "</p>";
        } else if (!bool_direccion && bool_info_adicional) {
            mas_info = "<p>" + info_adicional + "</p>";
        } else if (bool_direccion && !bool_info_adicional) {
            mas_info = "<p>" + direccion + "</p>";
        }

        var popup_personalizado_descripcion = "<strong>" + nombre + "</strong>" + mas_info;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // new mapboxgl.Popup()
        //     .setLngLat(coordinates)
        //     .setHTML(popup_personalizado)
        //     .addTo(map);

        popup_personalizado.setLngLat(coordinates).setHTML(popup_personalizado_descripcion).addTo(map);
    });

    // cambia el estilo del puntero si está en el popup
    // map.on('mouseenter', id_conjunto_puntos, function () {
    //     map.getCanvas().style.cursor = 'pointer';
    // });

    // lo pone como estaba antes al salir del popup
    map.on('mouseleave', id_conjunto_puntos, function () {
        map.getCanvas().style.cursor = '';
        popup_personalizado.remove();
    });
}

function pintarInfoSitio(conjunto_sitios, id_div_texto) {
    console.log(conjunto_sitios);

    var tabla_sitios = $('<table>').addClass('foo');
    var fila = $('<tr>' +
        '<th>' + 'Nombre' + '</th>' +
        '<th>' + 'Dirección' + '</th>' +
        '<th>' + 'Info adicional' + '</th>' +
        '<th>' + 'Coordenadas' + '</th>' +
        '<th>' + 'Categoria' + '</th>' +
        '<th>' + 'Telefono' + '</th>' +
        '<th>' + 'Web' + '</th>' +
        '<th>' + 'Email' + '</th>' +
        '<th>' + 'Horario' + '</th>' +
        '</tr>'
    );
    tabla_sitios.append(fila);

    conjunto_sitios.features.forEach(function (sitio) {
        // $('#' + id_div_texto).append($('<p>').text("Nombre: " + sitio.properties.nombre));
        // $('#' + id_div_texto).append($('<p>').text("Dirección: " + sitio.properties.direccion));
        // $('#' + id_div_texto).append($('<p>').text("Info adicional: " + sitio.properties.info_adicional));
        // $('#' + id_div_texto).append($('<p>').text("Coordenadas: " + sitio.geometry.coordinates[0] + ", " + sitio.geometry.coordinates[0]));
        var telefonos = "";
        var webs = "";
        var correos = "";
        if (typeof sitio.properties.telefono !== "undefined") {
            sitio.properties.telefono.forEach(function (tlf) {
                telefonos += '<br>' + tlf;
            });
        }
        if (typeof sitio.properties.web !== "undefined") {
            sitio.properties.web.forEach(function (web) {
                webs += '<br>' + web;
            });
        }
        if (typeof sitio.properties.email !== "undefined") {
            sitio.properties.email.forEach(function (email) {
                correos += '<br>' + email;
            });
        }

        fila = $('<tr>' +
            '<td>' + sitio.properties.nombre + '</td>' +
            '<td>' + sitio.properties.direccion + '</td>' +
            '<td>' + sitio.properties.info_adicional + '</td>' +
            '<td>' + sitio.geometry.coordinates[0] + ", " + sitio.geometry.coordinates[1] + '</td>' +
            '<td>' + sitio.properties.categoria + '</td>' +
            '<td>' + telefonos + '</td>' +
            '<td>' + webs + '</td>' +
            '<td>' + correos + '</td>' +
            '<td>' + sitio.properties.horario + '</td>' +
            '</tr>'
        );
        tabla_sitios.append(fila);
    })
    $('#' + id_div_texto).append(tabla_sitios);
}

function borrarPuntosMapa(id_conjunto_puntos) {
    map.removeLayer(id_conjunto_puntos);
    map.removeSource(id_conjunto_puntos);
}

function cargarOpenDataAlcoi(url_open_data_alcoi, id_conjunto_datos, icono_conjunto) {
    $.ajax({
        url: proxy_cors + url_open_data_alcoi,
        type: "get",
        dataType: "xml",
        success: function (data) {

            // console.log(data);
            var alcoi_data = {};
            alcoi_data['categoria'] = id_conjunto_datos;
            alcoi_data['type'] = 'FeatureCollection';
            alcoi_data['features'] = [];
            $(data).find('Folder').each(function () {
                $(this).find('Placemark').each(function () {
                    var item_data = {}
                    var item_data_properties = {}
                    item_data_properties['icon'] = icono_conjunto;
                    item_data_properties['info_adicional'] = "";
                    $(this).find('SimpleData').each(function () {
                        if (
                            ($(this).attr('name').toLowerCase() === 'nombre') ||
                            ($(this).attr('name').toLowerCase() === 'unidad') ||
                            ($(this).attr('name').toLowerCase() === 'descripcio') ||
                            ($(this).attr('name').toLowerCase() === 'tipo')
                        ) {
                            item_data_properties['nombre'] = $(this).text();
                        }
                        else if (($(this).attr('name').toLowerCase() === 'direccion') || ($(this).attr('name').toLowerCase() === 'dirección')) {
                            item_data_properties['direccion'] = $(this).text();
                        }
                        else if ($(this).attr('name') !== 'id') {
                            item_data_properties['info_adicional'] += $(this).text() + " <br>";
                        }
                    });
                    item_data['properties'] = item_data_properties;

                    $(this).find('coordinates').each(function () {
                        item_data['geometry'] = {
                            'type': 'Point',
                            'coordinates': []
                        };
                        item_data['geometry']['coordinates'][0] = parseFloat($(this).text().split(',')[0]);
                        item_data['geometry']['coordinates'][1] = parseFloat($(this).text().split(',')[1]);
                    });
                    alcoi_data['features'].push(item_data);

                });
            });
            // console.log("generico");
            // console.log(id_conjunto_datos);
            // console.log(alcoi_data);
            pintarPuntosMapa(alcoi_data, id_conjunto_datos); //pintamos los parques en el mapa
        },
        error: function (errorMessage) {
            console.log("error open data alcoi parques");
            console.log(errorMessage);
        }
    });
}

function cargarDataRenfeEstaciones() {
    $('#datos_renfe_estaciones').append($('<p>').text("hola"));

    var data = {
        // resource_id: '783e0626-6fa8-4ac7-a880-fa53144654ff', // estaciones renfe en alicante
        resource_id: '5b7b1ca8-f14e-481a-8775-bc2afba666f1', //cercanias renfe
        // limit: 5, // get 5 results
        q: 'alicante/alacant' // query for 'alicante/alacant'
    };

    var data_renfe_estaciones = {};
    data_renfe_estaciones['categoria'] = 'estaciones';
    data_renfe_estaciones['type'] = 'FeatureCollection';
    data_renfe_estaciones['features'] = [];
    $.ajax({
        url: proxy_cors + "https://data.renfe.com/api/3/action/datastore_search",
        type: "get",
        data: data,
        dataType: 'json',
        success: function (data) {
            // console.log('ini data renfe');
            // console.log(data);
            // console.log('bucle data renfe');

            for (i = 0; i < data.result.records.length; i++) {
                // console.log(data.result.records[i]);
                var item_data_renfe_estaciones = {};
                var item_data_renfe_estaciones_properties = {};
                item_data_renfe_estaciones_properties['icon'] = tipo_punto.estacion_tren;
                var item_data_renfe_estaciones_geometry = {};
                item_data_renfe_estaciones_properties['direccion'] = data.result.records[i]['DIRECCIÓN'];
                item_data_renfe_estaciones_properties['nombre'] = 'Estación/Estació: ' + data.result.records[i]['DESCRIPCION'];
                item_data_renfe_estaciones_properties['info_adicional'] = data.result.records[i]['POBLACION'];
                item_data_renfe_estaciones_geometry['type'] = 'Point';
                item_data_renfe_estaciones_geometry['coordinates'] = [data.result.records[i]['LONGITUD'], data.result.records[i]['LATITUD']];
                item_data_renfe_estaciones['properties'] = item_data_renfe_estaciones_properties;
                item_data_renfe_estaciones['geometry'] = item_data_renfe_estaciones_geometry;
                data_renfe_estaciones['features'].push(item_data_renfe_estaciones);
            }

            // console.log(data_renfe_estaciones);
            pintarPuntosMapa(data_renfe_estaciones, 'estaciones'); //pintamos las estaciones en el mapa

            // $('#datos_renfe_estaciones').append($('<p>').text(JSON.stringify(data_renfe_estaciones)));
            // console.log('fin data renfe');
        },
        error: function (errorMessage) {
            console.log("error_data_renfe");
            console.log(errorMessage);
        }
    });


    $('#datos_renfe_estaciones').append($('<p>').text("adios"));
}

function cargarFourSquare() {

    // coordenadas Alcoi
    var latitud = 38.7054500;
    var longitud = -0.4743200;
    var cliente_id = "OKZY1EOEOIBMIUKLFMRDYXP3WW4KX1WNJXVSUI30WNQQ352E";
    var cliente_secret = "IWDPT4VMHVLIMHHVQJHVWETBUDCSJIVH154OT2512LK3UQPX";
    $.ajax({
        url: 'https://api.foursquare.com/v2/venues/explore?' +
            'll=' + latitud + ',' + longitud +
            '&limit=30&client_id=' + cliente_id +
            '&client_secret=' + cliente_secret +
            '&v=20210204',
        type: "get",
        cache: false,
        dataType: 'jsonp',
        success: function (data) {
            // console.log("ini data foursquere");
            // console.log(data);
            // console.log(data.response.groups[0].items);
            // console.log("fin data foursquere");
            var foursquare_data = {};
            foursquare_data['categoria'] = "foursquare_data";
            foursquare_data['type'] = 'FeatureCollection';
            foursquare_data['features'] = [];
            for (i = 0; i < data.response.groups[0].items.length; i++) {
                var item_data_foursquare = {};
                var item_data_foursquare_properties = {};
                item_data_foursquare_properties['icon'] = clasificarCategoria((data.response.groups[0].items[i].venue.categories[0].name).toLowerCase());
                var item_data_foursquare_geometry = {};
                item_data_foursquare_properties['direccion'] = data.response.groups[0].items[i].venue.location.address;
                item_data_foursquare_properties['nombre'] = data.response.groups[0].items[i].venue.name;
                item_data_foursquare_properties['info_adicional'] = data.response.groups[0].items[i].venue.categories[0].name;

                item_data_foursquare_geometry['type'] = 'Point';
                item_data_foursquare_geometry['coordinates'] = [data.response.groups[0].items[i].venue.location.lng, data.response.groups[0].items[i].venue.location.lat];

                item_data_foursquare['properties'] = item_data_foursquare_properties;
                item_data_foursquare['geometry'] = item_data_foursquare_geometry;
                foursquare_data['features'].push(item_data_foursquare);
            }

            // console.log(foursquare_data);
            pintarPuntosMapa(foursquare_data, 'foursquare_data');
        },
        error: function (errorMessage) {
            console.log("error_data_foursquare");
            console.log(errorMessage);
        }
    });
}

function clasificarCategoria(nombre_icono) {
    var icono;
    if ((nombre_icono).includes("restaurant") ||
        (nombre_icono).includes("bistr") ||
        (nombre_icono).includes("pizz") ||
        (nombre_icono).includes("spanish") ||
        (nombre_icono).includes("italian") ||
        (nombre_icono).includes("mediterranean") ||
        (nombre_icono).includes("arro") ||
        (nombre_icono).includes("catalan") ||
        (nombre_icono).includes("chinese") ||
        (nombre_icono).includes("cuisine")) {
        icono = tipo_punto.restaurante;
    }
    else if ((nombre_icono).includes("pub") ||
        (nombre_icono).includes("bar")) {
        icono = tipo_punto.bar;
    }
    else if ((nombre_icono).includes("farmacia")) {
        icono = tipo_punto.farmacias;
    }
    else if ((nombre_icono).includes("caf") ||
        (nombre_icono).includes("coffee")) {
        icono = tipo_punto.cafe;
    }
    else if ((nombre_icono).includes("tienda")) {
        icono = tipo_punto.tienda;
    }
    else if ((nombre_icono).includes("hotel")) {
        icono = tipo_punto.hoteles;
    }
    else if ((nombre_icono).includes("médico")) {
        icono = tipo_punto.centros_salud;
    }
    else if ((nombre_icono).includes("parque")) {
        icono = tipo_punto.parque;
    }
    else if ((nombre_icono).includes("plaza")) {
        icono = tipo_punto.plaza;
    }
    else if ((nombre_icono).includes("baker")) {
        icono = tipo_punto.panaderia;
    }
    else if ((nombre_icono).includes("icecream")) {
        icono = tipo_punto.heladeria;
    }
    else if ((nombre_icono).includes("muse")) {
        icono = tipo_punto.museo;
    }
    else {
        icono = tipo_punto.triangulo;

        console.log("---");
        console.log(nombre_icono);
    }
    return icono;
}

function cargarYelp() {

    // coordenadas Alcoi
    var latitud = 38.7054500;
    var longitud = -0.4743200;
    var api_key = "NV-nvnwBNhxvr2fao_Zr5x9tmvBZ6Kw2f0FqEE_j677g9amElOmvcGgibpw9oJEhX8ctk-s9-fQHHwsYTemexCa_BRsfMVaEWFPxqBTNLi17YiYc5Ja1EaCb4HMdYHYx";
    $.ajax({
        url: proxy_cors + 'https://api.yelp.com/v3/businesses/search?latitude=' + latitud + '&longitude=' + longitud + '&limit=50', //&radius=40000
        // url: proxy_cors + 'https://api.yelp.com/v3/businesses/search?location=santa pola&limit=50',
        type: "get",
        dataType: 'json',
        headers: {
            'Authorization': 'Bearer ' + api_key,
        },
        success: function (data) {
            // console.log("ini data yelp");
            // console.log(data);
            // console.log("fin data yelp");
            var yelp_data = {};
            yelp_data['categoria'] = "yelp_data";
            yelp_data['type'] = 'FeatureCollection';
            yelp_data['features'] = [];
            for (i = 0; i < data.businesses.length; i++) {
                var item_data_yelp = {};
                var item_data_yelp_properties = {};
                item_data_yelp_properties['icon'] = clasificarCategoria((data.businesses[i].categories[0].alias).toLowerCase());
                // item_data_yelp_properties['icon'] = tipo_punto.triangulo;
                var item_data_yelp_geometry = {};
                item_data_yelp_properties['direccion'] = data.businesses[i].location.address1;
                item_data_yelp_properties['nombre'] = data.businesses[i].name;
                item_data_yelp_properties['info_adicional'] = data.businesses[i].categories[0].title;

                item_data_yelp_geometry['type'] = 'Point';
                item_data_yelp_geometry['coordinates'] = [data.businesses[i].coordinates.longitude, data.businesses[i].coordinates.latitude];

                item_data_yelp['properties'] = item_data_yelp_properties;
                item_data_yelp['geometry'] = item_data_yelp_geometry;
                yelp_data['features'].push(item_data_yelp);
            }

            // console.log(yelp_data);
            pintarPuntosMapa(yelp_data, 'yelp_data');
        },
        error: function (errorMessage) {
            console.log("error_data_yelp");
            console.log(errorMessage);
        }
    });
}

function cargarHere() {

    // coordenadas Alcoi
    var latitud = 38.7054500;
    var longitud = -0.4743200;
    var api_key = "3BMlnB66GYJQQWsXMr5WzcniU81_d_ENmTrOocHDUc0";

    // var palabra_buscar = "mueso";
    var palabra_buscar = "restaurante";

    $.ajax({
        url: 'https://discover.search.hereapi.com/v1/discover?in=circle:' + latitud + ',' + longitud + ';r=1000' + '&limit=100' + '&q=' + palabra_buscar + '&apiKey=' + api_key,
        type: "get",
        dataType: 'json',
        success: function (data) {
            console.log("ini data Here");
            console.log(data);
            console.log("fin data Here");

            var here_data = {};
            here_data['categoria'] = "here_data";
            here_data['type'] = 'FeatureCollection';
            here_data['features'] = [];
            for (i = 0; i < data.items.length; i++) {
                // if (i === 0 || (data.items[i].position.lng !== data.items[i - 1].position.lng && data.items[i].position.lat !== data.items[i - 1].position.lat)) 
                {
                    var item_data_here = {};
                    var item_data_here_properties = {};
                    // item_data_here_properties['icon'] = clasificarCategoria((data.items[i].categories[0].alias).toLowerCase());
                    item_data_here_properties['icon'] = tipo_punto.triangulo;
                    var item_data_here_geometry = {};
                    item_data_here_properties['nombre'] = data.items[i].title;
                    item_data_here_properties['direccion'] = data.items[i].address.street + " " + data.items[i].address.houseNumber + " " + data.items[i].address.city;
                    item_data_here_properties['info_adicional'] = data.items[i].categories[0].name;
                    item_data_here_properties['categoria'] = data.items[i].categories[0].name;
                    if (typeof data.items[i].contacts !== "undefined") {
                        if (typeof data.items[i].contacts[0].phone !== "undefined") {
                            var aux_array = [];
                            data.items[i].contacts[0].phone.forEach(function (tlf, indice) {
                                aux_array.push(tlf.value);
                            });
                            item_data_here_properties['telefono'] = aux_array;
                        }
                        if (typeof data.items[i].contacts[0].www !== "undefined") {
                            var aux_array = [];
                            data.items[i].contacts[0].www.forEach(function (web, indice) {
                                // item_data_here_properties['web' + indice] = web.value;
                                aux_array.push(web.value);
                            });
                            item_data_here_properties['web'] = aux_array;
                        }
                        if (typeof data.items[i].contacts[0].email !== "undefined") {
                            var aux_array = [];
                            data.items[i].contacts[0].email.forEach(function (email, indice) {
                                // item_data_here_properties['email' + indice] = email.value;
                                aux_array.push(email.value);
                            });
                            item_data_here_properties['email'] = aux_array;
                        }
                    }
                    if (typeof data.items[i].openingHours !== "undefined") {
                        var aux_horario = "";
                        data.items[i].openingHours[0].text.forEach(function (horario) {
                            aux_horario += " " + horario;
                        });
                        item_data_here_properties['horario'] = aux_horario;
                    }
                    else {
                        item_data_here_properties['horario'] = "";
                    }
                    // item_data_here_properties['web'] = data.items[i].contacts[0].www[0].value;
                    // item_data_here_properties['email'] = data.items[i].contacts[0].email[0].value;
                    // item_data_here_properties['horario'] = data.items[i].openingHours[0].text[0].text;

                    item_data_here_geometry['type'] = 'Point';
                    item_data_here_geometry['coordinates'] = [data.items[i].position.lng, data.items[i].position.lat];

                    item_data_here['properties'] = item_data_here_properties;
                    item_data_here['geometry'] = item_data_here_geometry;
                    here_data['features'].push(item_data_here);
                }
            }

            // console.log(here_data);
            pintarPuntosMapa(here_data, 'here_data');
            pintarInfoSitio(here_data, "datos_renfe_estaciones")
        },
        error: function (errorMessage) {
            console.log("error_data_Here");
            console.log(errorMessage);
        }
    });
}

function cargarTiempo() {
    //esto es porque desaparecen unas imagenes sin motivo
    // $(".jetpack-lazy-image").removeAttr("data-lazy-src");
    // $(".jetpack-lazy-image").removeAttr("srcset");

    // $("#mapa-contacto").remove();

    // $(".et_pb_row_2").empty();
    // $(".et_pb_row_3").empty();
    // $(".et_pb_row_1").empty();

    $.ajax({
        url: "https://es.wikipedia.org/w/api.php?origin=*&format=json&action=parse&page=Anexo:Municipios_de_la_provincia_de_Alicante",
        type: "get",
        dataType: "jsonp",
        success: function (data) {
            console.log("princiupio data");
            console.log(data);
            console.log("fin data");
            // $(".et_pb_row_1").append($('<p>').append(data.parse.title));
            // $(".et_pb_row_1").append('<hr>');


            // console.log(data.parse.images[6]);
            // $.ajax({
            //     url: "https://es.wikipedia.org/w/api.php?origin=*&format=json&action=query&titles=File:" + data.parse.images[6] + "&prop=imageinfo&iiprop=url",
            //     type: "get",
            //     dataType: "jsonp",
            //     success: function (data_image) {
            //         // console.log(data_image);
            //         // console.log(data_image.query.pages[-1].imageinfo[0].url);

            //         $("#image_wiki").append("ini foto");
            //         $("#image_wiki").append($('<img>').attr('width', 150).attr("src", data_image.query.pages[-1].imageinfo[0].url));
            //         $("#image_wiki").append("fin foto");
            //     },
            //     error: function (errorMessage) {
            //         console.log("error_imagen");
            //         console.log(errorMessage);
            //     }
            // });
            // $(".et_pb_row_1").append($('<div>').attr("id", "image_wiki"));
            // $(".et_pb_row_1").append('<hr>');

            $(".et_pb_row_1").append('<hr>');
            //carga el articulo entero de la wikipedia y lo pone bonito
            var markup = data.parse.text["*"];
            var i = $('<div></div>').html(markup);
            // $(".et_pb_row_1").append(i);
            $(".et_pb_row_1").append($('<div>').attr("id", "info_wiki").append(markup));
            $(".et_pb_row_1").append('<hr>');
            $("#info_wiki > .mw-parser-output").children().not(".wikitable").remove();
            // $(".wikitable").remove();

        },
        error: function (errorMessage) {
            console.log("error_wikipedia");
            console.log(errorMessage);
        }
    });

    var tiempo_data = {};
    tiempo_data['categoria'] = "tiempo_data";
    tiempo_data['type'] = 'FeatureCollection';
    tiempo_data['features'] = [];

    pushCiudadTiempo(tiempo_data, "03063", "Denia", "38.8407800", "0.1057400");
    pushCiudadTiempo(tiempo_data, "03100", "Parcent", "38.7450200", "-0.0644600");
    pushCiudadTiempo(tiempo_data, "03009", "Alcoy", "38.7054500", "-0.4743200");
    pushCiudadTiempo(tiempo_data, "03140", "Villena", "38.6373000", "-0.8656800");
    pushCiudadTiempo(tiempo_data, "03083", "Jijona", "38.5408600", "-0.5026300");
    pushCiudadTiempo(tiempo_data, "03031", "Benidorm", "38.5381600", "-0.1309800");
    pushCiudadTiempo(tiempo_data, "03066", "Elda", "38.4778300", "-0.7915700");
    pushCiudadTiempo(tiempo_data, "03105", "Pinoso", "38.4016400", "-1.0419600");
    pushCiudadTiempo(tiempo_data, "03014", "Alicante", "38.3451700", "-0.4814900");
    pushCiudadTiempo(tiempo_data, "03065", "Elche", "38.2621800", "-0.7010700");
    pushCiudadTiempo(tiempo_data, "03121", "SantaPola", "38.1916500", "-0.5658000");
    pushCiudadTiempo(tiempo_data, "03099", "Orihuela", "38.0848300", "-0.9440100");
    pushCiudadTiempo(tiempo_data, "03133", "Torrevieja", "37.9787200", "-0.6822200");

    var api_key_aemet = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbWMyNTJAZ2Nsb3VkLnVhLmVzIiwianRpIjoiYmZlYzQ1ZTQtZGJjMC00MzM2LWJjZTUtMzVmNWM4NDk3ODRiIiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE2MTMwNjE5OTAsInVzZXJJZCI6ImJmZWM0NWU0LWRiYzAtNDMzNi1iY2U1LTM1ZjVjODQ5Nzg0YiIsInJvbGUiOiIifQ.UHJNxiTqZCHD3p7AuKQsgamZi4_MLTvAR03xcci7g0w";

    var promesas = [];

    tiempo_data['features'].forEach(function (ciud) {
        var peticion = $.ajax({
            url: proxy_cors + "https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria/" + ciud['properties']['id'] + "?api_key=" + api_key_aemet,
            type: "get",
            async: true,
            crossDomain: true,
            headers: {
                "cache-control": "no-cache"
            },
            success: function (data) {
                var peticion_interna = $.ajax({
                    url: data.datos,
                    type: "get",
                    async: true,
                    crossDomain: true,
                    headers: {
                        "cache-control": "no-cache"
                    },
                    dataType: "json",
                    success: function (data_consulta) {
                        var hora_ahora = new Date().getHours();
                        var contador_horas = 0;
                        var peticion_interna_2 = data_consulta[0].prediccion.dia[0].estadoCielo.forEach(function (hora_dia) {
                            if (hora_dia.periodo == hora_ahora.toString()) {
                                ciud['properties']['direccion'] = hora_ahora + "h: " + hora_dia.descripcion;
                                ciud['properties']['icon'] = clasificarEstadoCielo(hora_dia.value);
                                contador_horas++;

                            }
                            else if (contador_horas > 0 && contador_horas < 4) {
                                ciud['properties']['direccion'] = ciud['properties']['direccion'] + "<br>" + (parseInt(hora_ahora + contador_horas)) + "h: " + hora_dia.descripcion;
                                contador_horas++;
                            }
                            // if (parseInt(hora_ahora) > 20) {

                            // }
                        });
                        promesas.push(peticion_interna_2);
                        for (dia = 0; contador_horas < 4; contador_horas++) {
                            var aux_hora_dia = data_consulta[0].prediccion.dia[1].estadoCielo[dia];
                            ciud['properties']['direccion'] = ciud['properties']['direccion'] + "<br>" + aux_hora_dia.periodo + "h: " + aux_hora_dia.descripcion;
                            dia++;
                        }
                    },
                    error: function (errorMessage) {
                        console.log("error_tiempo4");
                        console.log(errorMessage);
                    }
                });
                promesas.push(peticion_interna);
            },
            error: function (errorMessage) {
                console.log("error_el_tiempo4");
                console.log(errorMessage);
            }
        });
        promesas.push(peticion);
    });

    Promise.all(promesas)
        .then(responseList => {
            setTimeout(
                function () {
                    pintarPuntosMapa(tiempo_data, "info_tiempo");
                }, 2000);
        });

    $.ajax({
        url: proxy_cors + "https://opendata.aemet.es/opendata/api/prediccion/provincia/hoy/03?api_key=" + api_key_aemet,
        type: "get",
        async: true,
        crossDomain: true,
        headers: {
            "cache-control": "no-cache"
        },
        success: function (data) {
            $.ajax({
                url: data.datos,
                type: "get",
                async: true,
                crossDomain: true,
                headers: {
                    "cache-control": "no-cache"
                },
                // dataType: "json",
                success: function (data_consulta) {
                    var data_array = data_consulta.split("ALACANT/ALICANTE");
                    var texto = "Información del tiempo:\n" + data_array[data_array.length - 1].split("TEMPERATURAS")[0];
                    var temperaturas = "TEMPERATURAS" + data_array[data_array.length - 1].split("TEMPERATURAS")[1];

                    var lineas_temperatura = temperaturas.split("\n");
                    // console.log(lineas_temperatura);
                    var tabla_temperaturas = $('<table>').addClass('foo');
                    var fila = $('<tr>' +
                        '<th>' + 'Ciudad' + '</th>' +
                        '<th>' + 'Mínima' + '</th>' +
                        '<th>' + 'Máxima' + '</th>' +
                        '</tr>'
                    );
                    tabla_temperaturas.append(fila);
                    for (i = 1; i < lineas_temperatura.length; i++) {
                        var linea_filtrada = lineas_temperatura[i].split(" ");
                        linea_filtrada = linea_filtrada.filter(function (v) { return v !== '' }); // para quitar lo elementos que son vacíos, porque al hacer el split, todos los espacios los añade como elemento vacío
                        if (linea_filtrada[0] !== undefined && linea_filtrada[0].trim()) {
                            fila = $('<tr>' +
                                '<td>' + linea_filtrada[0] + '</td>' +
                                '<td>' + linea_filtrada[1] + '</td>' +
                                '<td>' + linea_filtrada[2] + '</td>' +
                                '</tr>'
                            );
                            tabla_temperaturas.append(fila);
                        }
                    }

                    $(".et_pb_row_1").append('<hr>');
                    $(".et_pb_row_1").append($('<div>').attr("id", "info_temperatura").append(lineas_temperatura[0]));
                    $(".et_pb_row_1").append($('<div>').attr("id", "info_temperatura").append(tabla_temperaturas));
                    $(".et_pb_row_1").append('<hr>');
                },
                error: function (errorMessage) {
                    console.log("error_tiempo_escrito2");
                    console.log(errorMessage);
                }
            });
        },
        error: function (errorMessage) {
            console.log("error_el_tiempo_escrito");
            console.log(errorMessage);
        }
    });
}

function gradosADecimal(grados, minutos, segundos, direccion) {
    direccion.toUpperCase();
    var decimal = grados + minutos / 60 + segundos / (60 * 60);

    if (direccion == "S" || direccion == "W") {
        decimal = decimal * -1;
    }
    return decimal;
}

function pushCiudadTiempo(array, id, nombre, latitud, longitud) {

    var item_data_tiempo = {};
    var item_data_tiempo_properties = {};
    item_data_tiempo_properties['icon'] = tipo_punto.cuadrado;
    item_data_tiempo_properties['icon'] = tipo_punto.sol;
    var item_data_tiempo_geometry = {};
    item_data_tiempo_properties['direccion'] = "";
    item_data_tiempo_properties['nombre'] = nombre;
    item_data_tiempo_properties['id'] = id;
    item_data_tiempo_properties['info_adicional'] = "";

    item_data_tiempo_geometry['type'] = 'Point';
    item_data_tiempo_geometry['coordinates'] = [longitud, latitud];

    item_data_tiempo['properties'] = item_data_tiempo_properties;
    item_data_tiempo['geometry'] = item_data_tiempo_geometry;
    array['features'].push(item_data_tiempo);

    return array;
}

function clasificarEstadoCielo(codigo_estado) {

    switch (codigo_estado) {
        case "11": case "11n":
            return tipo_punto.sol;
        case "12": case "13": case "16": case "17":
            return tipo_punto.parcialmente_nublado_dia;
        case "12n": case "13n": case "16n": case "17n":
            return tipo_punto.parcialmente_nublado_noche;
        case "14": case "14n": case "15": case "15n":
            return tipo_punto.nubes;
        case "23": case "23n": case "24": case "24n": case "25": case "26":
            return tipo_punto.lluvia;
        case "43": case "43n":
            return tipo_punto.parcialmente_nublado_lluvia;
        case "44": case "44n": case "45": case "45n": case "46": case "46n":
            return tipo_punto.lluvia_ligera;
        case "51": case "51n": case "52": case "52n": case "53": case "54": case "61": case "61n": case "62": case "62n": case "63": case "64":
            return tipo_punto.nubes_relampago;
        case "71": case "71n": case "72": case "72n": case "73": case "74": case "33": case "33n": case "34": case "34n": case "35": case "36":
            return tipo_punto.nieve;
        case "81": case "82":
            return tipo_punto.niebla_dia;
        default:
            console.log(codigo_estado);
    }
}