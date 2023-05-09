// cognito
var idToken = null;
var customerEmail = null;
var customerName = null;
var age_info = null;
var topic_info = null;
var state_info = null;

var accessKey = ''
var secretKey = ''

function auth() {
    // AWS.config.update({
    //     region: "us-east-1"});
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId : '',
            Logins : {"": idToken}
          });
    AWS.config.update({
        region: 'us-east-1',
        apiVersion: 'latest',
        credentials: {
            accessKeyId: accessKey,
            secretAccessKey: secretKey
        }
    })
}


// store information to dynamodb
AWS.config.update({
    region: 'us-east-1',
    apiVersion: 'latest',
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey
    }
  })

const docClient = new AWS.DynamoDB.DocumentClient();

function insert(customerEmail, customerName){

    const params = {
        TableName: 'company-profiles',
        Item: {
          email:customerEmail,
          name: customerName,
          viewNum: 0,
          uploadNum: 0,
        },
      };

      docClient.put(params, (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("data uploaded");
      });
}
  
var x = document.cookie;
console.log("get cookie", x);


// need to change when deploy
var url_string = window.location.href;
// url for testing
// var url_string = "https://frontend-hubpixel.s3.amazonaws.com/index.html#id_token=eyJraWQiOiJZbm9FZFowWUhSRndWZUZxcTZuY1lReFwvaFI3c1NpdTY2WlErMmVFZjg2MD0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiWnFaakE2Y2xpUWRoNVNJYm5jWmxjQSIsInN1YiI6ImUxYzM5NDBiLTg2MzYtNDRkNi04ZTM1LTJjYjI3ZjZmYWE0NSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9scWg5MnhLQ1IiLCJjb2duaXRvOnVzZXJuYW1lIjoiZTFjMzk0MGItODYzNi00NGQ2LThlMzUtMmNiMjdmNmZhYTQ1IiwiYXVkIjoiNjI5bGs3ZG1sdGZwaWMydjJiNzBkMWRqY3AiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY4MzQzMzMwNiwiZXhwIjoxNjgzNDM2OTA2LCJpYXQiOjE2ODM0MzMzMDYsImp0aSI6ImViNGY0Zjc1LTgxNzQtNGJkMC04NWE2LTNjYTZhM2I5ODcyZSIsImVtYWlsIjoiY29tczY5OThjbG91ZGNvbXB1dGluZ0BnbWFpbC5jb20ifQ.O0_oQ0CU0mbwV77olr6wbYQwLCYfdMVEmKHccC6UXvt-bltWdgxytEygvF_IDfM_5zQB1-oQ8scyuerCsMycCCXwVZ8ic0SEQsZkkwMbnsSF8uzV6S2VA70Z1_yNn3kHno6ePjOIBVZOMLZl9iGqexRI1cvQ3nGq2jZPH9a8fmEC3vRBMBQHn7qSQQI9YKOITHRJV1zpHmsyJlmTDEA8EcJjWxs5cA28NiMvD8eCPZlyqH2MAZ_abvKbYL_d2D-E8r851xYy4Udq6v1XoKxevD-Zm-GT1W3_siokvAwzF_ayPW0gL9O9UYjcCOD9XAEXaLgLVFMKqNNDnFgMCrolzg&access_token=eyJraWQiOiJ0UjdZWVNkdWYyenhobFhIa0xYZVwvZ05rUGNBdk9ONkhHR3EwTjFkTmprbz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJlMWMzOTQwYi04NjM2LTQ0ZDYtOGUzNS0yY2IyN2Y2ZmFhNDUiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6InBob25lIG9wZW5pZCBlbWFpbCIsImF1dGhfdGltZSI6MTY4MzQzMzMwNiwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfbHFoOTJ4S0NSIiwiZXhwIjoxNjgzNDM2OTA2LCJpYXQiOjE2ODM0MzMzMDYsInZlcnNpb24iOjIsImp0aSI6Ijk4ZGNhNGYyLWQ4YmYtNDFiNS1iYjBlLTU2ZWE1ODMyYTA0ZiIsImNsaWVudF9pZCI6IjYyOWxrN2RtbHRmcGljMnYyYjcwZDFkamNwIiwidXNlcm5hbWUiOiJlMWMzOTQwYi04NjM2LTQ0ZDYtOGUzNS0yY2IyN2Y2ZmFhNDUifQ.L82E4PVqMNPmlfGZrmOPzzdkDzLAEjREGbAsZsMJosEFtYlkq7vax7OWadGsZ-HsszoDVM0stYyQPoT5S0nEg-AjVXgxjOWzazlASzay_5u-NsYc7YvMp7cLIAwnmjtmWnU-ha-27NGSrxoHcZ7TnRLa-PUgG3GnKEVpHWLDSs8ck_GjFtXGyDIzhoQPHpypEzq1W5ilffSTawR8NMIKgQpb8pQyZ-v0LJskpF2UwhjcnW_vPgoC2bXp1dk6T3j_XvAAYy5bJwRKdv1jEEcGi3E9hfPa-iedHFVBp6VMGLkGAyyXDzTH-n8IGt6D5iHzdcr7g8FgkFH9VOj5bSY4DA&expires_in=3600&token_type=Bearer"
var identify = url_string.split("#").pop();

