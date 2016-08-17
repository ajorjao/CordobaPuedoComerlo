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
        alert(JSON.parse(resp.responseText).error)
      }
    }
  }

  $.ajax(settings).done(function (response) {
    console.log(response);
    window.location = "perfil.html"
  });
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

function go_crear_perfil(){
  window.location = "crear_perfil.html";
}
