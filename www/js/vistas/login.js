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
    console.log(response);
    window.location = "perfil.html"
  });
}


function login_facebook(){
  var dis = this;
  $.oauth2({
    auth_url: 'https://www.facebook.com/dialog/oauth',
    response_type: 'token',
    client_id: '971158276296257', //aqui se debiera anotar el id de la api de puedo comerlo
    // redirect_uri: 'http://'+url_server+'/callback',
    redirect_uri: "http://"+url_server+"/sign_up",
    other_params: {scope: ['public_profile','email'], display: 'popup'},
    hidden: true
  }, function(token, response){
    console.log('token: '+token);
    console.log(JSON.stringify(response, null, 4));
    dis.register_provider(token,"facebook");
  }, function(error, response){
    console.log("error", response);
    alert("Error");
    navigator.notification.alert("Ocurrió un error iniciando sesión con Facebook, intenta nuevamente.", function(){}, "VivaBien", "Aceptar");
  });
}

function register_provider(access_token, provider){
  access_token = access_token.split("&")[0];
  //var dis = this;
  $.ajax({
      type: "POST",
      url: "http://"+url_server+"/social",
      data: {"access_token": access_token, "provider": provider},
      success: function(data){
      console.log("User Login");
      console.log(JSON.stringify(data));
      //dis.props.on_user_login(data.login);
    },
    error: function(data){
      console.log("Error login");
      console.log(JSON.stringify(data));
      alert("Error");
      // $("#errors-text").html(JSON.parse(data.responseText).error);
    }, 
      dataType: "json"
  });
}

function login_google(){
  $.oauth2({
        auth_url: 'https://accounts.google.com/o/oauth2/auth',
        response_type: 'token',
        logout_url: 'https://accounts.google.com/logout',
        client_id: '204037512129-h6sqi35uj0hqaivlruj40f8qcigon35j.apps.googleusercontent.com',
        // redirect_uri: "http://"+url_server+"/callback",
        redirect_uri: "http://"+url_server+"/sign_up",
        other_params: {scope: 'profile email'}
    }, function(token, response){
      console.log("Google Login", token, response);
        dis.register_provider(token,"google");
    }, function(error, response){
        navigator.notification.alert("Ocurrió un error iniciando sesión con Google, intenta nuevamente.", function(){}, "VivaBien", "Aceptar");
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
}

function get_my_data(){ //para verificar que no este ya conectado
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
    window.location = "perfil.html";
  });
}