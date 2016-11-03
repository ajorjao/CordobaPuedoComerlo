$(function () {
  $('#sugerir').submit(function(e) {
    e.preventDefault();
  });
});

function get_my_data(){
  var c_bar = JSON.parse(localStorage.getItem('pdata')).pid
  $('#c_barra').val(c_bar)

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://"+url_server+"/products/"+c_bar,
    "method": "GET",
     xhrFields: {
      withCredentials: true
    },
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "071fde03-5439-1327-1883-5bdaac6a1c2a"
    },
    error: function(resp, status){
      if (resp.status==0){
        alert("Error de conexión con el servidor, por favor intentelo mas tarde");
        window.location = "index.html";
      }
      else if (resp.status==422){
        // si el producto ya fue sugerido anteriormente
        send_alert(JSON.parse(resp.responseText).error+' <span class="fa fa-frown-o" aria-hidden="true"></span><br>\
          Si crees que hay un error no dudes en decirnoslo a traves de un mensaje de Contactanos', "warning");
        window.location = "index.html"
      }
    }
  }


  $.ajax(settings).done(function (response) {
    match_product(c_bar);
    var testObject = { 'pid': c_bar, 'pname': pname, 'matchs': matchs, 'ingredients': ingredients, 'image_route': image_route};
    localStorage.setItem('pdata', JSON.stringify(testObject));
    window.location = "vista_producto.html";
  });
}

function sugerir_producto() {
  var form = new FormData();
  form.append("barcode", $('#c_barra').val());
  form.append("name", $('#n_producto').val());

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://"+url_server+"/suggest_product",
    "method": "POST",
     xhrFields: {
      withCredentials: true
    },
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "071fde03-5439-1327-1883-5bdaac6a1c2a"
    },
    "processData": false,
    "contentType": false,
    "mimeType": "multipart/form-data",
    "data": form,

    error: function(resp, status){
      if (resp.status==0){
        alert("Error de conexión con el servidor, por favor intentelo mas tarde");
      }
      else{
        send_alert(JSON.parse(resp.responseText).error, "danger");
      }
      location.reload();
    }
  }


  $.ajax(settings).done(function (response) {
    send_alert("Producto sugerido correctamente.","success");
    window.location = "index.html"
  });
}

function go_back(){
  var back = JSON.parse(localStorage.getItem('back'));
  window.location = back.location;
}