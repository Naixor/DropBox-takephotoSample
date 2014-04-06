(function ($) {
	$.fn.takePhoto = function (options, callback) {
		var setting = {
			LOCALMEDIA: "local_media",
			TAKETARGET: "photo_canvas",
			CAMERA_W:   "500",
			CAMERA_H: 	""
		}

		if (options) {
			$.extend(true, setting, options);
		}

		function checkElementID(id) {
			return !id.split('#')[1] ? '#'+id.split('#')[0] : id; 
		}

		return this.each(function () {
			var $this = $(this);
			var video = document.querySelector("video");
			var canvas = document.querySelector('canvas');
			/*   特别注意这里浪费了我2个小时的时间：
			*    原先代码使用一直习惯风格：var video = $(checkElementID(settig.LOCALMEDIA))
			*    然后后面video.play()就会报错说[object object].....大致就是不能调用play()这个对象
			*	 play()居然是对象，好吧。最后使用document元素才好，这看来是jQuery没考虑好的呢~
			*    
			*    下面的canvas同理呢，顿时石化，这是要我来回切换代码风格吗？
			# WARNING: jQuery把**转换为Object之后是不能使用原来docuemnt内的东西，但是他自己有没给封装进去
			*          好长时间没有摸js了居然三观全毁
			*/
			//var canvas = $(checkElementID(setting.TAKETARGET));

			$(checkElementID(setting.LOCALMEDIA)).css({
				width: setting.CAMERA_W + 'px',	
				height: setting.CAMERA_H + 'px'
			});

			
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

			var constraints = {audio: false, video: true};

			function successCallback(stream) {
			  	window.stream = stream; 
			  	if (window.URL) {
			    	video.src = window.URL.createObjectURL(stream);
			  	} else {
			   	 	video.src = stream;
			  	}
			  	video.play();
			}

			function errorCallback(error){
			  console.log("navigator.getUserMedia error: ", error);
			}

			navigator.getUserMedia(constraints, successCallback, errorCallback);

			var width = video.videoWidth;
			var ctx = canvas.getContext('2d');

			function snapshot() {
			  	if (window.stream) {
				  	canvas.width = video.videoWidth;
				  	canvas.height = video.videoHeight;
				  	ctx.drawImage(video, 0, 0);
				  	canvas.style.display = "block";

				  	$("#btn_upload").show('fast', function() {
				  		this.addEventListener('click', function (e) {
				  			(callback && typeof(callback) === "function") && callback();
				  		}, false);
				  	});	
			  	}
			}

			video.addEventListener('click', snapshot, false);

		});
	}
})(jQuery);