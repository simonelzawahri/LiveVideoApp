<?php

$target_dir = "uploads/";
$target_file = $target_dir . basename($_FILES["segment"]["name"]);
$file = $_FILES['segment']['tmp_name'];

if (move_uploaded_file($_FILES["segment"]["tmp_name"], $target_file)) {
    echo "The file ". htmlspecialchars(basename($_FILES["segment"]["name"])). " has been uploaded.";
} else {
    echo "There was an error uploading your file.";
}

// Database connection 
$servername = "localhost";
$username = "root";
$password = "mysql";
$dbname = "comp445";

// Create a new database connection
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the blob data from the uploaded file
$file = $_FILES["file"]["tmp_name"];
$blobData = addslashes(file_get_contents($file));

// Prepare and bind the SQL statement
$stmt = $conn->prepare("INSERT INTO videoSegments (videoType, videoData) VALUES (?, ?)");
$stmt->bind_param("ss", $videoType, $blobData);

// Set the parameters and execute the statement
$videoType = "video/mp4"; // Set the video type here
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