(function ($) {
	$.fn.Dropbox = function (options){
		var setting = {
			DROPBOX_APP_KEY: "",
			DROPBOX_SECRET: "",
			STARTEVENT: 	 ""
		}  

		if (options) {
			$.extend(true, setting, options);
		}else {
			alert("DROPBOX_APP_KEY should not be null");
		}
		
		Date.prototype.Format = function (fmt) { 
			var o = {
				"M+": this.getMonth() + 1, 
				"d+": this.getDate(), 
				"h+": this.getHours(), 
				"m+": this.getMinutes(),  
		        "s+": this.getSeconds(), 
		        "q+": Math.floor((this.getMonth() + 3) / 3), 
		        "S": this.getMilliseconds() 
		    };
		    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		    for (var k in o)
		    	if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		    return fmt;
		 }

		return this.each(function() {
			 /* iterate through array or object */
			var $this = $(this);
			var client = new Dropbox.Client({key:setting.DROPBOX_APP_KEY, secret:setting.DROPBOX_SECRET});
			var s = setting.STARTEVENT.split('#');
			if (!s[1])
				setting.STARTEVENT = '#'+s[0];
			else
			 	;
			
			$(setting.STARTEVENT).click(function(event) {
			 	/* Act on the event */
			 	console.log("click");
			 	event.preventDefault()
				client.authenticate();
			});

			client.authenticate({interactive:false}, function (error) {
				if (error) {
					alert('Authentication error: ' + error);
				}
			});	

			if (client.isAuthenticated()) {
				$(setting.STARTEVENT).hide('fast', function() {
					$('#camera').show('fast', function() {
						
					});
					$('#local_media').takePhoto({
						CAMERA_W: "400px"
					}, function () {
						var image = new Image();
						image.src = document.querySelector("canvas").toDataURL("image/jpeg");
						/*var cursor = {
							"tag":setting.DROPBOX_APP_KEY,
							"offset":Math.ceil(image.fileSize/1024)
						};
						
						client.resumableUploadStep(image, cursor, function (error) {
							alert(error);
						});*/

						var userName = "";
						client.getAccountInfo(function(error, accountInfo) {
						  	if (error) {
						    	return showError(error);  // Something went wrong.
						  	}

						  	userName = accountInfo.name;
						});
						

						client.writeFile("/photos/"+new Date().Format("yyyy-MM-dd-HH:mm:ss")+'.jpeg', (image.src), {"noOverwrite":true}, function (error, stat) {
							if (error){
								alert("upload error, please retry");
								return;
							}
							else if (stat)
								alert("File saved as revision " + stat.size);
							
							alert("Fine "+userName+" you have upload this photo to your Dropbox."+stat.path);
						});
					});
				});
			}
		}); 
	}
})(jQuery);