var idToken = url_string.split("#").pop().split("&")[0].split("=")[1];
// console.log("idToken", idToken);

if (idToken != null) {
    auth();
    const decoded = jwt_decode(idToken);
    customerEmail = decoded["email"];
    console.log("customerEmail:", customerEmail);

    const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
    const params_cognito = {
        UserPoolId: '',
        Filter:'email="'+customerEmail + '"'
    };
    cognitoIdentityServiceProvider.listUsers(params_cognito, function(error, data){
        if (error){
            console.log(error);
        }else{
            // console.log(customerName);
            customerName = data['Users'][0]['Attributes'][2]['Value'];
            console.log(customerName);

            document.getElementById('greeting').innerHTML = "Hello "+customerName+"!";
            document.cookie=customerEmail + '&' + customerName;

            $(document).ready(function () {

                if(location.href.indexOf("#reloaded")==-1){
                   location.href=location.href+"#reloaded";
                   location.reload();
               }
            });
            console.log(customerEmail, customerName);
            insert(customerEmail, customerName);
        }   
    });

} else{
    customerEmail = document.cookie.split('&')[0];
    customerName = document.cookie.split('&')[1];
    document.getElementById('greeting').innerHTML = "Hello "+customerName+"!";
    console.log(customerEmail, customerName);
    insert(customerEmail, customerName);

}



function showUsersViewNum(){
    var getparams = {
        TableName: 'company-profiles',
        Key: {
            email: customerEmail,
        },
    }
    docClient.get(getparams, function (err, data) {
    if (err) console.log(err)
    else {
        console.log("view num", data['Item']['viewNum']);
        document.getElementById('view-num').innerHTML = data['Item']['viewNum'];
    }
    })
}

function showUploadNum(){
    var getparams = {
        TableName: 'company-profiles',
        Key: {
            email: customerEmail,
        },
    }
    docClient.get(getparams, function (err, data) {
    if (err) console.log(err)
    else {
        console.log("upload num", data['Item']['uploadNum']);
        document.getElementById('upload-num').innerHTML = data['Item']['uploadNum'];
    }
    })
}

// showUsersViewNum();
// showUploadNum();


let query_table = [];

function updateDataUpload(){

    var getparams = {
        TableName: 'company-profiles',
        Key: {
            email: customerEmail,
        },
    }
    var items = null;
    docClient.get(getparams, function (err, data) {
        if (err) console.log(err)
        else {
            items = data['Item']
            items['uploadNum'] = items['uploadNum'] + 1;
            console.log(items);
            const putparams = {
                TableName: 'company-profiles',
                Item: items,
            };
            docClient.put(putparams, (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log("data uploaded");
            });
            // showUploadNum();
        }
    })
}

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

            var s3 = new AWS.S3();
            var params = {
                Bucket: 'rawdata-hubpixel',
                Key: filename,
                Body: fileBody,
                ContentType: 'txt/csv',
                CacheControl: 'public, max-age=86400'
            }
            s3.putObject(params, function(err, data) {
                if (err) {
                    console.log("Error at uploadCSVFileOnS3Bucket function", err);
                } else {
                    console.log("File uploaded Successfully");
                    document.getElementById('upload-msg').innerHTML = "Succeessfully uploaded.";
                }
            });

        
        };

        // Read the file as text
        reader.readAsText(file);
        // updateDataUpload();

    }
}



var numViews = 0;

function updateUsersView(){
    var getparams = {
        TableName: 'company-profiles',
        Key: {
            email: customerEmail,
        },
    }
    var items = null; 
    docClient.get(getparams, function (err, data) {
        if (err) console.log(err)
        else {
            items = data['Item']
            items['viewNum'] = items['viewNum'] + numViews;
            console.log(items);
            const putparams = {
                TableName: 'company-profiles',
                Item: items,
            };
            docClient.put(putparams, (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log("data uploaded");
            });
            // showUsersViewNum();
        }
    })
    
        
}

