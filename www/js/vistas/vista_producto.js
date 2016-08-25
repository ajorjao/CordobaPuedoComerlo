var consulta_exitosa = false;

jQuery(document).ready(function( $ ) {
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
    
    get_product(pdata.pid);
});

function get_product(id){
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://"+url_server+"/products/"+id,
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "81b17c9b-b428-8799-911e-b183185f6434"
    },
    "method": "GET",
    error: function(resp, status){
      if (resp.status==0){
        $("#modal-popup").modal('show');
        setTimeout(function(){
          get_product(id);
        }, 3000);
      }
      else{
        consulta_exitosa = true;
        alert(JSON.parse(resp.responseText).error)
      }
    }
  }

  $.ajax(settings).done(function (response) {
    consulta_exitosa = true;
    if ($("#modal-popup").hasClass("in")){
      $("#modal-popup").modal('toggle');
    }

    var intolerancias = [];

    for (i = 0, len = response.intolerances.length; i < len; i++) { 
      intolerancias.push(response.intolerances[i].id);
    }

    get_family_data(intolerancias);

  });

}


function get_family_data(intolerancias){
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
      alert("Error de conexión, intentalo nuevamente");
      window.location = "login.html";
    }
  }

  $.ajax(settings).done(function (response) {

    $.each(response.family, function(pos, familiar) {
      console.log("familiar:", familiar.name);
      get_familiar_data(familiar.id,intolerancias);
    });
  });
}



function get_familiar_data(family_id, intolerancias_producto){
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://"+url_server+"/families/"+family_id,
    "method": "GET",
    xhrFields: {
      withCredentials: true
    },
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "bc75788d-2cae-eda1-4aa1-024dbb0af657"
    },
    error: function(resp, status){
      console.log(resp);
      alert("Error, por favor comprueba tu conexión")
      location.reload();
    }
  }


  $.ajax(settings).done(function (response) {
    n = 0;
    t= '<div class="panel panel-danger" style="margin-bottom:-19px;">'+
        '<div class="panel-heading"><h4>Detalle:<h4></div>'+
          '<div class="panel-body">';

    $.each(response.intolerances, function(pos, intolerancia) {
      //si existe la intolerancia de la persona entre las intolerancias del producto
      if ( intolerancias_producto.indexOf(intolerancia.id) != -1){
        n++;
        ////////////////////////////////////////////////////////////
        // aqui agregar las cosas onda... 
        // Jorge: no puede por lactosa
        // lo q se traduciria como
        // response.name ...: no puede por la... intolerancia.name
        ////////////////////////////////////////////////////////////
        console.log(response);
        t += crear_mensaje_problema_con_familiar(response.family.name, intolerancia.name);
      }
    });
    t += '</div></div>';
      if (n>0){
        class1 = "alert alert-danger";
        srcimg = "img/nono.png";
      }
      else{
        class1 = "alert alert-success";
        srcimg = "img/sisi.png";
      }
      detalle = '<center>'+
                  '<div class="'+class1+'" role="alert"><h3 class="display-3">'+
                    pdata.pname+'</h3>'+
                    '<p class="lead">'+
                    pdata.pid+'</p><br>'+
                    '<img  src="'+srcimg+'" alt="..." ><br><br>'+
                  '</div>'+
                '</center>';
      $("#menu1").append(detalle);
      if (n>0) $("#menu1").append('<div class="panel panel-primary">'+
                                    '<div class="panel-heading">'+
                                      '<h3 class="panel-title">Comentarios:</h3>'+
                                    '</div>'+
                                    '<div class="panel-body">'+
                                      'Y aquí pondríamos nuestros comentarios si tuviéramos alguno.'+
                                    '</div>'+
                                  '</div>');
  });
}

function crear_mensaje_problema_con_familiar(nombre_familiar, problema_intolerancia){
  return '<p class="lead"><b>'+nombre_familiar +' no puede comerlo, tiene '+problema_intolerancia+'.</b></p>';
}

/*
//console.log('retrievedObject: ', pdata); // para ver en consola los datos recibidos
    //pdata.pnint = 1;                       // pa cachar que la wea funciona xd
    if (pdata.pnint==0){
      class1 = "alert alert-success";
      srcimg = "img/sisi.png";
    }
    else{
      class1 = "alert alert-danger";
      srcimg = "img/nono.png";

    }
*/
function go_main_menu(){
  window.location = "index.html";
}