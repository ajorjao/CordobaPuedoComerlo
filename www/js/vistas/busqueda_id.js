function search(){
	var form = new FormData();
	form.append("product[id]", $("#exampleInputAmount").val());

	var settings = {
    "async": true,
	  "crossDomain": true,
	  "url": "http://"+url_server+"/products",
	  "method": "PUT",
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
	  		add_error("Error, por favor revisa tu conexión a internet")
      }
      else{
	  		add_error(JSON.parse(resp.responseText).error+": "+$("#exampleInputAmount").val())
      }
	  }
	}

	$.ajax(settings).done(function (response) {
		resp = $.parseJSON(response);
	  clear_listgroup();
	  $.each(resp.products, function(index, producto) {
			add_product(producto.name, producto.id, 0);
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

	var testObject = { 'pid': id, 'pname': pname, 'matchs': matchs, 'image_route': image_route};
	// Put the object into storage
	localStorage.setItem('pdata', JSON.stringify(testObject));
	go_vista_producto();
}

function add_product(name, id){
	var producto = '<a onClick="ver_detalle('+id+')" class="list-group-item list-group-item">'+name+'</a>'
	$(".list-group").append(producto);
}

function add_error(name){
	var producto = '<a href="#" class="list-group-item list-group-item-danger"><span class="badge">Error</span>'+name+'</a>'
	$(".list-group").prepend(producto);
}

function go_main_menu(){
  window.location = "index.html";
}

function go_vista_producto(){
	window.location = "vista_producto.html";
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
    var foto_de_perfil = "http://"+url_server+response.user.avatar_file_name
    $("#profilePicture").attr("src", foto_de_perfil);
  });
}