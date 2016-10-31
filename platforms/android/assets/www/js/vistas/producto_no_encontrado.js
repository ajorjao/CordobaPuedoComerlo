function get_my_data(){
  var c_bar = JSON.parse(localStorage.getItem('pdata')).pid
  $('#c_barra').val(c_bar) 
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