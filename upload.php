<?php

    if(isset($_FILES)){
        $temp_file = $_FILES['file']['tmp_name'];
        $uploads_folder = "./uploads/";

        $temp = explode(".", $_FILES["file"]["name"]);
        $newfilename = round(microtime(true)) . '.' . end($temp);
        $upload = move_uploaded_file($_FILES["file"]["tmp_name"], $uploads_folder . $newfilename);

        if($upload == true){
            echo $newfilename;
        }
    }
    
?>