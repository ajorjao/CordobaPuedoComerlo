var consulta_exitosa = false;
var pdata = {};

function get_my_data(){
  $( '#my-slider' ).sliderPro({
    forceSize:'fullWidth',
    fade:true,
    buttons:false,
    keyboard:false,
    touchSwipe:false,
    autoplayOnHover:'none',
  });

  // Retrieve the object from storage
  var retrievedObject = localStorage.getItem('pdata');
  pdata = JSON.parse(retrievedObject);

  // console.log(pdata.matchs);
  if (!$.isEmptyObject(pdata.matchs)){
    class1 = "alert alert-danger";
    srcimg = "img/nono.png";
    detalle = '<div class="'+class1+'" style="overflow: auto; margin-bottom: 10px;" role="alert">\
                <h3 style="margin: 0px;">\
                  <div class="row">\
                    <div class="col-xs-3">\
                      <img  src="'+srcimg+'" alt="..." style="width: 65px;" >\
                    </div>\
                    <div class="col-xs-9" style="top: 20px;">\
                      No Puede Comerlo:\
                    </div>\
                  </div>\
                </h3>\
                <div class="row" style="margin: -10px 0 0 85px; font-size: 16px;" id="cant-eat"> </div>\
              </div>\
              <div class="panel panel-danger">\
                <div class="panel-heading">\
                  <span>Posibles Sintomas:</span>\
                </div>\
                <div class="well panel" style="overflow: auto; margin-bottom: 0;">\
                  <div id="intolerancesMatchs">\
                  </div>\
                </div>\
              </div>\
              <!--<div class="well" style="overflow: auto;">\
                <div id="recomendedMatchs">\
                </div>-->\
              </div>';
  }
  else{
    class1 = "alert alert-success";
    srcimg = "img/sisi.png";
    $("#intolerancesMatchs").append('Todos en tu familia pueden comer este producto');
    detalle = '<div class="'+class1+'" style="overflow: auto; text-align: center;" role="alert">\
                <h3 style="margin:  0 0 10px 0;">Puede Comerlo</h3>\
                <img  src="'+srcimg+'" alt="..." >\
              </div>';
  }
  $("#productMatch").append(detalle);

  var n = 0
  $.each(pdata.matchs, function(familiar, intolerancias) {
    // console.log(familiar,":", intolerancias);
    if ( intolerancias.length >= 1){
      n++;
      crear_mensaje_problema_con_familiar(familiar, intolerancias);
    }
  });

  get_comments();

  $("#product-name").html(pdata.pname);
  $("#product-id").html(pdata.pid);
  $("#product-ingredients").html(pdata.ingredients);
  $("#product-image").attr("src", pdata.image_route);

  // centrar la imagen cuando esta descuadrada (ej: 120x30)
  setTimeout(function(){
    imgheight = $("#product-image").height()
    imgwidth = $("#product-image").width()
    if (imgheight < 120){
      $("#product-image").css('margin-top',60-imgheight/2+'px');
    }
    if (imgwidth < 120){
      $("#product-image").css('margin-top',60-imgwidth/2+'px');
    }
  }, 100);
}


function crear_mensaje_problema_con_familiar(nombre_familiar, problemas_intolerancias){
  familiar = '\
    <a role="button" data-toggle="collapse" data-parent="#accordion" href="#sintomas_'+nombre_familiar+'" aria-expanded="false" aria-controls="collapseOne" style="font-size: 20px; color:#333;">\
      <span class="glyphicon glyphicon-minus" aria-hidden="true"></span> '+ nombre_familiar.split("_-_")[0] +'\
    </a><br>\
    <div id="sintomas_'+nombre_familiar+'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading_'+nombre_familiar+'" style="margin-bottom: 20px;">';

  // console.log(problemas_intolerancias)
  for (i = 0, len = problemas_intolerancias.length; i < len; i++) {
    for (var familiar_intolerance in problemas_intolerancias[i]) {
      // console.log(problemas_intolerancias[i]);
      familiar += '\
      <div style="margin-left: 30px; font-size: 16px;">\
        <b>'+ familiar_intolerance +':</b> '+problemas_intolerancias[i][familiar_intolerance]+'\
      </div>';
    }
  }

  familiar += '\
    </div>'
  $("#intolerancesMatchs").append(familiar);
  // console.log('$("#cant-eat").append(\'- \''+nombre_familiar.split("_-_")[0]+'\'<br>\')')
  $("#cant-eat").append('- '+nombre_familiar.split("_-_")[0]+'<br>');
}


function get_comments(){
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://"+url_server+"/product_comments/"+pdata.pid,
    "method": "GET",
    xhrFields: {
      withCredentials: true
    },
    "headers": {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "postman-token": "62f3283b-5118-e38d-7538-2b6ea2f3e39c"
    },
    error: function(resp, status){
      if (resp.status==0){
        alert("Error al leer los comentarios")
      }
      else{
        send_alert(JSON.parse(resp.responseText).error, "danger");
      }
      location.reload();
    }
  }

  $.ajax(settings).done(function (response) {
    // console.log(response);
    for (i = 0, len = response.comments.length; i < len; i++) {
      if (response.comments[i]["prom_likes"]>-15) {
        add_comment(response.comments[i]);
      }
      else{
        $("#product-comments").append('\
          <div class="panel-body" style="margin-left: 25px; color: red;">\
            <div class="row">\
              '+response.comments[i]["user"]["username"]+': <b><i>Comentario bloqueado</i></b>\
            </div>\
            <div class="row">\
              Este comentario fue bloqueado por tener demaciados votos negativos\
            </div>\
          </div>');
      }
    }
  });
}


