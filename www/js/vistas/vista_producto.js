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
    detalle = '<div class="'+class1+'" style="overflow: auto;" role="alert">\
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
              <span style="color: white;">Posibles Sintomas:</span>\
              <div class="well" style="overflow: auto;">\
                <div id="intolerancesMatchs">\
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


  $("#product-name").html(pdata.pname)
  $("#product-id").html(pdata.pid)
  $("#product-ingredients").html(pdata.ingredients)
  $("#product-image").attr("src", pdata.image_route)

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







function denunciar(){
  // var retrievedObject = localStorage.getItem('pdata');
  // pdata2 = JSON.parse(retrievedObject);

  var form = new FormData();
  form.append("product_id", pdata.pid);

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://"+url_server+"/denounce_product",
    "method": "POST",
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