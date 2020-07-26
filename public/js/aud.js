URL = window.URL || window.webkitURL;

var strm; 						//stream from getUserMedia()
var rec; 					        //Recorder.js object
var input; 							//MediaStreamAudioSourceNode we'll be recording
// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; //audio context to help us record

var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");

//add events to those 2 buttons
recordButton.addEventListener("click", start);
stopButton.addEventListener("click", stopRecording);
pauseButton.addEventListener("click", pause);

function start(){
    recordButton.disabled = true;
    stopButton.disabled = false;
    pauseButton.disabled = false;
    console.log("starting to record");

    navigator.mediaDevices.getUserMedia({audio:true,video:false}).then(function(stream){
       strm = stream;
       audioContext = new AudioContext();
       input = audioContext.createMediaStreamSource(stream);
       rec = new Recorder(input,{numChannels:1});
       rec.record();
       console.log("recording");
    }).catch(function (err){
        recordButton.disabled = false;
    	stopButton.disabled = true;
    	pauseButton.disabled = true;
    });
}
function pause(){
    console.log("stopping");
    if (rec.recording){
        rec.stop();
        pauseButton.innerHTML = "Resume";
    }
    else{
        rec.record();
        pauseButton.innerHTML = "Pause";
    }
}

function stopRecording() {
	console.log("stopButton clicked");

	//disable the stop button, enable the record too allow for new recordings
	stopButton.disabled = true;
	recordButton.disabled = false;
	pauseButton.disabled = true;

	//reset button just in case the recording is stopped while paused
	pauseButton.innerHTML="Pause";
	
	//tell the recorder to stop the recording
	rec.stop();

	//stop microphone access
	strm.getAudioTracks()[0].stop();

	//create the wav blob and pass it on to createDownloadLink
	rec.exportWAV(createDownloadLink);
}


function createDownloadLink(blob) {
	
	var url = URL.createObjectURL(blob);
	var au = document.createElement('audio');
	var li = document.createElement('li');
	var link = document.createElement('a');

	//name of .wav file to use during upload and download (without extendion)
	var filename = new Date().toISOString();

	//add controls to the <audio> element
	au.controls = true;
    au.src = url;
    console.log(url)

	//save to disk link
	link.href = url;
	link.download = filename+".wav"; //download forces the browser to donwload the file using the  filename
	link.innerHTML = "Download";

	//add the new audio element to li
	li.appendChild(au);
	
	//add the filename to the li
	li.appendChild(document.createTextNode(filename+".wav "))

	//add the save to disk link to li
	li.appendChild(link);
	
	//upload link
	var upload = document.createElement('a');
	upload.href="/";
	upload.innerHTML = "Upload";
	upload.addEventListener("click", function(event){
		  var xhr=new XMLHttpRequest();
		  xhr.onload=function(e) {
		      if(this.readyState === 4) {
		          console.log("Server returned: ",e.target.responseText);
		      }
		  };
		  var fd=new FormData();
		  fd.append("audio_data",blob, filename);
		  xhr.open("POST","upload.php",true);
		  xhr.send(fd);
	})
	li.appendChild(document.createTextNode (" "))//add a space in between
	li.appendChild(upload)//add the upload link to li

	//add the li element to the ol
    recordingsList.appendChild(li);
}