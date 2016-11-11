$(function () {
  $('#login-submit').submit(function(e) {
    e.preventDefault();
  });
});


function login(){
  var form = new FormData();
  form.append("user[email]", $("#email").val());
  form.append("user[password]", $("#pass").val());

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://"+url_server+"/sign_in",
    "method": "POST",
    xhrFields: {
      withCredentials: true
    },
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "eb313cc6-dede-ad8a-fc17-2e83b68d2d4f"
    },
    "processData": false,
    "contentType": false,
    "mimeType": "multipart/form-data",
    "data": form,
    error: function(resp, status){
      // console.log(resp);
      // console.log(resp.status);
      if (resp.status==0){
        alert("Error, por favor comprueba tu conexión")
      }
      else{
        send_alert(JSON.parse(resp.responseText).error, "danger");
      }
      location.reload();
    }
  }

  $.ajax(settings).done(function (response) {
    // console.log(response);
    localStorage.removeItem("usuario");
    window.location = "perfil.html"
    activar_modo_tutorial();
  });
}


function register_provider(access_token, provider){
  access_token = access_token.split("&")[0];
  //var dis = this;
  // $.ajax({
  //   type: "POST",
  //   url: "http://"+url_server+"/social",
  //   data: {"access_token": access_token, "provider": provider},
  //   success: function(data){
  //     console.log("User Login");
  //     console.log(JSON.stringify(data));
  //     //dis.props.on_user_login(data.login);
  //   },
  //   error: function(data){
  //     console.log("Error login");
  //     console.log(JSON.stringify(data));
  //     alert("Error");
  //     // $("#errors-text").html(JSON.parse(data.responseText).error);
  //   }, 
  //     dataType: "json"
  // });
  var form = new FormData();
  form.append("provider", provider);
  form.append("token", access_token);

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://"+url_server+"/social",
    "method": "POST",
    xhrFields: {
      withCredentials: true
    },
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "88778089-88a8-77f6-126f-a88e2d7297a5"
    },
    "processData": false,
    "contentType": false,
    "mimeType": "multipart/form-data",
    "data": form,
    error: function(resp, status){
      if (resp.status==0){
        alert("Error, por favor comprueba tu conexión")
      }
      else{
        send_alert(JSON.parse(resp.responseText).error, "danger");
      }
      location.reload();
    }
  }

  $.ajax(settings).done(function (response) {
    // response: {logged_as: "[usuario]"}
    send_alert("Te has registrado satisfactoriamente con tu cuenta de "+provider, "success")
    stop_loading();
    window.location = "perfil.html";
    activar_modo_tutorial();
  });

}

function login_facebook(){
  $.oauth2({
    auth_url: 'https://www.facebook.com/dialog/oauth',
    response_type: 'token',
    client_id: '1041073662677910', //ok
    redirect_uri: "http://"+url_server.split(":")[0]+".xip.io:3000/callback",
    other_params: {scope: 'basic_info', display: 'popup'}
  }, function(token, response){
    loading("Iniciando sesion","Estamos Iniciando Sesion con tu cuenta de facebook",0);
    register_provider(token,"facebook");
  }, function(error, response){
    send_alert("Error al logearse con la red social");
    location.reload();
  });
}

function login_google(){
  $.oauth2({
    auth_url: 'https://accounts.google.com/o/oauth2/auth',
    response_type: 'token',
    logout_url: 'https://accounts.google.com/logout',
    client_id: '942948165956-d0hjrqdpbb1pmqe63i5n8iip1p02v1t0.apps.googleusercontent.com', //ok
    redirect_uri: "http://"+url_server.split(":")[0]+".xip.io:3000/callback",
    other_params: {scope: 'profile email'}
  }, function(token, response){
    loading("Iniciando sesion","Estamos Iniciando Sesion con tu cuenta de google",0);
    register_provider(token,"google");
  }, function(error, response){
    send_alert("Error al logearse con la red social");
    location.reload();
  });
}


function showhidepass(){
  if ($('#pass').attr('type') == 'password'){
    $('#pass').attr('type', 'text');
    $('#pass_conf').attr('type', 'text');
  }
  else{
    $('#pass').attr('type', 'password');
    $('#pass_conf').attr('type', 'password');
  }
  $(".glyphicon-eye-open").toggleClass("glyphicon-eye-close")
}

function get_my_data(){ //para verificar que no este ya conectado

  document.addEventListener("deviceready", onDeviceReady, false);
  function onDeviceReady() {
      window.open = cordova.InAppBrowser.open;
  }

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
      console.log("Nadie conectado");
    }
  }

  $.ajax(settings).done(function (response) {
    console.log("Conectado como", response)
    localStorage.removeItem("usuario");
    window.location = "perfil.html";
  });
}