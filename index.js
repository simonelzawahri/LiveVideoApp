const button = document.querySelector('#button');
const video = document.querySelector('#video');


let mediaRecorder;


button.onclick = () => {
    if (button.style.backgroundColor == "rgb(0, 0, 0)") {
        button.style.backgroundColor = "rgb(255, 40, 40)";
        button.innerText = "Recording";
        startRecording();
    } else {
        button.style.backgroundColor = "rgb(0, 0, 0)";
        button.innerText = "Record";
        stopRecording();
    }
   
}

async function init() {
    // use js navigator obj to ask user for access to webcam
    // use "await" to wait fro user permission (await can only be used in asyn fx)

    // getUserMedia() takes an obj of the type mediaStreamConstraints  -->  ^{}^
    // if this method finds access to audio and video input we can startWebcam()

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: {width: 1280, height: 720, frameRate: 30} });
        startWebcam(stream);
    } catch (err) {
        console.log("Error getting media device.")
        console.log(err)
    }
}

function startWebcam(stream) {
    video.srcObject = stream;
    window.stream = stream;

}

function startRecording() {
    if (video.srcObject === null) {
        video.srcObject = window.stream;
    }
    mediaRecorder = new MediaRecorder(window.stream, {mimeType: 'video/webm;codecs=vp9,opus'});
    mediaRecorder.start();
    mediaRecorder.ondataavailable = recordVideo;
}

function recordVideo(event) {
    if (event.data && event.data.size > 0) {
        video.srcObject = null;
        let videoUrl = URL.createObjectURL(event.data);
        video.src = videoUrl;
    }
}

function stopRecording() {
    mediaRecorder.stop();
}


// call init()
init();