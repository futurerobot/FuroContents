var express = require('express');
var ejs = require('ejs');
var app = express();
var bodyParser = require('body-parser');
var compression = require('compression');
var path = require('path');
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var fs = require('fs');
var soap = require('soap');
var url = 'http://localhost:24286/FuroS6/Services?singleWsdl';
var nullParam = {};
var soapClient;
var ext = require('content_type').ext;
var hue = require('node-hue-api');
var HueApi = hue.HueApi;
var anonyHue = new HueApi();
var hueHost;
var userName = '2bf66a3a22cf107719107fa62cb8f593';
var userDescription;

var displayBridges = function(bridge) {
	console.log('Hue Bridges Found : ' + JSON.stringify(bridge));
};

var displayUserResult = function(result) {
    console.log("Created user: " + JSON.stringify(result));
};

var displayResult = function(result) {
	console.log(JSON.stringify(result, null, 2));
};

var displayError = function(err) {
    console.log(err);
};

hue.locateBridges(function(err, result) {
	if (err) throw err;
	hueHost = result[0].ipaddress;
	displayBridges(result);

	//anonyHue.createUser(hueHost, null, null)
	//    .then(displayUserResult)
	//    .fail(displayError)
	//    .done();

	anonyHue.registerUser(hueHost, userName, userDescription, function(err, user) {
		if (err) throw err;
		userName = user;
		displayUserResult(user);

		var api = new HueApi(hueHost, userName);

		api.connect(function(err, config) {
			if (err) throw err;
			displayResult(config);

			api.lights().then(displayResult).done();

			var lightState = hue.lightState;
			var state = lightState.create().on().rgb(255,0,0);

			api.setLightState(3, state).then(displayResult).done();
		});
	});
});

//var colorIndex = 1;
//setInterval(function() {
//	colorIndex = colorIndex << 1;
//	if (colorIndex >= 1 << 24)
//		colorIndex = 1;
//	var state = lightState.create().on().rgb(colorIndex >> 16 & 0xFF, colorIndex >> 8 & 0xFF, colorIndex & 0xFF);
//	console.log(colorIndex);
//	api.setLightState(3, state);
//},100);


// Using the .html extension instead of
// having to name the views as *.ejs
app.engine('.html', ejs.__express);
 
// Set the folder where the pages are kept
app.set('views', path.join(__dirname, 'views'));

// This avoids having to provide the 
// extension to res.render()
app.set('view engine', 'html');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));


// Serve the index page
app.get('*', function(req, res){
	//var contentType = ext.getContentType(ext.getExt(req.url));
	var url = req.url.substring(1, req.url.length);
  res.render(url, {
    pageTitle: 'Furo Content'
  });
});

if (!module.parent) {
  server.listen(8080);
  console.log('Listening on http://localhost:8080...');

	soap.createClient(url, function(err, client) {
		soapClient = client;
	});
	console.log("SOAP client is created.");
}



// this handles socket.io comm from html files
io.sockets.on('connection', function(socket) {
    socket.send('connected...');
 
    socket.on('message', function(data) {
		var cmd = data.substring(0, data.indexOf('.'));
		var para = data.substring(data.indexOf('.')+1, data.length);
		var paras = para.split(',');

		console.log('CMD ==> '+cmd);
		console.log('PARA ==> '+para);

		switch (cmd)
		{
		case 'ChangeLanguage': ChangeLanguage(para); break;
		case 'PlaySpeech': PlaySpeech(para); break;
		case 'StopSpeech': StopSpeech(); break;
		case 'SetVoiceRecognition': SetVoiceRecognition(para); break;
		case 'StartHumanFollowing': StartHumanFollowing(para); break;
		case 'StartFaceTracking': StartFaceTracking(para); break;
		case 'InitPose': InitPose(); break;
		case 'SetHeadRoll': SetHeadRoll(paras[0], paras[1]); break;
		case 'SetHeadPitch': SetHeadPitch(paras[0], paras[1]); break;
		case 'SetHeadYaw': SetHeadYaw(paras[0], paras[1]); break;
		case 'SetWaistPitch': SetWaistPitch(paras[0], paras[1]); break;
		case 'SetWristPitch': SetWristPitch(paras[0], paras[1]); break;
		case 'DriveWheel': DriveWheel(paras[0], paras[1]); break;
		case 'MoveWheel': MoveWheel(paras[0], paras[1]); break;
		case 'RotateWheel': RotateWheel(paras[0], paras[1]); break;
		case 'StopWheel': StopWheel(); break;
		case 'PlayBehavior': PlayBehavior(para); break;
		case 'StopBehavior': StopBehavior(); break;
		}
        return;
    });
 
    socket.on('disconnect', function() {
        socket.send('disconnected...');
    });
});


