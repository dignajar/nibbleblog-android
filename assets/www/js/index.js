//======================================================================
// Vars
//======================================================================
var blog_url;
var username;
var password;
var settings_complete;
var image_uri;

//======================================================================
// Events
//======================================================================
document.addEventListener("deviceready", init, false);

//======================================================================
// Functions :: DOM
//======================================================================

function dom_show_element(id)
{
	document.getElementById(id).style.display = 'block';
}

function dom_hide_element(id)
{
	document.getElementById(id).style.display = 'none';
}

function refresh_page() {
  $.mobile.changePage(
    window.location.href,
    {
      allowSamePageTransition : true,
      transition              : 'none',
      showLoadMsg             : false,
      reloadPage              : true
    }
  );
}


//======================================================================
// Functions
//======================================================================

function init()
{
	console.log("Function init()");

	blog_url = window.localStorage.getItem("blog_url");
	if(blog_url!=null)
		$("#js_blog_url").val(blog_url);

	username = window.localStorage.getItem("username");
	if(username!=null)
		$("#js_username").val(username);

	password = window.localStorage.getItem("password");
	if(password!=null)
		$("#js_password").val(password);

	check_settings();
}

// Check settings
// If not complete then show welcome_first element and settings_complete=false
function check_settings()
{
	console.log("Function check_settings()");

	settings_complete = blog_url!=null && username!=null && password!=null;

	if(settings_complete)
	{
		dom_hide_element("welcome_first");
		dom_show_element("welcome_second");
	}
	else
	{
		dom_hide_element("welcome_second");
		dom_show_element("welcome_first");
	}
}

// Success
function success(msg)
{
	console.log("Function success()");

	var obj = jQuery.parseJSON(msg);

	alert(obj.msg);

	// Hide loading
	$.mobile.hidePageLoadingMsg();
}

// Something fail
function fail(msg)
{
	console.log("Function fail()");

	var obj = jQuery.parseJSON(msg);

	alert(obj.msg);

	// Hide loading
	$.mobile.hidePageLoadingMsg();
}

//======================================================================
// Functions :: Photo post
//======================================================================

function photo_success(msg)
{
	console.log("Function photo_success()");

	dom_hide_element("photo_box_second");
	dom_show_element("photo_box_first");

	success(msg);
}

function photo_fail(msg)
{
	console.log("Function photo_fail()");

	dom_hide_element("photo_box_second");
	dom_show_element("photo_box_first");

	fail(msg);
}

// Set photo
function set_photo(imageURI)
{
	console.log("Function set_photo()");

	image_uri = imageURI;
	document.getElementById('js_img_photo').src = imageURI;

	dom_hide_element("photo_box_first");
	dom_show_element("photo_box_second");
}

// take the photo from the album and upload
function get_photo_from_camera()
{
	navigator.camera.getPicture(set_photo, photo_fail, {quality: 95, destinationType: Camera.DestinationType.FILE_URI, targetWidth: 1024, targetHeight: 768, saveToPhotoAlbum: true});
}

// take the photo from the camera and upload
function get_photo_from_album()
{
	navigator.camera.getPicture(set_photo, photo_fail, {quality: 95, destinationType: Camera.DestinationType.FILE_URI, targetWidth: 1024, targetHeight: 768, sourceType: Camera.PictureSourceType.PHOTOLIBRARY});
}

// Transfer file
function upload_photo()
{
	console.log("Function upload_photo()");

	var options = new FileUploadOptions();
	options.fileKey="file";
	options.fileName=image_uri.substr(image_uri.lastIndexOf('/')+1);
	options.mimeType="image/jpeg";

	var params = {};
	params.username = username;
	params.password = password;
	options.params = params;

	var url = encodeURI(blog_url+"/admin/ajax/mobile.php");

	var ft = new FileTransfer();
	ft.upload(image_uri, url, photo_success, photo_fail, options);
}

//======================================================================
// jQuery Events
//======================================================================
$(document).bind('pageinit', function()
{
	$("#js_button_login").on("click", function(event)
	{
		console.log("Event click js_button_login");

		blog_url = $("#js_blog_url").val();
		username = $("#js_username").val();
		password = $("#js_password").val();

		window.localStorage.setItem("blog_url", blog_url);
		window.localStorage.setItem("username", username);
		window.localStorage.setItem("password", password);

		check_settings();

		// Follow the link in href
		return true;
	});

	$("#js_button_album_photo").on("click", function(event)
	{
		console.log("Event click js_button_album_photo");

		get_photo_from_album();

		return false;
	});

	$("#js_button_camera_photo").on("click", function(event)
	{
		console.log("Event click js_button_camera_photo");

		get_photo_from_camera();

		return false;
	});

	$("#js_button_upload_photo").on("click", function(event)
	{
		console.log("Event click js_button_upload_photo");

		$.mobile.showPageLoadingMsg("a", "Uploading...");

		upload_photo();

		return false;
	});

	$("#js_button_publish_text").on("click", function(event)
	{
		$.mobile.showPageLoadingMsg("a", "Uploading...");

		var url = "http://www.nibbleblog.com/up/admin/ajax/mobile.php";
		var title = $("#js_title").val();
		var content = $("#js_content").val();

		$.ajax({
			url: url,
			data: {type: "simple", username: username, password: password, title: title, content: content},
			dataType: 'jsonp',
			success: function(msg) {
				success(msg);
				refresh_page();
			},
            error: fail
		});


		return false;
	});

});
