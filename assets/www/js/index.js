//======================================================================
// Vars
//======================================================================
var blog_url;
var username;
var password;

var pictureSource;   // picture source
var destinationType; // sets the format of returned value

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

	// Hide loading
	$.mobile.hidePageLoadingMsg();
}

// Fail
function fail(message)
{
	alert('Failed because: ' + message);

	// Hide loading
	$.mobile.hidePageLoadingMsg();
}

// take the photo from the album and upload
function take_photo() {
	navigator.camera.getPicture(upload_photo, fail, {quality: 95, destinationType: destinationType.FILE_URI, targetWidth: 1024, targetHeight: 768});
}

// take the photo from the camera and upload
function get_photo() {
	navigator.camera.getPicture(upload_photo, fail, {quality: 95, destinationType: destinationType.FILE_URI, sourceType: pictureSource.PHOTOLIBRARY, targetWidth: 1024, targetHeight: 768});
}

// Transfer file
function upload_photo(imageURI) {

	var options = new FileUploadOptions();
	options.fileKey="file";
	options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
	options.mimeType="image/jpeg";

	var params = {};
	params.username = username;
	params.password = password;
	options.params = params;

	var url = encodeURI(blog_url+"/admin/ajax/mobile.php");
	console.log(url);

	var ft = new FileTransfer();
	ft.upload(imageURI, url, success, fail, options);
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

	$("#js_button_up_photo").on("click", function(event)
	{
		event.preventDefault();

		$.mobile.showPageLoadingMsg("a", "Uploading...");

		get_photo();
	});

	$("#js_button_take_photo").on("click", function(event)
	{
		event.preventDefault();

		$.mobile.showPageLoadingMsg("a", "Uploading...");

		take_photo();
	});

});
