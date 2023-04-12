Simon El-zawahri (40078208)
Ellane Zhou (40129985)

Host server username:

index.html
This file contains what is displayed on our web application such as the instructions, and buttons to record, open camera, and upload. It also has two video boxes where one shows the live video feed that is shown through the camera and the other will display the recorded video where it can be played over and over again.

index.js
This file contains mostly what our application is able to do. It contains all the functions that allows our application to access the camera and audio, the functions that start and stop the recording, and the function that segments the video into 3 second long segments to then upload it into the server.

index.php
This is the file that uploads each segment of the MP4 video data into the server. It also connects to the database so that the BLOB can be inserted into the MySQL tables that is created in the file table.sql

index.css
This file contains css of our web application. 
