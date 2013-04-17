//======================================================================
// Vars
//======================================================================
var blog_url;
var username;
var password;
var settings_complete;

var pictureSource;   // picture source
var destinationType; // sets the format of returned value

var image_uri;

//======================================================================
// Events
//======================================================================
document.addEventListener("deviceready", init, false);

//======================================================================
// Functions
//======================================================================

function init()
{
	console.log("Function init()");

	pictureSource = navigator.camera.PictureSourceType;
	destinationType = navigator.camera.DestinationType;

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
	settings_complete = blog_url!=null && username!=null && password!=null;

	if(settings_complete)
	{
		hide_element("welcome_first");
		show_element("welcome_second");
	}
	else
	{
		hide_element("welcome_second");
		show_element("welcome_first");
	}
}

function show_element(id)
{
	document.getElementById(id).style.display = 'block';
}

function hide_element(id)
{
	document.getElementById(id).style.display = 'none';
}

// Success
function success(message)
{
	console.log("Function success()");
	console.log("Code = " + message.responseCode);
	console.log("Response = " + message.response);
	console.log("Sent = " + message.bytesSent);

	alert("Uploaded");

	show_hide_photo(false);

	// Hide loading
	$.mobile.hidePageLoadingMsg();
}

// Something fail
function fail(message)
{
	console.log("Function fail()");
	alert('Failed because: ' + message);

	show_hide_photo(false);

	// Hide loading
	$.mobile.hidePageLoadingMsg();
}

// Set photo
function set_photo(imageURI)
{
	console.log("Function set_photo()");
	image_uri = imageURI;

	var image_block = document.getElementById('js_img_photo');
	image_block.src = imageURI;

	show_hide_photo(true);
}

// Show or Hide photo and upload button
function show_hide_photo(show)
{
	console.log("Function show_photo()");

	var box_first = document.getElementById('photo_box_first');
	var box_second = document.getElementById('photo_box_second');

	if(show)
	{
		box_first.style.display = 'none';
		box_second.style.display = 'block';
	}
	else
	{
		box_first.style.display = 'block';
		box_second.style.display = 'none';
	}
}

// take the photo from the album and upload
function get_photo_from_camera()
{
	navigator.camera.getPicture(set_photo, fail, {quality: 95, destinationType: Camera.DestinationType.FILE_URI, targetWidth: 1024, targetHeight: 768, saveToPhotoAlbum: true});
}

// take the photo from the camera and upload
function get_photo_from_album()
{
	navigator.camera.getPicture(set_photo, fail, {quality: 95, destinationType: Camera.DestinationType.FILE_URI, targetWidth: 1024, targetHeight: 768, sourceType: Camera.PictureSourceType.PHOTOLIBRARY});
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
	console.log(url);

	var ft = new FileTransfer();
	ft.upload(image_uri, url, success, fail, options);
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

		check_settings()

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

});
