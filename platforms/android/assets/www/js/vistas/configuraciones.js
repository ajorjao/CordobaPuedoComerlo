var email = ""

function get_my_data(){
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
      window.location = "login.html";
    }
  }

  $.ajax(settings).done(function (response) {
    var foto_de_perfil = "http://"+url_server+response.user.avatar_file_name
    email = response.user.email
    $("#profilePicture").attr("src", foto_de_perfil.replace("/original/","/thumb/"));
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
      // console.log(resp);
      console.log("error al cerrar sesion");
      alert("Error al cerrar sesion, por favor comprueba tu conexión")
    }
  }


  var logout = confirm("¿Estás seguro que deseas cerrar sesion?");
  if (logout == true) {
    $.ajax(settings).done(function (response) {
      localStorage.removeItem('intolerancias-familia');
      window.location = "login.html";
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
      send_alert("<strong>Gracias por contactarnos</strong> Revisaremos tu mensaje y nos contactaremos contigo mediante el email de tu cuenta", "success");
      location.reload();
    });
  }
}