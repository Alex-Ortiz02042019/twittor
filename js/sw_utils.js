function AptualizarCacheDinamico(DynamicCache,Request,Respuesta){

    if(Respuesta.ok){
            return caches.open(DynamicCache)
        .then(Cache =>{
            Cache.put(Request,Respuesta.clone());
            return Respuesta.clone();
        })
    }else{
        return Respuesta;
    }

}