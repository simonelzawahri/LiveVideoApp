// HTML elements
const liveVid = document.querySelector('#main #videos #liveVid');
const recordedVid = document.querySelector('#main #videos #recordedVid');
const recordBtn = document.querySelector('#main #controls #recordButton');
const openCamBtn = document.querySelector('#main #controls #openCamButton');
const uploadBtn = document.querySelector('#main #controls #uploadButton');
const successMessage = document.querySelector('#main #uploadMessage #uploadSuccess');
const failMessage = document.querySelector('#main #uploadMessage #uploadFail');


// global variables
let mediaRecorder;
let recordedChunks = [];
let recordedBlob = null;




const constraints = {
    audio: true,
    video: {
        width: { exact: 1280 },
        height: { exact: 720 },
        frameRate: { ideal: 30, max: 30 },
    },
};

navigator.mediaDevices.getUserMedia(constraints)
    .then(mediaStream => {

        // openCam button functionality, connect/disconnect mediaStream
        openCamBtn.onclick = () => {
            if (openCamBtn.style.backgroundColor == "rgb(0, 0, 0)") {
                openCamBtn.style.backgroundColor = "rgb(255, 40, 40)";
                openCamBtn.innerText = "Cam Open";
                // connect mediaStream to liveVid element 
                liveVid.srcObject = mediaStream;
                liveVid.onloadedmetadata = () => {
                    liveVid.play();
                }
            } else {
                openCamBtn.style.backgroundColor = "rgb(0, 0, 0)";
                openCamBtn.innerText = "Open Cam";
                // else disconnect
                liveVid.srcObject = null;
            }
        }


        // record button functionality, start and stop recording
        recordBtn.onclick = () => {
            // if recordBtn is black && openCamBtn is red
            if (recordBtn.style.backgroundColor == "rgb(0, 0, 0)" &&
                openCamBtn.style.backgroundColor == "rgb(255, 40, 40)") {

                recordBtn.style.backgroundColor = "rgb(255, 40, 40)";
                recordBtn.innerText = "Recording";
                mediaRecorder = new MediaRecorder(mediaStream);
                // while recording push data to recordedChunks array
                mediaRecorder.ondataavailable = (event) => {
                    if (event.data && event.data.size > 0) {
                        recordedChunks.push(event.data);
                    }
                }
                // start recording
                mediaRecorder.start();
                console.log(mediaRecorder.state);

            }
            // else change recordBtn to black and stop recording
            else {
                recordBtn.style.backgroundColor = "rgb(0, 0, 0)";
                recordBtn.innerText = "Record";
                mediaRecorder.onstop = () => {
                    // on stop, store recordedChunks ARRAY in recordedBlob BLOB 
                    recordedBlob = new Blob(recordedChunks, { type: 'video/mp4' });
                    // clear array
                    recordedChunks = [];
                    // create a object url that can be used as the video src for recordedVid
                    let videoUrl = window.URL.createObjectURL(recordedBlob);
                    // assign url to src
                    recordedVid.src = videoUrl
                };
                // stop recording
                mediaRecorder.stop();
                console.log(mediaRecorder.state);
            }
        }



        // upload button functionality, when clicked -> upload BLOB to server and display success/fail message
        uploadBtn.onclick = () => {
            // call the function to segment and upload the recordedBlob to DB
            // fx should return true or false for success or failure
            let status = segmentAndUpload(recordedBlob)
            if (status == true) {
                successMessage.style.display = "block"
            } else if (status == false) {
                failMessage.style.display = "block"
            }


        }


    })
    .catch(error => console.error(error));




async function segmentAndUpload(blob) {
    const segmentLength = 3000; // 3 seconds in milliseconds
    const segmentCount = Math.ceil(blob.size / segmentLength);
    const segments = [];

    for (let i = 0; i < segmentCount; i++) {
        const start = i * segmentLength;
        const end = Math.min(start + segmentLength, blob.size);
        const segmentBlob = blob.slice(start, end);
        segments.push(segmentBlob);
    }

    const formData = new FormData();
    for (let i = 0; i < segments.length; i++) {
        formData.append('videoData', segments[i], `segment_${i}.mp4`);
    }

    // upload segments to server using the fetch() method
    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            console.log('Video uploaded successfully');
            return true;
        } else {
            console.error('Failed to upload video');
            return false;
        }
    } catch (error) {
        console.error(error);
    }
}












// async function init() {
//     // use js navigator obj to ask user for access to webcam
//     // use "await" to wait fro user permission (await can only be used in asyn fx)

//     // getUserMedia() takes an obj of the type mediaStreamConstraints  -->  ^{}^
//     // if this method finds access to audio and video input we can startWebcam()

//     try {
//         const stream = await navigator.mediaDevices.getUserMedia(
//             {
//                 audio: true,
//                 video: {
//                     width: 1280,
//                     height: 720,
//                     frameRate: {ideal: 30, max: 30}
//                 }
//             }
//         );
//         startWebcam(stream);
//     } catch (err) {
//         console.log("Error getting media device.")
//         console.log(err)
//     }
// }

// function startWebcam(stream) {
//     video.srcObject = stream;
//     window.stream = stream;

// }

// function startRecording() {
//     if (video.srcObject === null) {
//         video.srcObject = window.stream;
//     }
//     mediaRecorder = new MediaRecorder(window.stream, {mimeType: 'video/webm;codecs=vp9,opus'});
//     mediaRecorder.start();
//     mediaRecorder.ondataavailable = recordVideo;
// }

// function recordVideo(event) {
//     if (event.data && event.data.size > 0) {
//         video.srcObject = null;
//         let videoUrl = URL.createObjectURL(event.data);
//         video.src = videoUrl;
//     }
// }

// function stopRecording() {
//     mediaRecorder.stop();
// }


// // call init()
// init();