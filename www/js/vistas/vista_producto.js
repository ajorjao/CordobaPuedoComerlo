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

  var n = 0
  $.each(pdata.matchs, function(familiar, intolerancias) {
    // console.log(familiar,":", intolerancias);
    if ( intolerancias.length >= 1){
      n++;
      crear_mensaje_problema_con_familiar(familiar, intolerancias);
    }
  });

  if (n>0){
    class1 = "alert alert-danger";
    srcimg = "img/nono.png";
  }
  else{
    class1 = "alert alert-success";
    srcimg = "img/sisi.png";
    $("#intolerancesMatchs").append('Todos en tu familia pueden comer este producto');
  }
  detalle = '<center>'+
              '<div class="'+class1+'" role="alert"><h3 class="display-3">'+
                pdata.pname+'</h3>'+
                '<p class="lead">'+
                pdata.pid+'</p><br>'+
                '<img  src="'+srcimg+'" alt="..." ><br><br>'+
              '</div>'+
            '</center>';
  $("#productMatch").append(detalle);
}

function crear_mensaje_problema_con_familiar(nombre_familiar, problema_intolerancias){
  intolerancia = '<p class="lead"><b>'+ nombre_familiar.split("_-_")[0] +' no puede comerlo, el producto tiene';
  $.each(problema_intolerancias, function(pos, problema_intolerancia){
    if (pos==problema_intolerancias.length-1 && problema_intolerancias.length!=1){
      intolerancia += ' y'
    }
    else if (pos!=0){
      intolerancia += ','
    }
    intolerancia += ' '+problema_intolerancia
  })
  intolerancia += '.</b></p>'
  $("#intolerancesMatchs").append(intolerancia);
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
      alert("Producto denunciado");
    });
  }
}

function go_back(){
  var back = JSON.parse(localStorage.getItem('back'));
  window.location = back.location;
}