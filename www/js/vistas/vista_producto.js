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
    console.log('retrievedObject: ', pdata); // para ver en consola los datos recibidos
    //pdata.pnint = 1;                       // pa cachar que la wea funciona xd
    if (pdata.pnint==0){
      class1 = "alert alert-success";
      srcimg = "img/sisi.png";
    }
    else{
      class1 = "alert alert-danger";
      srcimg = "img/nono.png";

    }
    detalle = '<center><div class="'+class1+'" role="alert"><h3 class="display-3">'+pdata.pname+'</h3><p class="lead">'+pdata.pid+'</p><img  src="'+srcimg+'" alt="..." ></div></center>';
    $("#menu1").append(detalle);
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

    get_family_data();

  });

}


function get_family_data(){
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
    // var foto_de_perfil = "http://"+url_server+response.user.avatar_file_name

    $("#profilePicture").attr("src", foto_de_perfil);
    $.each(response.family, function(pos, familiar) {
      console.log("familiar:", familiar.name);
      get_familiar_data(familiar.id);
    });
  });
}



function get_familiar_data(family_id){
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
    // console.log(response);
    $.each(response.intolerances, function(pos, intolerancia) {
      //si existe la intolerancia de la persona entre las intolerancias del producto
      if ( intolerancias.indexOf(intolerancia.id) != -1){ 
        ////////////////////////////////////////////////////////////
        // aqui agregar las cosas onda... 
        // Jorge: no puede por lactosa
        // lo q se traduciria como
        // response.name ...: no puede por la... intolerancia.name
        ////////////////////////////////////////////////////////////
      }
    });
  });
}

function go_main_menu(){
  window.location = "index.html";
}