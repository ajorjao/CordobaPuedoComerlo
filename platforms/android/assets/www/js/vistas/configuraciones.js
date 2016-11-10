var email = ""

function modo_sin_conexion(){
  setTimeout(function(){
    $('#alert .alert.alert-danger').append('<br>\
      Para poder utilizar este menú es necesario estar conectado.');
  },0);
  $('.btn').attr('disabled','true');
}

function get_my_data(){
  if (localStorage.getItem('products')){
    $('#modo-sin-conexion').html('<span class="fa fa-download" aria-hidden="true"></span> Actualizar modo sin conexión');
  }

  var settings = {
    "async": false,
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
        // alert("Error de conexión con el servidor, por favor intentelo mas tarde");
        // location.reload();
      }
      else{
        not_loged();
      }
    }
  }

  $.ajax(settings).done(function (response) {
    email = response.user.email //para enviar un mensaje de contactanos
    userdata = JSON.parse(localStorage.getItem('usuario'));
    if (!userdata){
      send_alert("Hubo un problema con los datos de tu usuario, lamentamos las inconveniencias", "warning");
      window.location = "perfil.html";
    }
  });
}

function preguntar_modo_sin_conexion(){
  userdata = JSON.parse(localStorage.getItem('usuario'));
  var form = new FormData();
  form.append("user_intolerances", userdata.intolerancias.toString());

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://"+url_server+"/ask_database",
    "method": "PUT",
    xhrFields: {
      withCredentials: true
    },
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "c33facb3-45ec-bd44-a593-be05c51cd614"
    },
    "processData": false,
    "contentType": false,
    "mimeType": "multipart/form-data",
    "data": form,
    error: function(resp, status){
      if (resp.status==0){
        alert("Error de conexión con el servidor, por favor intentelo mas tarde");
      }
      else{
        send_alert(JSON.parse(resp.responseText).error, "danger");
      }
      location.reload();
    }
  }

  $.ajax(settings).done(function (response) {
    // var ask_database = confirm("se descargaran "+(JSON.parse(response).size_products)+" caracteres entre los productos");
    productos_local = localStorage.products
    size_products = JSON.parse(response).size_products
    if (productos_local){
      // console.log("productos_local: "+productos_local.length)
      // console.log("response: "+size_products)
      if (productos_local.length == size_products){
        alert("Tu base de datos de productos ya está actualizada");
      }
      else{
        var ask_database = confirm("Deseas actualizar "+(Math.abs(size_products-productos_local.length)*8/1024).toFixed(2)+" KB con nuestros productos?");
        if (ask_database == true) {
          descargar_modo_sin_conexion(userdata.intolerancias.toString());
        }
      }
    }
    else{
      var ask_database = confirm("Deseas descargar "+(size_products*8/1024).toFixed(2)+" KB con nuestros productos?\nNOTA: En el modo sin conexión solo se verá la información básica del producto y si puedes comerlo o no.");
      if (ask_database == true) {
        descargar_modo_sin_conexion(userdata.intolerancias.toString());
      }
    }
  });
}

function descargar_modo_sin_conexion(user_intolerances){
  loading("Descargando","Por favor espere mientras descargamos el modo sin conexion en su dispositivo", 0);

  var form = new FormData();
  form.append("user_intolerances", user_intolerances);

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://"+url_server+"/download_database",
    "method": "PUT",
    xhrFields: {
      withCredentials: true
    },
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "c33facb3-45ec-bd44-a593-be05c51cd614"
    },
    "processData": false,
    "contentType": false,
    "mimeType": "multipart/form-data",
    "data": form,
    error: function(resp, status){
      if (resp.status==0){
        alert("Error de conexión con el servidor, por favor intentelo mas tarde");
      }
      else{
        send_alert(JSON.parse(resp.responseText).error, "danger");
      }
      location.reload();
    }
  }

  $.ajax(settings).done(function (response) {
    localStorage.removeItem('products');
    localStorage.setItem('products', response);
    // console.log("descargado "+ (productsss)+" KB");
    // console.log("descargado "+ (response.length*8/1024).toFixed(2)+" KB");
    send_alert("<b>Bien hecho!</b> Has descargado nuestros productos satisfactoriamente", "success");
    stop_loading();
    location.reload();
  });
}

function logout(){
  var settings = {
    "async": false,
    "crossDomain": true,
    "url": "http://"+url_server+"/sign_out",
    "method": "DELETE",
    xhrFields: {
      withCredentials: true
    },
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "0d3ea712-a98e-209b-6bcc-8b064906ed01"
    },
    error: function(resp, status){
      // console.log("error al cerrar sesion");
      // alert("Error al cerrar sesion, por favor comprueba tu conexión")
      if (resp.status==0){
        alert("Error de conexión con el servidor, por favor intentelo mas tarde");
      }
      else{
        send_alert(JSON.parse(resp.responseText).error, "danger");
      }
      location.reload();
    }
  }


  var logout = confirm("¿Estás seguro que deseas cerrar sesion?");
  if (logout == true) {
    $.ajax(settings).done(function (response) {
      not_loged();
    });
  }
}


function sendMail() {
  var form = new FormData();
  form.append("nombre", $("#name").val());
  form.append("mail", email);
  form.append("mensaje", $("#message").val());

  var settings = {
    "async": false,
    "crossDomain": true,
    "url": "http://"+url_server+"/sendemail",
    "method": "POST",
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "8b5643a5-12a1-00bb-f3fb-155a6197ace5"
    },
    "processData": false,
    "contentType": false,
    "mimeType": "multipart/form-data",
    "data": form,
    error: function(resp, status){
      if (resp.status==0){
        alert("Error de conexión con el servidor, por favor intentelo mas tarde");
      }
      else{
        send_alert(JSON.parse(resp.responseText).error, "danger");
      }
      location.reload();
    }
  }

  var confirmsend = confirm("¿Estas seguro que deseas enviar el mensaje?");
  if (confirmsend == true) {
    $.ajax(settings).done(function (response) {
      send_alert("<strong>Gracias por contactarnos.</strong> Revisaremos tu mensaje y nos contactaremos contigo mediante el email de tu cuenta.", "success");
      location.reload();
    });
  }
}