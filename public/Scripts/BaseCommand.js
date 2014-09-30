<!--
// v3.0
// Command to Robot
// Copyright FutureRobot Co.,Ltd.  All rights reserved.
var socket;

$(function(){
	socket = io.connect('http://localhost:8080');

	socket.on('connect', function() {
		$('#messages').append('<li>Connected to the server.</li>');
	});

	socket.on('message', function(message) {
		$('#messages').append('<li>' + message + '</li>');
	});

	socket.on('disconnect', function() {
		$('#messages').append('<li>Disconnected from the server.</li>');
	});
});

function SendCommand(message)
{
	socket.send(message);
}


///////////////////////  대화  ///////////////////////
function ChangeLanguage(language)
{
	var lang = language;
	if( language == "korean" ) lang = "ko_kr";
	else if( language == "english" ) lang = "en_us";
	else if( language == "japanese" ) lang = "ja_jp";
	else if( language == "chinese" ) lang = "zh_cn";
	g_language = language;
		
	SendCommand('ChangeLanguage.'+lang);
}

function PlayDialog(dialogID)
{
	window.external.PlayDialog(dialogID);
}

function PlaySpeech(speechData)
{
	SendCommand('PlaySpeech.'+speechData);
}

function StopSpeech()
{
	SendCommand('StopSpeech.');
}
///////////////////////  대화 관련  ///////////////////////


///////////////////////  서비스  ///////////////////////
function SetVoiceRecognition(isEnable)
{
	SendCommand('SetVoiceRecognition.'+isEnable);
}

function StartHumanFollowing(isEnable)
{
	SendCommand('StartHumanFollowing.'+isEnable);
}

function StartFaceTracking(isEnable)
{
	SendCommand('StartFaceTracking.'+isEnable);
}
///////////////////////  서비스  ///////////////////////


///////////////////////  구동 관련  /////////////////////// 
function InitPose()
{
	SendCommand('InitPose.');
}

function SetHeadRoll(roll, velocity)
{
	SendCommand('SetHeadRoll.'+roll+','+velocity);
}

function SetHeadPitch(pitch, velocity)
{
	SendCommand('SetHeadPitch.'+pitch+','+velocity);
}

function SetHeadYaw(yaw, velocity)
{
	SendCommand('SetHeadYaw.'+yaw+','+velocity);
}

function SetWaistPitch(pitch, velocity)
{
	SendCommand('SetWaistPitch.'+pitch+','+velocity);
}

function SetWristPitch(pitch, velocity)
{
	SendCommand('SetWristPitch.'+pitch+','+velocity);
}

function DriveWheel(linearVelocity, angularVelocity)
{
	SendCommand('DriveWheel.'+linearVelocity+','+angularVelocity);
}

function MoveWheel(distance, linearVelocity)
{
	SendCommand('MoveWheel.'+distance+','+linearVelocity);
}

function RotateWheel(degree, angularVelocity)
{
	SendCommand('RotateWheel.'+degree+','+angularVelocity);
}

function StopWheel()
{
	SendCommand('StopWheel.');
}

function PlayBehavior(behavior)
{
	SendCommand('PlayBehavior.'+behavior);
}

function StopBehavior()
{
	SendCommand('StopBehavior.');
}
///////////////////////  구동 관련  /////////////////////// 


///////////////////////  컨텐츠 관련  /////////////////////// 
function CloseProgram()
{
	window.close();
}

function ShowControl(params)
{
	//window.external.ShowControl(params);
}

function HideControl(params)
{
	//window.external.HideControl(params);
}

function MoveControl(params)
{
	//window.external.MoveControl(params);
}
///////////////////////  컨텐츠 관련  /////////////////////// 


function ShutDown()
{
	window.external.ShutDown();
}

function GetRobotID()
{
	return window.external.GetRobotID();
}
// -->
