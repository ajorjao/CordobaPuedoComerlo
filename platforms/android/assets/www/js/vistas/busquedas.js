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
  loading("Realizando busqueda","Estamos buscando productos que coincidan con la busqueda", 2000);
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
      	stop_loading();
      	clear_listgroup();
	  		add_error(JSON.parse(resp.responseText).error+": "+$("#search_type").val()+", puedes solicitar el producto haciendo click en Solicitar Producto");
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
						add_product(product.name, product.id, "img/Imagen_no_disponible.svg", "danger", type);
	  			}
	  		});
	  		stop_loading();
  		}
  		else{
	  		$.each(products,function(pos,product){
	  			if (product.id.toString().includes($("#search_type").val())){
	  				products_found = true;
						add_product(product.name, product.id, "img/Imagen_no_disponible.svg", "danger", type);
	  			}
	  		});
	  		stop_loading();
  		}
  		// si no se encuentra nada
  		if (!products_found){
				add_error("No hay productos coincidentes con la busqueda: "+$("#search_type").val());
  		}
  	}
  	else {
	  	stop_loading();
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
  		stop_loading();
		});
  }
}

function clear_listgroup(){
	$(".list-group").html("");
}

function ver_detalle(id){

  loading("Buscando producto",'Estamos verificando si puedes comer este producto<br>', 1000);

  if ($('#alert').text().includes("Modo sin conexion")){
  	products = JSON.parse(localStorage.getItem('products'));
		$.each(products,function(pos,product){
			if (product.id == id){
				var testObject = { 'pid': id, 'pname': product.name, 'matchs': product.intolerances, 'ingredients': product.ingredients, 'image_route': "img/Imagen_no_disponible.svg"};
				localStorage.setItem('pdata', JSON.stringify(testObject));
				return false;
			}
		});
    // send_alert('<b>Modo sin conexion activado</b>', "danger");
		
		stop_loading();
		window.location = "vista_producto.html";
	}
	else{
		match_product(id);
	}
}

function add_product(name, id, img_src, state, type){
	if (type=="name"){ //si se realiza una busqueda por nombre
		var producto = '\
			<a onClick="ver_detalle('+id+')" class="list-group-item list-group-item-'+state+'" style="overflow: auto;">\
	  		<div style="width: 70; float: left;">\
					<img src="'+img_src+'" style="height: 70px; width: 70px;">\
	  		</div>\
	  		<div style="text-align: center; top: 8px; position: relative; float: right; width: calc(100% - 75px);">\
					'+name+'\
	  			<div class="row">\
						'+id+'\
	  			</div>\
	  		</div>\
			</a>'
	}
	else {
		var producto = '\
			<a onClick="ver_detalle('+id+')" class="list-group-item list-group-item-'+state+'" style="overflow: auto;">\
	  		<div style="width: 70; float: left;">\
					<img src="'+img_src+'" style="height: 70px; width: 70px;">\
	  		</div>\
	  		<div style="text-align: center; top: 8px; position: relative; float: right; width: calc(100% - 75px);">\
	  			<div class="row">\
						'+id+'\
	  			</div>\
					'+name+'\
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
      if (resp.status==0){
        // alert("Error de conexión con el servidor, por favor intentelo mas tarde");
        // location.reload();
      }
      else{
        not_loged();
      }
    }
  }

  $.ajax(settings).done(function (response) {
    userdata = JSON.parse(localStorage.getItem('usuario'));
    if (!userdata){
    	send_alert("Hubo un problema con los datos de tu usuario, lamentamos las inconveniencias", "warning");
      window.location = "perfil.html";
    }
  });
}
