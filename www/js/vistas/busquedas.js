$(function () {
	// se ejecuta cada vez que se escribe alguna letra
	$('#search_type').on('input', function(){
		if ($(this).val().length>3){
			var filename = window.location.pathname.split("/").pop();
			if (filename=="busqueda_nombre.html"){
				search('name');
			}
			else{
				search('id');
			}
		}
	});
	$('#busqueda').submit(function(e) {
    e.preventDefault();
	});
});

function search(type){
	var form = new FormData();
	form.append("product["+type+"]", $("#search_type").val());

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
	  		add_error("Error, por favor revisa tu conexión a internet");
      }
      else{
      	clear_listgroup();
	  		add_error(JSON.parse(resp.responseText).error+": "+$("#search_type").val());
      }
	  }
	}

  if ($('#alert').text().includes("Modo sin conexion")){
  	products = JSON.parse(localStorage.getItem('products'));
    userdata = JSON.parse(localStorage.getItem('usuario'));
  	clear_listgroup();
  	if (products){
  		products_found = false
  		if (type == "name"){
	  		$.each(products,function(pos,product){
	  			if (product.name.toUpperCase().includes($("#search_type").val().toUpperCase())){
	  				products_found = true;
						add_product(product.name, product.id, "img/product_default.png", "danger", type);
	  			}
	  		});
  		}
  		else{
	  		$.each(products,function(pos,product){
	  			if (product.id.toString().includes($("#search_type").val())){
	  				products_found = true;
						add_product(product.name, product.id, "img/product_default.png", "danger", type);
	  			}
	  		});
  		}
  		// si no se encuentra nada
  		if (!products_found){
				add_error("No hay productos coincidentes con la busqueda: "+$("#search_type").val());
  		}
  	}
  	else {
  		add_error("Error, debes descargar el modo sin conexión para poder realizar busquedas sin acceso a internet");
  	}
  }
  else{
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
				add_product(producto.name, producto.id, url_image_product, state, type);
			});
		});
  }
}

function clear_listgroup(){
	$(".list-group").html("");
}

function ver_detalle(id){
  if ($('#alert').text().includes("Modo sin conexion")){
  	products = JSON.parse(localStorage.getItem('products'));
		$.each(products,function(pos,product){
			if (product.id == id){
				var testObject = { 'pid': id, 'pname': product.name, 'matchs': product.intolerances, 'ingredients': product.ingredients, 'image_route': "img/product_default.png"};
				localStorage.setItem('pdata', JSON.stringify(testObject));
				return false;
			}
		});
    send_alert('<b>Modo sin conexion activado</b>', "danger");
		window.location = "vista_producto.html";
	}
	else{
		match_product(id);
		// console.log("product name:", pname)
		// console.log("matchs:", matchs)

		var testObject = { 'pid': id, 'pname': pname, 'matchs': matchs, 'ingredients': ingredients, 'image_route': image_route};
		// Put the object into storage
		localStorage.setItem('pdata', JSON.stringify(testObject));
		window.location = "vista_producto.html";
	}
}

function add_product(name, id, img_src, state, type){
	if (type=="name"){ //si se realiza una busqueda por nombre
		var producto = '\
			<a onClick="ver_detalle('+id+')" class="list-group-item list-group-item-'+state+'" style="overflow: auto;">\
	  		<div class="col-xs-3" style="text-align: center;">\
					<img src="'+img_src+'" style="height: 70px; width: 70px;">\
	  		</div>\
	  		<div class="col-xs-9" style="text-align: center; font-size: 14px; top: 12px;">\
	  			<div class="row">\
						'+name+'\
	  			</div>\
	  			<div class="row">\
						'+id+'\
	  			</div>\
	  		</div>\
			</a>'
	}
	else {
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
	}
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