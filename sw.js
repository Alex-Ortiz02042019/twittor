///Importacion de los recursos desde otro archivo
importScripts('js/sw_utils.js')


const Cache_Static = "Static_v2";
const Cache_Dynamic = "Dynamic_v1";
const Cache_Inmutable = "Inmutable_v1";

//App_Shell son todos los recursos necesario para el funcionamiento de mi aplicación
const App_Shell = [
    //'/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js'
];

const App_Shell_Inmutable = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
    'css/animate.css',
    "js/libs/jquery.js"
]
/*********************Proceso de instalacion del servidor */

self.addEventListener("install", function (Evento) {
    let Respuesta = new Promise(function (resolve, reject) {
        caches.open(Cache_Static)
            .then(SCache => {
                return SCache.addAll(App_Shell);///Inserto todos los datos necesarios para que funcione la aplicacion
            })
        caches.open(Cache_Inmutable)
            .then(ICache => {
                return ICache.addAll(App_Shell_Inmutable);
            })
        resolve();
    })


    Evento.waitUntil(Respuesta)
})

/******Permite eliminar todos los cache antiguos */
self.addEventListener("activate", function (Evento) {
    const EliminarAnterior = caches.keys()
        .then(Key => { //Recibo un array con todos lo cache que tengo almacenados
            Key.forEach(element => {///Realizo un recorrido por todos los Caches almacenados
                if (element !== Cache_Static && element.includes("Static")) {
                    return caches.delete(element);
                }
            });
        });
    Evento.waitUntil(EliminarAnterior)
})


/***********************Permite interceptar todas las peticiones que hace el servidor */

self.addEventListener('fetch', function (Evento) {
    //cache with network fallback
    const Respuesta = caches.match(Evento.request)
        .then(Resp => {
            if (Resp) {
                return Resp;
            }else{
                console.log(Evento.request.url)
                return fetch(Evento.request)
                    .then(DatoResp => {
                        return AptualizarCacheDinamico(Cache_Dynamic,Evento.request,DatoResp);
                    })
            }

        })
    Evento.respondWith(Respuesta)
})