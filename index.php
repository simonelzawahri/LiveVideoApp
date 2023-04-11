<?php

// Database connection 
$servername = "localhost";
$username = "lab2";
$password = "video";
$dbname = "comp445";

// Create a new database connection
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// prepare and bind the insert statement
$stmt = $conn->prepare("INSERT INTO videoSegments (videoType, videoData) VALUES (?, ?)");
$stmt->bind_param("sb", $videoType, $videoData);

// set the video type and data
$videoType = "video/mp4"; 
$videoData = file_get_contents($_FILES['video']['tmp_name']);

// execute the statement
$stmt->execute();

// check for errors in the execution
if ($stmt->errno) {
    echo "Error uploading video: " . $stmt->error;
} else {
    echo "Video uploaded successfully";
}

$stmt->close();
$conn->close();
?>