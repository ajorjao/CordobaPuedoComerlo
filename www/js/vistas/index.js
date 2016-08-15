function escanear(){
  cordova.plugins.barcodeScanner.scan(
    function (result) {
        get_product(result.text);
    },
    function (error) {
        alert("Scanning failed: " + error);
    },
    {
        "preferFrontCamera" : false, // iOS and Android
        "showFlipCameraButton" : true, // iOS and Android
        "prompt" : "Coloque el codigo de barra frente a la camara", // supported on Android only
        // default: all but PDF_417 and RSS_EXPANDED
        //"orientation" : "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
    }
  );
};

function get_product(id){
  // $("#modal-popup").modal('show');
  // var request_ok = false;
  // var request_fail = false;

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
        alert("Error, por favor comprueba tu conexión")
      }
      else{
        alert(JSON.parse(resp.responseText).error)
      }
      // alert("Error, el producto no se encuentra disponible en nuestra base de datos.");
    }
  }

  $.ajax(settings).done(function (response) {
    alert(JSON.stringify(response, null, 4));
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
