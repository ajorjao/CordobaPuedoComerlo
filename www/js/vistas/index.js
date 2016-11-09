var consulta_exitosa = false;

function escanear(){
  cordova.plugins.barcodeScanner.scan(
    function (result) {

      if ($('#alert').text().includes("Modo sin conexion")){
        products = JSON.parse(localStorage.getItem('products'));
        if (products){
          var product_found = false;
          $.each(products,function(pos,product){
            if (product.id == result.text){
              var testObject = { 'pid': result.text, 'pname': product.name, 'matchs': product.intolerances, 'ingredients': product.ingredients, 'image_route': "img/Imagen_no_disponible.svg"};
              localStorage.setItem('pdata', JSON.stringify(testObject));
              product_found = true;
              window.location = "vista_producto.html";
            }
          });
          if (!product_found){ //si el producto no se encontraba en la base de datos local
            send_alert('El producto escaneado no se encuentra en su base de datos local, por lo que lo mas seguro es que <b>SI Puedes Comerlo</b> <span class="fa fa-thumbs-o-up" aria-hidden="true"></span>','success');
            location.reload();
          }
        }
        else{
          send_alert('<b>Error</b> debes descargar el modo sin conexión para poder realizar busquedas sin acceso a internet', 'danger');
          location.reload();
        }
      }
      else{
        loading("Buscando producto","Estamos verificando si puedes comer este producto", 1000);
        match_product(result.text);
      }

    },
    function (error) {
        // alert("Scanning failed: " + error);
        send_alert("<strong>Ops</strong> el escaneo ha fallado, por favor intentalo nuevamente", "danger");
        location.reload();
    },
    {
        "preferFrontCamera" : false, // iOS and Android
        "showFlipCameraButton" : true, // iOS and Android
        "prompt" : "Evite acercar demasiado la camara al codigo de barras y tenga en cuenta que no se refleje el brillo de la luz en el codigo", // supported on Android only
        // "prompt" : "Coloque el codigo de barra frente a la camara", // supported on Android only
        // default: all but PDF_417 and RSS_EXPANDED
        //"orientation" : "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
    }
  );
};



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
      if (resp.status==0){
        alert("Error de conexión con el servidor, por favor intentelo mas tarde");
        location.reload();
      }
      else{
        not_loged();
      }
    }
  }

  $.ajax(settings).done(function (response) {
    userdata = JSON.parse(localStorage.getItem('usuario'));
    if (!userdata){
      send_alert("Hubo un problema con los datos de tu usuario, lamentamos las inconveniencias", "warning");
      window.location = "perfil.html";
    }
  });
}

// function modo_sin_conexion(){
//   userdata = JSON.parse(localStorage.getItem('usuario'));
//   if (userdata){
//     setTimeout( function (){ //ni idea de porq el Timeout 0 pero es necesario para q se cargue la imagen
//       $("#profilePicture").attr("src", userdata.foto_de_perfil);
//     },0)
//   }
// }


function go_profile(){
  window.location = "perfil.html";
}

function go_search_id(){
  window.location = "busqueda_id.html";
}

function go_search_name(){
  window.location = "busqueda_nombre.html";
}
