//======================================================================
// Vars
//======================================================================
var blog_url;
var username;
var password;

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

	if(blog_url!=null && username!=null && password!=null)
		$.mobile.changePage("dashboard.html");
}

// Success
function success(message)
{
	console.log("Code = " + message.responseCode);
	console.log("Response = " + message.response);
	console.log("Sent = " + message.bytesSent);

	alert("Uploaded");

	hide_photo();

	// Hide loading
	$.mobile.hidePageLoadingMsg();
}

// Something fail
function fail(message)
{
	alert('Failed because: ' + message);

	hide_photo();

	// Hide loading
	$.mobile.hidePageLoadingMsg();
}

// Set photo
function set_photo(img)
{
	image_uri = img;

	var image_block = document.getElementById('js_img_photo');
	image_block.src = image_uri;

	return true;
}

// Show photo and upload button
function show_photo()
{
	var box_first = document.getElementById('photo_box_first');
	var box_second = document.getElementById('photo_box_second');

	box_first.style.display = 'none';
	box_second.style.display = 'block';
}

function hide_photo()
{
	var box_first = document.getElementById('photo_box_first');
	var box_second = document.getElementById('photo_box_second');

	box_first.style.display = 'block';
	box_second.style.display = 'none';
}

// take the photo from the album and upload
function get_photo_from_camera()
{
	navigator.camera.getPicture(set_photo, fail, {quality: 95, destinationType: destinationType.FILE_URI, targetWidth: 1024, targetHeight: 768, saveToPhotoAlbum: true});

	show_photo();
}

// take the photo from the camera and upload
function get_photo_from_album()
{
	navigator.camera.getPicture(set_photo, fail, {quality: 95, destinationType: destinationType.FILE_URI, targetWidth: 1024, targetHeight: 768, sourceType: pictureSource.PHOTOLIBRARY});

	show_photo();
}

// Transfer file
function upload_photo()
{
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
		event.preventDefault();

		blog_url = $("#js_blog_url").val();
		username = $("#js_username").val();
		password = $("#js_password").val();

		window.localStorage.setItem("blog_url", blog_url);
		window.localStorage.setItem("username", username);
		window.localStorage.setItem("password", password);

		console.log(blog_url);
		console.log(username);
		console.log(password);

		// Change page
		$.mobile.changePage("dashboard.html");
	});

	$("#js_button_album_photo").on("click", function(event)
	{
		event.preventDefault();

		get_photo_from_album();
	});

	$("#js_button_camera_photo").on("click", function(event)
	{
		event.preventDefault();

		get_photo_from_camera();
	});

	$("#js_button_upload_photo").on("click", function(event)
	{
		event.preventDefault();

		$.mobile.showPageLoadingMsg("a", "Uploading...");

		upload_photo();
	});

});
