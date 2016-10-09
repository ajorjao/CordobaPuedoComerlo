var all_servers = ["192.168.1.35:3000","10.6.40.153:3000","10.6.43.204:3000","192.168.2.8:3000","localhost:3000"];

var url_server = ""
var settings = {}

function set_settings(url_server){
	settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": "http://"+url_server+"/ping",
	  "method": "GET",
	  "headers": {
	    "cache-control": "no-cache",
	    "postman-token": "4b2b1c69-8975-b182-c74e-f196b3ed57d3"
	  },
	  "timeout": 1000
	}
}


// hace todos los ping consecutivamente
function ping(url){

  new_url = all_servers.splice(0,1)[0];
  if (new_url!=undefined && url_server=="") {
    setTimeout( function(){
      ping(new_url);
    }, 10);
  }

  set_settings(url);
  if (url == "localhost:3000"){
    setTimeout( function(){
      if (url_server==""){
        pings = $.ajax(settings);
        pings.done(function (response) {
          url_server = url;
          console.log("Conected to", url_server);
          read_alerts();
          try {
            get_my_data();
          }
          catch(err) {
            // "no se requiere un get_my_data"
          }
        })
        pings.fail(function (response) {
          console.log("fail", url);
          if (new_url == undefined && url_server==""){
            alert("Problema de conexion con el servidor");
            location.reload();
          }
        })
      }
    }, 500)
  }
  else{
    pings = $.ajax(settings);
    pings.done(function (response) {
      url_server = url;
      console.log("Conected to", url_server);
      read_alerts();
      try {
        get_my_data();
      }
      catch(err) {
        // "no se requiere un get_my_data"
      }
    })
    pings.fail(function (response) {
      console.log("fail", url);
      if (new_url == undefined && url_server==""){
        alert("Problema de conexion con el servidor");
        location.reload();
      }
    })
  }

};


// el mensaje debe venir con el formato que se quiere mostrar... status debe ser: success, info, warning o danger
function send_alert(message, status){
  // Guardar mensaje
  localStorage.setItem('alert_data', JSON.stringify({ 'alert_message': message, 'alert_status': status }));
}

function read_alerts(){
  // Ver mensaje
  var exist_alert = localStorage.getItem('alert_data')

  if (exist_alert){

    var alert_data = JSON.parse(exist_alert);
    message = alert_data.alert_message
    status = alert_data.alert_status

    console.log("Existe una alerta: "+message)
    localStorage.removeItem('alert_data');

    $("#alert").html('\
      <div class="alert alert-'+status+' alert-dismissible fade in" role="alert">\
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">\
          <span aria-hidden="true">&times;</span>\
        </button>\
        '+message+'\
      </div>');
  }
}

$(document).ready(function( $ ) {
  ping(all_servers.splice(0,1)[0]);

  var filename = window.location.pathname.split("/").pop();
  var back = JSON.parse(localStorage.getItem('now'));
  if (back!=null){
    if (back.location!=filename){ // si no es el mismo archivo
      localStorage.setItem('back', JSON.stringify({'location': back.location}));
      localStorage.setItem('now', JSON.stringify({'location': filename}));
    }
    if (back.location=="login.html" || back.location=="crear_perfil.html"){
      localStorage.setItem('back', JSON.stringify({'location': "index.html"}));    
    }
  }
  else{
    localStorage.setItem('back', JSON.stringify({'location': "index.html"}));    
    localStorage.setItem('now', JSON.stringify({'location': filename}));
  }
  
});