function add_comment(hash_comentario){
  comment = '\
  <div class="panel-body">\
    <div class="col-xs-9">\
      <div class="row">\
        '+hash_comentario["user"]["username"]+': <b>'+hash_comentario["title"]+'</b>\
      </div>\
      <div class="row">\
        '+hash_comentario["description"]+'\
      </div>\
    </div>\
    <div class="col-xs-3" style="text-align: center;">\
      <div id="prom_likes_'+hash_comentario["id"]+'">\
        '+hash_comentario["prom_likes"]+'\
      </div>\
      <a onClick="like('+hash_comentario["id"]+',\'like\')" id="likes_'+hash_comentario["id"]+'">\
        <span class="glyphicon glyphicon-thumbs-up"></span>\
      </a>&nbsp;\
      <a onClick="like('+hash_comentario["id"]+',\'dislike\')" id="dislikes_'+hash_comentario["id"]+'">\
        <span class="glyphicon glyphicon-thumbs-down"></span>\
      </a>\
    </div>\
  </div>'
  $("#product-comments").append(comment);
}


function like(id_comentario, like_dislike){
  var form = new FormData();
  form.append(like_dislike, "true");

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://"+url_server+"/like_comment/"+id_comentario,
    "method": "PUT",
    xhrFields: {
      withCredentials: true
    },
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "02773620-b093-7aad-3ca1-73e82dfd7283"
    },
    "processData": false,
    "contentType": false,
    "mimeType": "multipart/form-data",
    "data": form,
    error: function(resp, status){
      if (resp.status==0){
        alert("Error, por favor comprueba tu conexión");
      }
      else{
        send_alert(JSON.parse(resp.responseText).error, "danger");
      }
      location.reload();
    }
  }

  $.ajax(settings).done(function (response) {
    $("#likes_"+id_comentario).removeAttr('onclick');
    $("#dislikes_"+id_comentario).removeAttr('onclick');
    prom_likes = parseInt($("#prom_likes_"+id_comentario).text())

    if (like_dislike=="like"){
      $("#prom_likes_"+id_comentario).text(prom_likes+1)
      
      $("#dislikes_"+id_comentario).css('color','gray');
      $("#likes_"+id_comentario).css('color','black');
      
      $("#likes_"+id_comentario).attr('onclick',"like("+id_comentario+",\'like_cancel\')");
    }
    else if (like_dislike=="dislike") {
      $("#prom_likes_"+id_comentario).text(prom_likes-1)
      
      $("#likes_"+id_comentario).css('color','gray');
      $("#dislikes_"+id_comentario).css('color','black');
      
      $("#dislikes_"+id_comentario).attr('onclick',"like("+id_comentario+",\'dislike_cancel\')");
    }
    else{
      $("#likes_"+id_comentario).removeAttr('style');
      $("#dislikes_"+id_comentario).removeAttr('style');

      $("#likes_"+id_comentario).attr('onclick',"like("+id_comentario+",\'like\')");
      $("#dislikes_"+id_comentario).attr('onclick',"like("+id_comentario+",\'dislike\')");

      if (like_dislike=="like_cancel"){
        $("#prom_likes_"+id_comentario).text(prom_likes-1)
      }
      else if (like_dislike=="dislike_cancel"){
        $("#prom_likes_"+id_comentario).text(prom_likes+1)
      }
    }
    // console.log("likes: "+JSON.parse(response).likes+", dislikes: "+JSON.parse(response).dislikes);
  });
}


function comentar(){
  var form = new FormData();
  form.append("title", $("#title").val());
  form.append("description", $("#description").val());
  form.append("product_id", pdata.pid);

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://"+url_server+"/comments",
    "method": "POST",
    xhrFields: {
      withCredentials: true
    },
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "ec11ee2b-33d1-480d-00a2-bb12c6c834cd"
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
    $("#comentar-modal").modal('toggle');
    $("#title").val("");
    $("#description").val("");
    // console.log("comentado:"+response);
    $("#product-comments").html('\
        <div style="text-align: right;">\
          <button style="width: 75%; margin: 5px;" type="button" class="btn btn-default" data-toggle="modal" data-target="#comentar-modal">Comentar</button>\
        </div>');
    get_comments();
  });
}


function denunciar(){

  var form = new FormData();
  form.append("product_id", pdata.pid);

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://"+url_server+"/denounce_product",
    "method": "POST",
    xhrFields: {
      withCredentials: true
    },
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "245521af-53b1-6a74-855b-343d227a24ac"
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

  var denuncia = confirm("¿Estás seguro que deseas denunciar "+pdata.pname+"?");
  if (denuncia == true) {
    $.ajax(settings).done(function (response) {
      console.log(response);
      send_alert("<strong>Producto Denunciado Correctamente</strong> gracias por avisarnos", "success");
      location.reload();
    });
  }
}

function go_back(){
  var back = JSON.parse(localStorage.getItem('back'));
  window.location = back.location;
}