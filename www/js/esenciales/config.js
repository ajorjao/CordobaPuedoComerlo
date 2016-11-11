var all_servers = ["192.168.1.35:3000","192.168.2.4:3000","192.168.43.206:3000","10.6.40.153:3000","10.6.40.34:3000","10.6.40.47:3000","10.6.43.204:3000","192.168.2.8:3000","localhost:3000"];

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
    send_alert('<b>Modo sin conexion activado</b>', "danger");

    $('#alert .alert.alert-danger button').remove() //se elimina la x (no se puede "cerrar" el modo sin conexion)
    $('#alert .alert.alert-danger').append('\
      <button type="button" class="close" onclick="localStorage.removeItem(\'alert_data\'); location.reload();">\
        <span class="fa fa-refresh" aria-hidden="true"></span>\
      </button>') //se incluye un boton de "actualizar" para reemplazar el "cerrar"

    dis_path = window.location.pathname.split("/").pop()
    if (dis_path == "login.html" || dis_path=="crear_perfil.html"){
      // $('.alert b').text("");
      // $('.alert b').append("ERROR: Necesitas conexion a internet");
      $('.alert b').text("ERROR: Necesitas conexion a internet");
      $('.alert').css("margin-bottom","0");
    }
    return;
  }

  new_url = all_servers.splice(0,1)[0];
  if (new_url!=undefined && url_server=="") { //si quedan servers por verificar y aun ninguno sirve
    setTimeout( function(){
      ping(new_url);
    }, 10);
  }

  set_settings(url);
  if (url == "localhost:3000"){
    setTimeout( function(){ //se espera 1 seg para asegurarse que todas los otros servers se probaron
      if (url_server==""){ //si no se ha encontrado otro servidor que funcione
        pings = $.ajax(settings);
        pings.done(function (response) { // se conecta a localhost
          url_server = url;
          console.log("Conected to", url_server);
          try {
            get_my_data();
          }
          catch(err) {
            // "no se requiere un get_my_data"
          }
        })
        pings.fail(function (response) { // no hay un servidor usable (no se ejecuto el "rails s")
          console.log("fail", url);
          if (new_url == undefined && url_server==""){
            //se recarga la pagina si no hay conexion a internet y no se ha enviado la alerta
            send_alert('<b>Modo sin conexion activado</b>', "danger");
            // if (window.location.pathname.split("/").pop()=="configuraciones.html"){
            //   send_alert('Para poder utilizar este menú es necesario estar conectado',"danger");
            // }
            location.reload();
          }
        })
      }
    }, 1000)
  }
  else{
    pings = $.ajax(settings);
    pings.done(function (response) { //si se encuentra una conexion
      url_server = url;
      console.log("Conected to", url_server);
      try {
        get_my_data();
      }
      catch(err) {
        // "no se requiere un get_my_data"
      }
    })
  }
}

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
  // se usa:
  // toDataUrl('http://example/url', function(base64Img) {
  //   console.log(base64Img);
  // });
}


