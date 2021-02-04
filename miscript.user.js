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
            cargaContacto();
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
            cargarFourSquare();
        },
        error: function (errorMessage) {
            console.log("error_wikipedia");
            console.log(errorMessage);
        }
    });
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
    $("#datos_alcoi_museos").append($('<input>').attr('id', 'cb_recarga_electrica').attr('type', 'checkbox')).append('Recarga Electrica');
    $('#cb_recarga_electrica').change(function () {
        if (this.checked) {
            // cargar recarga_electrica en el mapa
            cargarOpenDataAlcoi("https://opendata.alcoi.org/data/dataset/64897e59-7fee-4511-9d5c-b8513ead0782/resource/c667d555-a05d-4cba-ac11-8172c0fbbdc3/download/recarga_electrica.kml", "recarga_electrica", tipo_punto.recarga_electrica);
        }
        else {
            borrarPuntosMapa('recarga_electrica');
        }
    });
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
    $("#datos_alcoi_museos").append($('<input>').attr('id', 'cb_clinica_privada').attr('type', 'checkbox')).append('Clínica privada');
    $('#cb_clinica_privada').change(function () {
        if (this.checked) {
            // cargar clinica_privada en el mapa
            cargarOpenDataAlcoi("https://opendata.alcoi.org/data/es/dataset/2810577f-9625-4dbc-ad29-cc1c82381399/resource/afb7dcc9-7171-42d2-90f0-c05efd3e49fc/download/clinica_privada.kml", "clinica_privada", tipo_punto.clinica_privada);
        }
        else {
            borrarPuntosMapa('clinica_privada');
        }
    });
    $("#datos_alcoi_museos").append($('<input>').attr('id', 'cb_centros_deportivos').attr('type', 'checkbox')).append('Centros Deportivos');
    $('#cb_centros_deportivos').change(function () {
        if (this.checked) {
            // cargar centros_deportivos en el mapa
            cargarOpenDataAlcoi("https://opendata.alcoi.org/data/dataset/73088621-45b9-41a0-9060-c90ab20daf76/resource/f461d0c0-8d6a-43df-b0fa-0c4437732c9a/download/deporte.kml", "centros_deportivos", tipo_punto.centros_deportivos);
        }
        else {
            borrarPuntosMapa('centros_deportivos');
        }
    });
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
    $("#datos_alcoi_museos").append($('<input>').attr('id', 'cb_puntos_wifi').attr('type', 'checkbox')).append('Puntos WIFI');
    $('#cb_puntos_wifi').change(function () {
        if (this.checked) {
            // cargar puntos_wifi en el mapa
            cargarOpenDataAlcoi("https://opendata.alcoi.org/data/dataset/87ffa879-1fe1-48e0-91e8-c1e04a1729ef/resource/7fca4f39-fff3-40dd-80fb-d8d905664882/download/puntoswifi.kml", "puntos_wifi", tipo_punto.puntos_wifi);
        }
        else {
            borrarPuntosMapa('puntos_wifi');
        }
    });
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

    });
}

function pintarPuntosMapa(conjunto_puntos, id_conjunto_puntos) {
    map.addSource(id_conjunto_puntos, {
        'type': 'geojson',
        'data': conjunto_puntos,
    });

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

    // evento click en el mapa
    // en los puntos que hay dibujados se abre un popup
    map.on('click', id_conjunto_puntos, function (e) {
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

        var popup_personalizado = "<strong>" + nombre + "</strong>" + mas_info;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popup_personalizado)
            .addTo(map);
    });

    // cambia el estilo del puntero si está en el popup
    map.on('mouseenter', id_conjunto_puntos, function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    // lo pone como estaba antes al salir del popup
    map.on('mouseleave', id_conjunto_puntos, function () {
        map.getCanvas().style.cursor = '';
    });
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
        resource_id: '783e0626-6fa8-4ac7-a880-fa53144654ff', // the resource id
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
                item_data_foursquare_properties['icon'] = tipo_punto.triangulo;
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
