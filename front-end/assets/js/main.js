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

            insert(customerEmail, customerName);
            }   
    });

} else{

    customerName = document.cookie.split('&')[1];
    document.getElementById('greeting').innerHTML = "Hello "+customerName+"!";

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
            response.data.output.forEach(element => {
                if (element){
                    const userDiv = document.createElement('tbody');

                    const userEmail = document.createElement('td');
                    userEmail.textContent = `${element.email}`;

                    // const userFirstName = document.createElement('td');
                    // userFirstName.textContent = `${element.firstName}`;

                    // const userLastName = document.createElement('td');
                    // userLastName.textContent = `${element.lastName}`;

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

getDashboard();


function barChart(){
    // console.log(age_info);
    var xValues = ['<15', '15-30', '30-45', '45-60', '60-75', '>75', 'NaN'];
    var yValues = [age_info['<15'], age_info['15-30'], age_info['30-45'], age_info['45-60'], age_info['60-75'], age_info['>75'], age_info['NaN']];

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