function loading(accion, mensaje, delay){
  if (!$('#modal-loading').length){ //si no existe el modal, se crea
    $("body").append('\
      <div id="modal-loading" class="modal" role="dialog">\
        <div class="modal-dialog">\
          <div class="modal-content">\
            <div class="modal-header">\
              <button type="button" onClick="location.reload();" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
              <h4 class="modal-title">'+accion+'</h4>\
            </div>\
            <div class="modal-body" style="text-align: center;">\
              <h4>'+mensaje+'</h4>\
              <img src="img/loader2.gif" alt="HTML5 Icon" style="width:100px;height:100px;">\
              <p id="problemas_de_conexion" style="display: none; font-size: 13px; margin-bottom: 0;">\
                Hemos detectado problemas de conexion, estamos intentando reconectar\
              </p>\
              <button id="activar_modo_sin_conexion" class="btn btn-xs btn-warning" \
                  onClick="send_alert(\'<b>Modo sin conexion activado</b>\', \'danger\');" \
                  style="margin: 10px; display: none;">\
                Activar modo sin conexion\
              </button>\
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
  // $('#alert').goTo();
  var exist_alert = localStorage.getItem('alert_data');
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

    $("#alert").goTo();
  }
}

function not_loged(){
  localStorage.removeItem('usuario'); 
  localStorage.removeItem('pdata');
  localStorage.removeItem('comment_likes');
  localStorage.removeItem('product_denounces');
  window.location = "login.html";
}

function center_modal(id){
  if (id){
    setTimeout(function(){
      $('#'+id).css('margin-top',((window.screen.height)/2  - $('#'+id+' .modal-dialog').height()) + 'px');
    },0)
  }
  else{
    setTimeout(function(){
      $('.modal').css('margin-top',((window.screen.height)/2  - $('.modal .modal-dialog').height()) + 'px');
    },0)
  }
}

// tutorial
  function demostracion(indentificacion_elemento, es_modal, delay_aparecer, delay_desaparecer){
    setTimeout(function(){
      $('#tutorial-circulo').css("background-color","coral");
      $('#tutorial-circulo').css("border-width","7px");
      setTimeout(function(){
        $('#tutorial-circulo').css("background-color","transparent");
        $('#tutorial-circulo').css("border-width","5px");
      },500)
    },delay_aparecer-1000);
    if (es_modal){
      setTimeout(function(){
        $(indentificacion_elemento).css("z-index","1040");
        $(indentificacion_elemento).css("display","block");
        $('#tutorial-circulo').css("z-index","1039");
        setTimeout(function(){
          $(indentificacion_elemento).css("z-index","1050");
          $(indentificacion_elemento).css("display","none");
          $('#tutorial-circulo').css("z-index","1041");
        }, delay_desaparecer);
      }, delay_aparecer); 
    }
    else{
      setTimeout(function(){
        indentificacion_elemento.click()
        setTimeout(function(){
          indentificacion_elemento.click()
        }, delay_desaparecer);
      }, delay_aparecer);
    }
  }

  function type_character(element, char, delay){
    setTimeout(function(){
      current_typed = element.val();
      element.val(current_typed+char);
    }, delay);
  }

  function nuevo_mensaje(mensaje, top, left, width){
    $("#tutorial-msje").html(mensaje);
    if (top){ $("#tutorial-msje").css("top", top); }
    if (left){ $("#tutorial-msje").css("left", left); }
    if (width){ $("#tutorial-msje").css("width", width); }
  }

  function mover_circulo(top, height, left, width){
    $("#tutorial-circulo").css("top", top);
    $("#tutorial-circulo").css("left", left);
    $("#tutorial-circulo").css("width", width);
    $("#tutorial-circulo").css("height", height);
  }

  function modo_tutorial(step){
    switch (step){
      // mi perfil
        case 0:
          nuevo_mensaje('\
            <b>Bienvenido a nuestro tutorial <span class="fa fa-smile-o" aria-hidden="true"></span></b>\
            <br>\
            En este, nos encargarémos de enseñarte todo lo que necesario para que aprendas a utilizar nuestra aplicación\
            <br>\
            <br>\
            Esta es la vista de tu perfil, en ella puedes modificar tu grupo familiar');
          $("#tutorial-circulo").hide();
          break;
        case 1: // cambiar username
          nuevo_mensaje('Seleccionando aqui, puedes editar el nombre de tu grupo familiar', '320px');
          mover_circulo("250px", "50px", "15%", "70%");
          $("#tutorial-circulo").show();
          demostracion($("#nombredelwn"), false, 2000, 2000);
          break;
        case 2: // subir foto
          nuevo_mensaje('Y por supuesto subir una foto de tu grupo familiar presionando aqui', '275px');
          mover_circulo("211px", "55px", "calc(50% + 30px)", "55px");
          demostracion("#foto-perfil-modal", true, 1500, 2000);
          break;
        case 3: // agregar familiar
          nuevo_mensaje('Utilizando este simbolo, puedes añadir un nuevo integrante a tu grupo familiar', '320px', '15%', '60%');
          mover_circulo("350px", "50px", "calc(100% - 50px)", "50px");
          demostracion("#new-relative-modal", true, 1500, 2000);
          break;
        case 4: // desplegar intolerancias
          nuevo_mensaje('Puedes hacer click en el nombre de un familiar para desplegar la lista de sus intolerancias', '310px', '5%', '80%');
          mover_circulo("420px", "50px", "0", "calc(100% - 38px)");
          setTimeout(function(){ //el timeout es porq los familiares se pueden demorar en cargar
            demostracion($('.panel.panel-default').children()[0], false, 500, 2000);
          }, 1000);
          break;
        case 5: // editar/eliminar familiar
          nuevo_mensaje('Ademas, desde este simbolo podras modificar el nombre de un familiar o eliminarlo si es necesario', '390px', '5%', '80%');
          mover_circulo("422px", "45px", "calc(100% - 45px)", "45px");
          demostracion("#nombre-familiar-modal", true, 3500, 2000);
          break;
      // menu principal
        case 6:
          var thispath = window.location.pathname.split("/").pop();
          if (thispath!="index.html"){
            window.location = "index.html";
          }
          nuevo_mensaje('<b>Esta es la vista del menú principal</b>\
            <br>\
            <br>\
            Desde aqui puedes acceder a varios tipos de busquedas de productos y al menú de configuraciones tal como te mostraremos a continuacion', '180px');
          $("#tutorial-circulo").hide();
          break;
        case 7: // explicacion de cada boton
          // nuevo_mensaje('<b>Esta es la vista del menú principal</b>\
          //   <br>\
          //   <br>\
          //   Desde aqui puedes acceder a varios tipos de busquedas de productos y al menú de configuraciones tal como te mostraremos a continuacion', '230px');
          $('#tutorial-msje').hide()
          $("#tutorial-circulo").hide();
          
          //explicacion boton mi perfil
          $('body').append('\
            <div class="well explicacion-botones" onClick="next_step()" style="\
              position: absolute;\
              text-align: center;\
              z-index: 1042;\
              top: 10px;\
              left: 90px;\
              padding: 10px;\
              width: 40%;">\
              Boton para ir a la vista de <b>Mi Perfil</b>\
            </div>\
            <span class="fa fa-arrow-left explicacion-botones" onClick="next_step()" style="\
              position: absolute;\
              z-index: 1043;\
              font-size: 30px;\
              color: red;\
              top: 25px;\
              left: 77px;">\
            </span>');
          
          //explicacion menu actual
          $('body').append('\
            <div class="well explicacion-botones" onClick="next_step()" style="\
              position: absolute;\
              text-align: center;\
              z-index: 1042;\
              top: 150px;\
              left: 2%;\
              padding: 5px;\
              width: 20%;">\
              <b>Menú Actual</b>\
            </div>\
            <span class="fa fa-arrow-up explicacion-botones" onClick="next_step()" style="\
              position: absolute;\
              z-index: 1043;\
              font-size: 30px;\
              color: red;\
              top: 130px;\
              left: 8%;">\
            </span>');

          //explicacion botones busquedas
          $('body').append('\
            <div class="well explicacion-botones" onClick="next_step()" style="\
              position: absolute;\
              text-align: center;\
              z-index: 1042;\
              top: 150px;\
              left: 27%;\
              padding: 5px;\
              width: 42%;">\
              Botones para acceder a los <b>Buscadores Alternativos</b>\
            </div>\
            <span class="fa fa-arrow-up explicacion-botones" onClick="next_step()" style="\
              position: absolute;\
              z-index: 1043;\
              font-size: 30px;\
              color: red;\
              top: 130px;\
              left: 34%;">\
            </span>\
            <span class="fa fa-arrow-up explicacion-botones" onClick="next_step()" style="\
              position: absolute;\
              z-index: 1043;\
              font-size: 30px;\
              color: red;\
              top: 130px;\
              left: 58%;">\
            </span>');

          //explicacion menu configuraciones
          $('body').append('\
            <div class="well explicacion-botones" onClick="next_step()" style="\
              position: absolute;\
              text-align: center;\
              z-index: 1042;\
              top: 150px;\
              left: 70%;\
              padding: 5px;\
              width: 30%;">\
              <b>Menú de Configuraciones</b>\
            </div>\
            <span class="fa fa-arrow-up explicacion-botones" onClick="next_step()" style="\
              position: absolute;\
              z-index: 1043;\
              font-size: 30px;\
              color: red;\
              top: 130px;\
              left: 84%;">\
            </span>');
          break;
        case 8: // boton para escanear
          $('.explicacion-botones').remove();
          $('#tutorial-msje').show()
          nuevo_mensaje('<b>Este es el boton para escanear un producto</b>\
            <br>\
            Al presionarlo se abrirá la camara de tu celular, la cual tendras que acercar al codigo de barras de un producto que desees analizar', '470px');
          mover_circulo("210px", "250px", "calc(50% - 125px)", "250px");
          $("#tutorial-circulo").show();
          break;
      // busqueda por codigo numerico
        case 9:
          var thispath = window.location.pathname.split("/").pop();
          if (thispath!="busqueda_id.html"){
            window.location = "busqueda_id.html";
          }
          nuevo_mensaje('<b>Esta es la vista de Busquedas por Codigo Numerico</b>\
            <br>\
            <br>\
            Desde aqui puedes realizar busquedas de productos escribiendo parte del codigo numerico que aparece junto a los codigos de barra.\
            <br>\
            <br>\
            Esta opcion está pensada para aquellos celulares que no tengan una camara muy buena y no puedan escanear mediante el menú anterior', '215px');
          mover_circulo("158px", "50px", "0px", "90%");
          // tritones: 7802230086952
          type_character($("#search_type"), "7", 2500);
          type_character($("#search_type"), "8", 3000);
          type_character($("#search_type"), "0", 3500);
          type_character($("#search_type"), "2", 4000);
          type_character($("#search_type"), "2", 4500);
          type_character($("#search_type"), "3", 5000);
          type_character($("#search_type"), "0", 5500);
          setTimeout(function(){
            $(".input-group-addon button").click();
            $("#tutorial-msje").css("top", "325px");
          }, 6000);
          break;
      // busqueda por nombre
        case 10:
          var thispath = window.location.pathname.split("/").pop();
          if (thispath!="busqueda_nombre.html"){
            window.location = "busqueda_nombre.html";
          }
          nuevo_mensaje('Ademas de la vista anterior. Tambien podrás realizar <b>Busquedas por Nombres</b>\
            <br>\
            <br>\
            Para realizar la busquedas de productos desde este menú tan solo debes escribir parte de sus nombres en la barra indicada.\
            <br>\
            <br>\
            Esta opcion está pensada para aquellos que deseen buscar algunos productos sin la necesidad de tenerlos a mano', '215px');
          mover_circulo("158px", "50px", "0px", "90%");
          // tritones: 7802230086952
          type_character($("#search_type"), "t", 2500);
          type_character($("#search_type"), "r", 3000);
          type_character($("#search_type"), "i", 3500);
          type_character($("#search_type"), "t", 4000);
          // type_character($("#search_type"), "o", 4500);
          // type_character($("#search_type"), "n", 5000);
          setTimeout(function(){
            $(".input-group-addon button").click();
            $("#tutorial-msje").css("top", "325px");
          }, 4500);
          break;
      // configuraciones
        case 11:
          var thispath = window.location.pathname.split("/").pop();
          if (thispath!="configuraciones.html"){
            window.location = "configuraciones.html";
          }
          nuevo_mensaje('Finalmente tenemos la vista de <b>Configuraciones</b>\
            <br>\
            <br>\
            Desde aqui puedes contactarte con un administrador de ¿Puedo Comerlo?, descargar la el modo sin conexion y cerrar la sesion de tu celular\
            <br>\
            <br>\
            Descargar el modo sin conexion te permitirá utilizar la aplicación sin la necesidad de estar conectado a internet, sin embargo, para evitar utilizar mucha memoria de tu celular, no se descargaran imagenes, solo los elementos más importantes para iformarte si puedes o no comer un producto.', '180px');
          mover_circulo("158px", "50px", "0px", "90%");
          $("#tutorial-circulo").hide();
          break;
      default:
        send_alert('Ya estas listo para utilizar nuestra aplicación <i class="fa fa-smile-o" aria-hidden="true"></i>, si deseas repetir este tutorial puedes hacerlo desde éste menú <i class="fa fa-thumbs-o-up" aria-hidden="true"></i>',"success")
        localStorage.removeItem('tutorial');
        location.reload()
        // localStorage.setItem('tutorial', JSON.stringify({'step': 0}));
        // window.location = 'perfil.html';
    }
  }

  function activar_modo_tutorial(){
    var ask_tutorial = confirm("¿Deseas realizar el tutorial de nuestra aplicación?");
    if (ask_tutorial == true) {
      localStorage.setItem('tutorial', JSON.stringify({'step': 0}));
      window.location = 'perfil.html';
    }
  }

  function next_step(){
    tutorial = JSON.parse(localStorage.getItem('tutorial'));
    tutorial.step = tutorial.step + 1;
    localStorage.setItem('tutorial',  JSON.stringify(tutorial));
    modo_tutorial(tutorial.step);
  }
// end tutorial

//se hacen los pings y se guardan la ruta "back"
$(document).ready(function( $ ) {

  var tutorial = JSON.parse(localStorage.getItem("tutorial"));
  if (tutorial){
    $('body').append('\
      <div class="modal-backdrop in" onClick="next_step()">\
      </div>');
    $('body').append('\
      <div id="tutorial-msje" class="well" onClick="next_step()" style="\
        position: absolute;\
        text-align: center;\
        z-index: 1042;\
        top: 100px;\
        left: 10%;\
        width: 80%;">\
      </div>');
    $('body').append('\
      <div id="tutorial-circulo" onClick="next_step()" style="\
        position: absolute;\
        border: 5px solid red;\
        border-radius: 1000px;\
        z-index: 1041;\
        top: 0px;\
        height: 50px;\
        left: 0px;\
        width: 50px;">\
      </div>');
    try{
      var thispath = window.location.pathname.split("/").pop();
      if (tutorial.step < 6 && thispath!="perfil.html"){
        window.location = "perfil.html";
      }
      else if (tutorial.step >= 6 && tutorial.step <9 && thispath!="index.html"){
        window.location = "index.html";
      }
      modo_tutorial(tutorial.step);
    }
    catch(error){
      // 
    }
  }

  ping(all_servers.splice(0,1)[0]);

  // poner la foto de perfil
    setTimeout(function(){
      userdata = JSON.parse(localStorage.getItem('usuario'));
      if (userdata){
        $("#profilePicture").attr("src", userdata.foto_de_perfil);
      }
    }, 0)
  // fin foto de perfil

  // funcionamiento de boton back.. se almacena la direccion anterior
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
  // fin boton back
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