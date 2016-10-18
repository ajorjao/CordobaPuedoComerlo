$(function () {
	// se ejecuta cada vez que se escribe alguna letra
	$('#search_id').on('input', function(){
		if ($(this).val().length>3){
			search();
		}
	});
	$('#busqueda').submit(function(e) {
    e.preventDefault();
	});
});

function search(){
	var form = new FormData();
	form.append("product[id]", $("#search_id").val());

	var settings = {
    "async": true,
	  "crossDomain": true,
	  "url": "http://"+url_server+"/products",
	  "method": "PUT",
    xhrFields: {
      withCredentials: true
    },
	  "headers": {
	    "cache-control": "no-cache",
	    "postman-token": "6416ff29-c90c-b556-c237-e6d5c5e57efa"
	  },
	  "processData": false,
	  "contentType": false,
	  "mimeType": "multipart/form-data",
	  "data": form,
	  error: function(resp, status){		// cuando hay error
      if (resp.status==0){
      	clear_listgroup();
	  		add_error("Error, por favor revisa tu conexión a internet")
      }
      else{
      	clear_listgroup();
	  		add_error(JSON.parse(resp.responseText).error+": "+$("#search_id").val())
      }
	  }
	}

	$.ajax(settings).done(function (response) {
		resp = $.parseJSON(response);
	  clear_listgroup();
	  $.each(resp.products, function(index, productandintolerances) {
	  	producto = productandintolerances.product
	  	url_image_product = "http://"+url_server+producto.image_file_name.replace("/original/","/thumb/") //para que la velocidad de carga para el usuario sea menor
	  	intolerancias = productandintolerances.intolerancias
	  	state = "success"

			intolerancias_familia = JSON.parse(localStorage.getItem('usuario')).intolerancias;

	  	$.each(intolerancias, function(pos, intolerancia){
	  		if (intolerancias_familia.indexOf(intolerancia.id) != -1){
	  			state = "danger"
	  			return false;
	  		}
	  	})
			add_product(producto.name, producto.id, url_image_product, state);
		});
	});
}

function clear_listgroup(){
	$(".list-group").html("");
}

function ver_detalle(id){
	match_product(id);
	// console.log("product name:", pname)
	// console.log("matchs:", matchs)

	var testObject = { 'pid': id, 'pname': pname, 'matchs': matchs, 'ingredients': ingredients, 'image_route': image_route};
	// Put the object into storage
	localStorage.setItem('pdata', JSON.stringify(testObject));
	window.location = "vista_producto.html";
}

function add_product(name, id, img_src, state){
	var producto = '\
		<a onClick="ver_detalle('+id+')" class="list-group-item list-group-item-'+state+'" style="overflow: auto;">\
  		<div class="col-xs-3" style="text-align: center;">\
				<img src="'+img_src+'" style="height: 70px; width: 70px;">\
  		</div>\
  		<div class="col-xs-9" style="text-align: center; font-size: 14px; top: 12px;">\
  			<div class="row">\
					'+id+'\
  			</div>\
  			<div class="row">\
					'+name+'\
  			</div>\
  		</div>\
		</a>'
	$(".list-group").append(producto);
}

function add_error(name){
	var producto = '<a href="#" class="list-group-item list-group-item-danger"><span class="badge">Error</span>'+name+'</a>'
	$(".list-group").prepend(producto);
}


function get_my_data(){
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
      window.location = "login.html";
    }
  }

  $.ajax(settings).done(function (response) {
    userdata = JSON.parse(localStorage.getItem('usuario'));
    if (userdata){
      $("#profilePicture").attr("src", userdata.foto_de_perfil);
    }
    else{
      var foto_de_perfil = "http://"+url_server+response.user.avatar_file_name
      $("#profilePicture").attr("src", foto_de_perfil.replace("/original/","/thumb/"));
    }
  });
}

function modo_sin_conexion(){
  userdata = JSON.parse(localStorage.getItem('usuario'));
  if (userdata){
    setTimeout( function (){ //ni idea de porq el Timeout 0 pero es necesario para q se cargue la imagen
      $("#profilePicture").attr("src", userdata.foto_de_perfil);
    },0)
  }
}