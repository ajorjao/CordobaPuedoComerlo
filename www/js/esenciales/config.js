var all_servers = ["192.168.1.35:3000","192.168.2.4:3000","10.6.40.153:3000","10.6.40.47:3000","10.6.43.204:3000","192.168.2.8:3000","localhost:3000"];

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

  read_alerts();

  if ($('#alert').text().includes("Modo sin conexion")){
    try {
      modo_sin_conexion();
    }
    catch(err) {
      // "no se soporta un modo sin conexion, ej en login & register"
    }

    $('#alert .alert.alert-danger button').remove()
    $('#alert .alert.alert-danger').append('\
      <button type="button" class="close" onclick="location.reload();">\
        <span class="fa fa-refresh" aria-hidden="true"></span>\
      </button>')
    dis_path = window.location.pathname.split("/").pop()
    if (dis_path == "login.html" || dis_path=="crear_perfil.html"){
      $('.alert b').text("");
      $('.alert b').append("ERROR: Necesitas conexion a internet");
      $('.alert').css("margin-bottom","0");
    }
    return;
  }

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
          // read_alerts();
          try {
            get_my_data();
          }
          catch(err) {
            // "no se requiere un get_my_data"
          }
        })
        pings.fail(function (response) {
          console.log("fail", url);
          // read_alerts();
          if (new_url == undefined && url_server==""){
            // if ($('#alert').text() == ""){ //se recarga la pagina si no hay conexion a internet y no se ha enviado la alerta
              send_alert('<b>Modo sin conexion activado</b>', "danger");
              if (window.location.pathname.split("/").pop()=="configuraciones.html"){
                send_alert('Para poder utilizar este menú es necesario estar conectado',"danger");
              }
              location.reload();
            // }
            // else{ //si el modo sin conexion esta activado (y el mensaje se esta mostrando)

            //   try {
            //     modo_sin_conexion();
            //   }
            //   catch(err) {
            //     // "no se soporta un modo sin conexion"
            //   }

            //   $('.alert.alert-danger button').remove()
            //   $('.alert.alert-danger').append('\
            //     <button type="button" class="close" onclick="location.reload();">\
            //       <span class="fa fa-refresh" aria-hidden="true"></span>\
            //     </button>')
            //   dis_path = window.location.pathname.split("/").pop()
            //   if (dis_path == "login.html" || dis_path=="crear_perfil.html"){
            //     $('.alert b').text("");
            //     $('.alert b').append("ERROR: Necesitas conexion a internet");
            //     $('.alert').css("margin-bottom","0");
            //   }
            // }
          }
        })
      }
    }, 1000)
  }
  else{
    pings = $.ajax(settings);
    pings.done(function (response) {
      url_server = url;
      console.log("Conected to", url_server);
      // read_alerts();
      try {
        get_my_data();
      }
      catch(err) {
        // "no se requiere un get_my_data"
      }
    })
  }
};

// para poder almacenar imagenes con local storage (la foto de perfil del usuario)
function toDataUrl(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.send();
}
// se usa:
// toDataUrl('http://example/url', function(base64Img) {
//   console.log(base64Img);
// });

function loading(accion, mensaje, delay){
  if (!$('#modal-loading').length){ //si no existe el modal, se crea
    $("body").append('\
      <div id="modal-loading" class="modal" role="dialog">\
        <div class="modal-dialog">\
          <div class="modal-content">\
            <div class="modal-header">\
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
              <h4 class="modal-title">'+accion+'</h4>\
            </div>\
            <div class="modal-body">\
              <h4>'+mensaje+'</h4>\
              <img src="img/loader2.gif" alt="HTML5 Icon" style="display: block;margin-left:auto;margin-right:auto;width:100px;height:100px;">\
            </div>\
          </div>\
        </div>\
      </div>\
    ');
  }

  setTimeout(function(){
    $("#modal-loading").modal('show');
    $('#modal-loading').css('margin-top',((window.screen.height)/2  - $('#modal-loading .modal-dialog').height()) + 'px')
  }, delay);
}

function stop_loading(){
  $('#modal-loading').modal("hide");
  $("#modal-loading").remove();
}



// el mensaje debe venir con el formato que se quiere mostrar... status debe ser: success, info, warning o danger
function send_alert(message, status){
  $('#alert').goTo();
  var exist_alert = localStorage.getItem('alert_data')
  if (exist_alert){
    append_on_alert(message);
  }
  else{
    // Guardar mensaje
    localStorage.setItem('alert_data', JSON.stringify({ 'alert_message': message, 'alert_status': status }));
  }
}

// para que se pueda agregar algo a una alerta ya existente
function append_on_alert(message){
  alert = JSON.parse(localStorage.getItem('alert_data'));
  localStorage.setItem('alert_data', JSON.stringify({ 'alert_message': alert.alert_message+'<br>'+message, 'alert_status': alert.alert_status }));
}

//se usa en el ping
function read_alerts(){
  // Ver mensaje
  var exist_alert = localStorage.getItem('alert_data')

  if (exist_alert){
    var alert_data = JSON.parse(exist_alert);
    message = alert_data.alert_message
    status = alert_data.alert_status

    console.log("Existe una alerta ("+status+"): "+message)
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

function not_loged(){
  localStorage.removeItem('usuario'); 
  localStorage.removeItem('pdata');
  localStorage.removeItem('comment_likes');
  localStorage.removeItem('product_denounces');
  window.location = "login.html";
}

//se hacen los pings
$(document).ready(function( $ ) {
  ping(all_servers.splice(0,1)[0]);


  setTimeout(function(){
    userdata = JSON.parse(localStorage.getItem('usuario'));
    if (userdata){
      $("#profilePicture").attr("src", userdata.foto_de_perfil);
    }
  }, 0)

  var filename = window.location.pathname.split("/").pop();
  var back = JSON.parse(localStorage.getItem('now'));
  if (back!=null){
    if (back.location!=filename){ // si no es el mismo archivo
      localStorage.setItem('back', JSON.stringify({'location': back.location}));
      localStorage.setItem('now', JSON.stringify({'location': filename}));
    }
    if (back.location=="login.html" || back.location=="crear_perfil.html" || back.location=="producto_no_encontrado.html"){
      localStorage.setItem('back', JSON.stringify({'location': "index.html"}));    
    }
  }
  else{
    localStorage.setItem('back', JSON.stringify({'location': "index.html"}));    
    localStorage.setItem('now', JSON.stringify({'location': filename}));
  }
});

//para poder hacer scrools hasta un elemento (uso: $('#mi_elemento').goTo())
(function($) {
    $.fn.goTo = function() {
        $('html, body').animate({
            scrollTop: ( $(this).offset().top -25 ) + 'px'
        }, 'fast');
        return this; // for chaining...
    }
})(jQuery);