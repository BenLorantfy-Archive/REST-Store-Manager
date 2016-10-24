(function($,window,document){
	$.request = function(verb,path,data){
		// [ Format slashes ]
		var host = $.request.host;
		if(host[host.length - 1] == "/"){
			host = host.substr(0,host.length - 1);
		}

		if(path[path.length - 1] != "/"){
			path += "/";
		}

		// [ Creates CORS object ]
		var xhr = createCORSRequest(verb, host + path);
		if (!xhr) {
		  throw new Error('CORS not supported');
		}

		var handler = {
			 doneCallback:function(){}
			,failCallback:function(){}
			,done:function(callback){
				this.doneCallback = callback;
				return this;
			}
			,fail:function(callback){
				this.failCallback = callback;
				return this;
			}
		}

		xhr.onload = function(data){
			handler.doneCallback(data);
		}

		xhr.onerror = function(data){
			handler.failCallback(data);
		}

		xhr.send();

		return handler;
	}

	$.request.host = "";

	// https://www.html5rocks.com/en/tutorials/cors/
	function createCORSRequest(method, url) {
	  var xhr = new XMLHttpRequest();
	  if ("withCredentials" in xhr) {

	    // Check if the XMLHttpRequest object has a "withCredentials" property.
	    // "withCredentials" only exists on XMLHTTPRequest2 objects.
	    xhr.open(method, url, true);

	  } else if (typeof XDomainRequest != "undefined") {

	    // Otherwise, check if XDomainRequest.
	    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
	    xhr = new XDomainRequest();
	    xhr.open(method, url);

	  } else {

	    // Otherwise, CORS is not supported by the browser.
	    xhr = null;

	  }
	  return xhr;
	}

})($,window,document);
