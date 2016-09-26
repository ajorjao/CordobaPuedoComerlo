// de este codigo llamando la funcion match_product(id) se generan las variables globales pname y matchs
// pname: nombre del producto
// matchs: intolerancias con problemas para cada familiar del usuario actual, de la forma
// 		{ nombre_-_idfamiliar1: [intolerancia1, intolerancia2], nombre_-_idfamiliar2: [intolerancia1, intolerancia2] }

var pname = ""
var matchs = {}
var image_route = ""
var ingredients = ""

function match_product(id){
  var settings = {
    "async": false,
    "crossDomain": true,
    "url": "http://"+url_server+"/products/"+id,
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "81b17c9b-b428-8799-911e-b183185f6434"
    },
    xhrFields: {
      withCredentials: true
    },
    "method": "GET",
    error: function(resp, status){
      if (resp.status==0){
        $("#modal-popup").modal('show');
        setTimeout(function(){
          match_product(id);
        }, 1000);
      }
      else{
        consulta_exitosa = true;
        send_alert(JSON.parse(resp.responseText).error, "danger");
        location.reload();
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
    ingredients = response.product.ingredients
    image_route = "http://"+url_server+response.product.image_file_name
    var intolerancias_producto = [];
    var sintomas_producto = [];
    for (i = 0, len = response.intolerances.length; i < len; i++) {
      intolerancias_producto.push(response.intolerances[i].id);
      sintomas_producto.push(response.intolerances[i].medium_symptom);
    }
  	get_family_data(intolerancias_producto, sintomas_producto);
  });
}

var intolerancias_familiar = [] //se utiliza para obtener las intolerancias de cada familiar y ingresarlas al match
function get_family_data(intolerancias_producto, sintomas_producto){
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
      // send_alert("<strong>Error de conexión</strong> por favor intentalo nuevamente", "danger");
      // window.location = "login.html";
      alert("Error, por favor comprueba tu conexión")
      location.reload();
    }
  }

  $.ajax(settings).done(function (response) {
    $.each(response.family, function(pos, familiar) {
      // matchs[familiar.name+"_-_"+familiar.id] = get_familiar_data(familiar.id, intolerancias_producto);
      get_familiar_data(familiar.id, intolerancias_producto, sintomas_producto);
      if (intolerancias_familiar[0]!=null){
        matchs[familiar.name+"_-_"+familiar.id] = intolerancias_familiar
      }
    });
  });
}



function get_familiar_data(family_id, intolerancias_producto, sintomas_producto){
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
    intolerancias_familiar = [] // lo reinicia para que no se choquen las intolerancias
    for (i = 0, len = response.intolerances.length; i < len; i++) {
      intolerancia = {}
      //si existe la intolerancia de la persona entre las intolerancias del producto
      if ( intolerancias_producto.indexOf(response.intolerances[i].id) != -1){
        // alert("sintoma de "+response.intolerances[i].name+" esta en la pos: "+intolerancias_producto.indexOf(response.intolerances[i].id) )
        intolerancia[response.intolerances[i].name] = sintomas_producto[intolerancias_producto.indexOf(response.intolerances[i].id)]
        intolerancias_familiar.push(intolerancia);
      }
    }
    // console.log(response.family.name)
    // console.log(intolerancias_familiar);
  });
}