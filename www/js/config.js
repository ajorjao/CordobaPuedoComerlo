var all_servers = ["192.168.1.37:3000","10.6.43.67:3000","localhost:3000"];

var url_server = ""
var settings = {}

function set_settings(url_server){
	settings = {
	  // "async": true,
	  "crossDomain": true,
	  "url": "http://"+url_server+"/ping",
	  "method": "GET",
	  "headers": {
	    "cache-control": "no-cache",
	    "postman-token": "4b2b1c69-8975-b182-c74e-f196b3ed57d3"
	  },
	  "timeout": 1000
	}
}

function ping(url){
  set_settings(url);
  pings = $.ajax(settings);
  pings.done(function (response) {
    url_server = url;
    console.log("Conected to", url_server);
    try {
    	get_my_data();
    }
    catch(err) {
    	// "no se requiere un get_my_data"
    }
  })
  pings.fail(function (response) {
    console.log("fail", url);
    new_url = all_servers.splice(0,1)[0];
    if (new_url != undefined){
      ping(new_url);
    }
    else{
      alert("Problema de conexion con el servidor");
      location.reload();
    }
  })
};

$(document).ready(function( $ ) {
  ping(all_servers.splice(0,1)[0]);
});