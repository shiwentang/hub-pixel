
function uploadData(){
    var file = document.getElementById("data-upload").files[0];
    console.log(file);
    if (file == undefined) {
        document.getElementById('upload-msg').innerHTML = "Please select a document.";
    }
    else{
        var filename = file.name;
        const reader = new FileReader();
        reader.onload = function(event) {
            const fileBody = event.target.result;
            // console.log(fileBody);
            sdk.uploadBucketKeyPut(
                {'key': filename, 
                'bucket': 'raw-data-hubpixel-bucket'},
                fileBody
            )
            .then((response) =>{
                document.getElementById('upload-msg').innerHTML = "Succeessfully uploaded.";
            })
            .catch((error) => {
            console.log("error", error);
            });
        
        };

        // Read the file as text
        reader.readAsText(file);



    }
}

