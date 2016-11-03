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
      setTimeout(function(){
        if (!consulta_exitosa){
          $("#modal-popup").modal('show');
        };
      }, 3000);

      // get_product(result.text);


      if ($('#alert').text().includes("Modo sin conexion")){
        products = JSON.parse(localStorage.getItem('products'));
        if (products){
          var product_found = false;
          $.each(products,function(pos,product){
            if (product.id == result.text){
              var testObject = { 'pid': result.text, 'pname': product.name, 'matchs': product.intolerances, 'ingredients': product.ingredients, 'image_route': "img/product_default.png"};
              localStorage.setItem('pdata', JSON.stringify(testObject));
              product_found = true;
              consulta_exitosa = true;
              if ($("#modal-popup").hasClass("in")){
                $("#modal-popup").modal('toggle');
              }
              send_alert('<b>Modo sin conexion activado</b>', "danger");
              window.location = "vista_producto.html";
              // return false;
            }
          });
          if (!product_found){ //si el producto no se encontraba en la base de datos local
            consulta_exitosa = true;
            if ($("#modal-popup").hasClass("in")){
              $("#modal-popup").modal('toggle');
            }
            send_alert('<b>Modo sin conexion activado</b>', "success");
            send_alert('El producto escaneado no se encuentra en su base de datos local, por lo que lo mas seguro es que <b>SI Puedes Comerlo</b> <span class="fa fa-thumbs-o-up" aria-hidden="true"></span>','success');
            location.reload();
          }
        }
        else{
          consulta_exitosa = true;
          if ($("#modal-popup").hasClass("in")){
            $("#modal-popup").modal('toggle');
          }
          send_alert('<b>Modo sin conexion activado</b>', "danger");
          send_alert('<b>Error</b> debes descargar el modo sin conexión para poder realizar busquedas sin acceso a internet', 'danger');
          location.reload();
        }
      }
      else{
        match_product(result.text);

        if (pname){
          consulta_exitosa = true;
          if ($("#modal-popup").hasClass("in")){
            $("#modal-popup").modal('toggle');
          }
          var testObject = { 'pid': result.text, 'pname': pname, 'matchs': matchs, 'ingredients': ingredients, 'image_route': image_route};
          localStorage.setItem('pdata', JSON.stringify(testObject));
          window.location = "vista_producto.html";
        }
        else{
          localStorage.removeItem('alert_data'); //ya que el match_product envia ese alert
          var testObject = { 'pid': result.text };
          localStorage.setItem('pdata', JSON.stringify(testObject));
          window.location = "producto_no_encontrado.html";
        }

      }

    },
    function (error) {
        // alert("Scanning failed: " + error);
        // alert("Ops, el escaneo ha fallado, por favor intentalo nuevamente");
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



// function get_product(id){
//   var settings = {
//     "async": true,
//     "crossDomain": true,
//     "url": "http://"+url_server+"/products/"+id,
//     "headers": {
//       "cache-control": "no-cache",
//       "postman-token": "81b17c9b-b428-8799-911e-b183185f6434"
//     },
//     "method": "GET",
//     error: function(resp, status){
//       if (resp.status==0){
//         $("#modal-popup").modal('show');
//         setTimeout(function(){
//           get_product(id);
//         }, 1000);
//       }
//       else{
//         consulta_exitosa = true;
//         send_alert(JSON.parse(resp.responseText).error, "danger");
//         location.reload();
//       }
//       // alert("Error, el producto no se encuentra disponible en nuestra base de datos.");
//     }
//   }

//   $.ajax(settings).done(function (response) {
//     consulta_exitosa = true;
//     if ($("#modal-popup").hasClass("in")){
//       $("#modal-popup").modal('toggle');
//     }
//     match_product(id);
//     var testObject = { 'pid': id, 'pname': pname, 'matchs': matchs, 'ingredients': ingredients, 'image_route': image_route};
//     localStorage.setItem('pdata', JSON.stringify(testObject));
//     window.location = "vista_producto.html";  

//   });

// }

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
    if (userdata){
      $("#profilePicture").attr("src", userdata.foto_de_perfil);
    }
    else{
      var foto_de_perfil = "http://"+url_server+response.user.avatar_file_name
      $("#profilePicture").attr("src", foto_de_perfil.replace("/original/","/thumb/"));
    }
  });
}

function modo_sin_conexion(){
  userdata = JSON.parse(localStorage.getItem('usuario'));
  if (userdata){
    setTimeout( function (){ //ni idea de porq el Timeout 0 pero es necesario para q se cargue la imagen
      $("#profilePicture").attr("src", userdata.foto_de_perfil);
    },0)
  }
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
