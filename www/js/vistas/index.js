var consulta_exitosa = false;

jQuery(document).ready(function( $ ) {
    $( '#my-slider' ).sliderPro({
      forceSize:'fullWidth',
      fade:true,
      buttons:false,
      keyboard:false,
      touchSwipe:false,
      autoplayOnHover:'none',
    });
});

function escanear(){
  cordova.plugins.barcodeScanner.scan(
    function (result) {
      $( '#my-slider' ).sliderPro({
        forceSize:'fullWidth',
        fade:true,
        buttons:false,
        keyboard:false,
        touchSwipe:false,
        autoplayOnHover:'none',
      });
      get_product(result.text);
      setTimeout(function(){
        if (!consulta_exitosa){
          $("#modal-popup").modal('show');
        };
      }, 3000);
    },
    function (error) {
        // alert("Scanning failed: " + error);
        alert("Ops, el escaneo ha fallado, por favor intentalo nuevamente");
    },
    {
        "preferFrontCamera" : false, // iOS and Android
        "showFlipCameraButton" : true, // iOS and Android
        "prompt" : "Evite acercar demasiado la camara al codigo de barras", // supported on Android only
        // "prompt" : "Coloque el codigo de barra frente a la camara", // supported on Android only
        // default: all but PDF_417 and RSS_EXPANDED
        //"orientation" : "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
    }
  );
};



function get_product(id){
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://"+url_server+"/products/"+id,
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "81b17c9b-b428-8799-911e-b183185f6434"
    },
    "method": "GET",
    error: function(resp, status){
      // alert("Error, por favor comprueba tu conexión")
      // console.log(resp)
      // alert(JSON.stringify(resp, null, 4));
      if (resp.status==0){
        $("#modal-popup").modal('show');
        setTimeout(function(){
          get_product(id);
          // console.log("se intenta ejecutar nuevamente el get_product");
        }, 1000);
        // alert("Error, por favor comprueba tu conexión");
      }
      else{
        consulta_exitosa = true;
        alert(JSON.parse(resp.responseText).error)
      }
      // alert("Error, el producto no se encuentra disponible en nuestra base de datos.");
    }
  }

  $.ajax(settings).done(function (response) {
    consulta_exitosa = true;
    if ($("#modal-popup").hasClass("in")){
      $("#modal-popup").modal('toggle');
    }

    // RAFA, estas son las linea que debes borrar, debes hacer que se redirija a una nueva vista que contenga el producto q entrega la var "response"
      localStorage.myvariable = JSON.stringify(response, null, 4);
      window.location.replace("ver_producto.html");

      // console.log(JSON.stringify(response, null, 4));
    // fin comunicado a Rafa
  });

}

function get_my_data(){
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://"+url_server+"/user",
    "method": "GET",
    xhrFields: {
      withCredentials: true
    },
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "e75d6d1f-85a5-fdce-0ff6-704ff358920b"
    },
    error: function(resp, status){
      window.location = "login.html";
    }
  }

  $.ajax(settings).done(function (response) {
    var foto_de_perfil = "http://"+url_server+response.user.avatar_file_name
    $("#profilePicture").attr("src", foto_de_perfil);
  });
}

function go_profile(){
  window.location = "perfil.html";
}

function go_search_id(){
  window.location = "busqueda_id.html";
}

function go_search_name(){
  window.location = "busqueda_nombre.html";
}