function ChangeLanguage(language)
{
	switch (language)
	{
	case 'en-us':
		var state = lightState.create().on().rgb(255,0,0);
	    api.setLightState(3, state).then(displayResult).done();
		break;	
	case 'ko-kr':
		var state = lightState.create().on().rgb(255,255,255);
	    api.setLightState(3, state).then(displayResult).done();
		break;	
	case 'zh-cn':
		var state = lightState.create().on().rgb(0,255,0);
	    api.setLightState(3, state).then(displayResult).done();
		break;	
	case 'ja-jp':
		var state = lightState.create().on().rgb(0,0,255);
	    api.setLightState(3, state).then(displayResult).done();
		break;	
	}

	var args = { 'language' : language };
	soapClient.ChangeLanguage(args, soapCallback);
}

function PlaySpeech(speechData)
{
	var args = { 'speechData' : speechData };
	soapClient.PlaySpeech(args, soapCallback);
}

function StopSpeech()
{
	soapClient.StopSpeech(nullParam, soapCallback);
}

function SetVoiceRecognition(isEnable)
{
	var args = { 'isEnable' : isEnable };
	soapClient.SetVoiceRecognition(args, soapCallback);
}

function StartHumanFollowing(isEnable)
{
	var args = { 'isEnable' : isEnable };
	soapClient.StartHumanFollowing(args, soapCallback);
}

function StartFaceTracking(isEnable)
{
	var args = { 'isEnable' : isEnable };
	soapClient.StartFaceTracking(args, soapCallback);
}

function InitPose()
{
	soapClient.InitPose(nullParam, soapCallback);
}

function SetHeadRoll(roll, velocity)
{
	var args = { 'roll' : roll, 'velocity' : velocity };
	soapClient.SetHeadRoll(args, soapCallback);
}

function SetHeadPitch(pitch, velocity)
{
	var args = { 'pitch' : pitch, 'velocity' : velocity };
	soapClient.SetHeadPitch(args, soapCallback);
}

function SetHeadYaw(yaw, velocity)
{
	var args = { 'yaw' : yaw, 'velocity' : velocity };
	soapClient.SetHeadYaw(args, soapCallback);
}

function SetWaistPitch(pitch, velocity)
{
	var args = { 'pitch' : pitch, 'velocity' : velocity };
	soapClient.SetWaistPitch(args, soapCallback);
}

function SetWristPitch(pitch, velocity)
{
	var args = { 'pitch' : pitch, 'velocity' : velocity };
	soapClient.SetWristPitch(args, soapCallback);
}

function DriveWheel(linearVelocity, angularVelocity)
{
	var args = { 'linearVelocity' : linearVelocity, 'angularVelocity' : angularVelocity };
	soapClient.DriveWheel(args, soapCallback);
}

function MoveWheel(distance, linearVelocity)
{
	var args = { 'distance' : distance, 'linearVelocity' : linearVelocity };
	soapClient.MoveWheel(args, soapCallback);
}

function RotateWheel(degree, angularVelocity)
{
	var args = { 'degree' : degree, 'angularVelocity' : angularVelocity };
	soapClient.RotateWheel(args, soapCallback);
}

function StopWheel()
{
	soapClient.StopWheel(nullParam, soapCallback);
}

function PlayBehavior(behavior)
{
	var args = { 'behavior' : behavior };
	soapClient.PlayBehavior(args, soapCallback);
}

function StopBehavior()
{
	soapClient.StopBehavior(nullParam, soapCallback);
}

function soapCallback(err, result)
{
	//socket.send(result);
}
