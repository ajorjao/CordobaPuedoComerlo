// de este codigo llamando la funcion match_product(id) se generan las variables globales pname y matchs
// pname: nombre del producto
// matchs: intolerancias con problemas para cada familiar del usuario actual, de la forma
// 		{ nombre_-_idfamiliar1: [intolerancia1, intolerancia2], nombre_-_idfamiliar2: [intolerancia1, intolerancia2] }

var pname = ""
var matchs = {}
var image_route = ""


function match_product(id){
  var settings = {
    "async": false,
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
        }, 1000);
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

    // console.log(response)
		pname = response.product.name
    image_route = response.product.image_file_name
    var intolerancias_producto = [];
    for (i = 0, len = response.intolerances.length; i < len; i++) {
      intolerancias_producto.push(response.intolerances[i].id);
    }

  	get_family_data(intolerancias_producto);
  });
}

var intolerancias_familiar = [] //se utiliza para obtener las intolerancias de cada familiar y ingresarlas al match
function get_family_data(intolerancias_producto){
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
      alert("Error de conexión, intentalo nuevamente");
      window.location = "login.html";
    }
  }

  $.ajax(settings).done(function (response) {
    $.each(response.family, function(pos, familiar) {
      // matchs[familiar.name+"_-_"+familiar.id] = get_familiar_data(familiar.id, intolerancias_producto);
      get_familiar_data(familiar.id, intolerancias_producto);
      matchs[familiar.name+"_-_"+familiar.id] = intolerancias_familiar
    });
  });
}



function get_familiar_data(family_id, intolerancias_producto){
  var settings = {
    "async": false,
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
    intolerancias_familiar = []
    $.each(response.intolerances, function(pos, intolerancia) {
      //si existe la intolerancia de la persona entre las intolerancias del producto
      if ( intolerancias_producto.indexOf(intolerancia.id) != -1){
        intolerancias_familiar.push(intolerancia.name);
      }
    });
    // console.log(response.family.name)
    // console.log(intolerancias_familiar);
  });
}