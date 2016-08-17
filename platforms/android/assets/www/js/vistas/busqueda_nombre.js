function search(){
	var form = new FormData();
	form.append("product[name]", $("#exampleInputAmount").val());

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
	  error: function(resp, status){
      if (resp.status==0){
        // alert("Error, por favor comprueba tu conexión")
	  		add_error("Error, por favor revisa tu coneccion a internet")
      }
      else{
        // alert(JSON.parse(resp.responseText).error)
	  		add_error(JSON.parse(resp.responseText).error+": "+$("#exampleInputAmount").val())
      }
	  }
	}

	$.ajax(settings).done(function (response) {
		resp = $.parseJSON(response);
	  clear_listgroup();
	  $.each(resp.products, function(index, producto) {
			add_product(producto.name, 0);
		});
	});
}

function clear_listgroup(){
	$(".list-group").html("");
}

function add_product(name, n_ing_intolerados){
	if (n_ing_intolerados==0){
		var producto = '<a href="#" class="list-group-item list-group-item-success">'+name+'</a>'
	}
	else {
		var producto = '<a href="#" class="list-group-item list-group-item-danger"><span class="badge">'+n_ing_intolerados+'</span>'+name+'</a>'
	}
	$(".list-group").append(producto);
}

function add_error(name){
	var producto = '<a href="#" class="list-group-item list-group-item-danger"><span class="badge">Error</span>'+name+'</a>'
	$(".list-group").prepend(producto);
}

function go_main_menu(){
  window.location = "index.html";
}