function searchUser(){
    // var query = document.getElementById("search").value;

    var userList = document.getElementById('user-list');
    userList.innerHTML = "";

    const tableHeaders = ['Email',  'Phone'];
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    query_table.push(tableHeaders);

    tableHeaders.forEach((headerText) => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    userList.appendChild(headerRow);

    if (customerEmail == null){
        customerEmail = document.cookie.split('&')[0];
    }

    sdk.recommendGet(
        {'companyEmail':customerEmail},
        {},
        {}
    )
    .then((response) =>{
        console.log(response.data);

        if (response.data.output.length != 0){
            document.getElementById('wait-recommend').innerHTML = "";

            response.data.output.forEach(element => {
                if (element){
                    const userDiv = document.createElement('tbody');

                    const userEmail = document.createElement('td');
                    userEmail.textContent = `${element.email}`;

                    const userPhone = document.createElement('td');
                    userPhone.textContent = `${element.phoneNumber}`;

                    userDiv.appendChild(userEmail);
                    // userDiv.appendChild(userFirstName);
                    // userDiv.appendChild(userLastName);
                    userDiv.appendChild(userPhone);

                    query_table.push([userEmail.textContent, userPhone.textContent]);

                    userList.appendChild(userDiv);

                    numViews = numViews + 1;
                }
            });

            updateUsersView();
    
        }
        else{
            document.getElementById('search-msg').innerHTML = "No Matched Data";
        }

    })
    .catch((error) => {
        console.log("error", error);
    });

}

setInterval(searchUser(), 5000);

// export user list in csv
function exportUser(){
    var table = document.getElementById('user-list');
    var exportButton = document.getElementById('export-button');

    var blob = new Blob([tableToCSV(table)], {type: 'text/csv;charset=utf-8'});
    saveAs(blob, 'table-data.csv');

    function tableToCSV(table) {
        var csv = [];

        for (var i = 0; i < query_table.length; i++) {
            var row = query_table[i];
            csv.push(row.join(','));
        }
        return csv.join('\n');
    }
}



function getDashboard(){

    if (customerEmail == null){
        customerEmail = document.cookie.split('&')[0];
    }


    sdk.dashboardGet(
        {'companyEmail':customerEmail},
        {},
        {}
    )
    .then((response) =>{
        console.log(response.data['data']);
        age_info = response.data['data']["age_info"];
        topic_info = response.data['data']["topic_info"];
        state_info = response.data['data']["state_info"];

        initMap();
        histChart();
        barChart();

    })
    .catch((error) => {
        console.log("error", error);
    });

}

setInterval(getDashboard(), 5000);


function barChart(){
    // console.log(age_info);
    // <18, 18-23, 23-27, 27-30, 30 above
    var xValues = ['<18', '18-23', '23-27', '27-30', '>30', 'NaN'];
    var yValues = [age_info['<18'], age_info['18-23'], age_info['23-27'], age_info['27-30'], age_info['>30'], age_info['NaN']];

    const age_chart = document.getElementById('age_chart');
    var barColors = [
        "rgba(0,0,255,1.0)",
        "rgba(0,0,255,0.85)",
        "rgba(0,0,255,0.70)",
        "rgba(0,0,255,0.55)",
        "rgba(0,0,255,0.40)",
        "rgba(0,0,255,0.25)",
        "rgba(0,0,255,0.10)",
      ];
    new Chart(age_chart, {
        type: "pie",
        data: {
          labels: xValues,
          datasets: [{
            backgroundColor: barColors,
            data: yValues
          }]
        },
        options: {
          title: {
            display: true,
            text: "Product Count Based on Age"
          }
        }
      });
    
}

function initMap() {
    google.charts.load('current', {
        'packages':['geochart'],
        'mapsApiKey': 'AIzaSyAcxi8f3Aw3s56pCzZDOKYwqjfWxmsawNk'
      });
        google.charts.setOnLoadCallback(drawRegionsMap);
        console.log("state_info", state_info);

        var stateArray = [['Country', 'Return Rate']];

        for (const [key, value] of Object.entries(state_info)) {
            // console.log(key, value);
            stateArray.push([key, value]);
          }
          

        console.log("state array", stateArray);

        function drawRegionsMap() {
            // console.log(stateArray);
            var data = google.visualization.arrayToDataTable(stateArray);
            var options = {region: 'US', resolution:'provinces',  colorAxis: {colors: ["#FF5733"]}};
            var mapchart = new google.visualization.GeoChart(document.getElementById('regions_div'));
            mapchart.draw(data, options);
        }
}

function histChart(){

    const product_chat = document.getElementById('product_chart');

    var xValue = [];
    var yValue = [];

    console.log("topic_info", topic_info);

    for (const [key, value] of Object.entries(topic_info['num'])) {
        // console.log(key, value);
        yValue.push(value);
      }
    for (const [key, value] of Object.entries(topic_info['topic'])) {
    // console.log(key, value);
        xValue.push(value);
    }
      

    console.log()
    new Chart(product_chat, {
        type: 'bar',
        data: {
            labels: xValue,
            datasets: [{
                label: '# of Users',
                data: yValue,
                borderWidth: 1
            }]
            },
            options: {
                responsive:true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                barThickness: 50
            }
        });
}

