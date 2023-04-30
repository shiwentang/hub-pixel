// cognito
var idToken = null;
var customerEmail = null;
var customerName = null;
var age_info = null;
var return_info = null;
var state_info = null;

function auth() {
    // AWS.config.update({
    //     region: "us-east-1"});
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId : 'us-east-1:ec84a75c-6658-45f3-89ec-31dc092c771b',
            Logins : {"cognito-idp:us-east-1:115482439616:userpool/us-east-1_TX9kAr7Ie": idToken}
          });
    AWS.config.update({
        region: 'us-east-1',
        apiVersion: 'latest',
        credentials: {
            accessKeyId: 'AKIARVY2KF7AAHZR6PFV',
            secretAccessKey: '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'
        }
    })
}

// store information to dynamodb
AWS.config.update({
    region: 'us-east-1',
    apiVersion: 'latest',
    credentials: {
      accessKeyId: 'AKIARVY2KF7AAHZR6PFV',
      secretAccessKey: '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'
    }
  })

const docClient = new AWS.DynamoDB.DocumentClient();
function insert(customerEmail, customerName){
    const params = {
        TableName: 'customers',
        Item: {
          email:customerEmail,
          name: customerName,
          viewNum: 0,
          uploadNum:0
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


// need to change when deploy
// var url_string = window.location.href;
// url for testing
var url_string = "https://hubpixel-front-end.s3.amazonaws.com/dashboard.html#id_token=eyJraWQiOiJaekJ5eWpJYmN4ek0xbE5cL1RIR212QWROWXY2TCtXVTg0Y1BOMUxIQ2JFdz0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiUHdPZ0dqclh1T0cwQUhnZHp0MklNdyIsInN1YiI6IjQ0MWMzN2Y3LWZmMjQtNGU3My1hZjcxLWRmYjY1YzgyMzA5ZiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9UWDlrQXI3SWUiLCJjb2duaXRvOnVzZXJuYW1lIjoiNDQxYzM3ZjctZmYyNC00ZTczLWFmNzEtZGZiNjVjODIzMDlmIiwiYXVkIjoiMjViMWJmMHNyNDJiNGxucGlrcDAyczI3cmwiLCJldmVudF9pZCI6IjUwYzNkOWRiLThkYzktNDY5OC1hZDg1LTBiMThmOTdiYTY1NiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjgyNTc0ODcxLCJleHAiOjE2ODI1Nzg0NzEsImlhdCI6MTY4MjU3NDg3MSwianRpIjoiNjA0YmJlNTMtOGJiZC00ZjhlLWI0ZGQtMzA1YmE1NzEzY2YxIiwiZW1haWwiOiJzdDM1MTBAY29sdW1iaWEuZWR1In0.fT7irFMHgFQ9csDQpkvJKOCaH8ZMuJeQARhy--bR7_Vyqp4fmdbqHi6RjTQtCdd4iPO_QshtYu6FL7PaE0dTu7oh3-AY4Y-VN7X2eM7wEf_FLAINLAfFpqFQsUhdjTNO5OSQlT5p-eWENVhsdkb1ATN1Nge-mpg6N_I2NHawetDxT5MMcCOdBidNp210JSdZNyA2VR0VJRYbZOJjlj9eRk5eKVbA-AYIQ66wW1l8QCBf31kmTwtW6MuxZw7lzed2codUB5sIAcpWsmLR1UYvu2gIL7TRyuIsaoRGvfZi8TNZYZFn6rSSrzFtUe_H4aY_KBUcVyYrDh0Wl2oz7gZ0kw&access_token=eyJraWQiOiJsd0RYVFdcL012ano5NEVidFVnMEZIckRJVFd2YXNoQ1l6MFNmYVFxbWoyOD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI0NDFjMzdmNy1mZjI0LTRlNzMtYWY3MS1kZmI2NWM4MjMwOWYiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9UWDlrQXI3SWUiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiIyNWIxYmYwc3I0MmI0bG5waWtwMDJzMjdybCIsImV2ZW50X2lkIjoiNTBjM2Q5ZGItOGRjOS00Njk4LWFkODUtMGIxOGY5N2JhNjU2IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJwaG9uZSBvcGVuaWQgZW1haWwiLCJhdXRoX3RpbWUiOjE2ODI1NzQ4NzEsImV4cCI6MTY4MjU3ODQ3MSwiaWF0IjoxNjgyNTc0ODcxLCJqdGkiOiJiODdjMTM0YS0yYTc5LTQyNjYtODE2Yy04MjE2MGYxZjM4M2EiLCJ1c2VybmFtZSI6IjQ0MWMzN2Y3LWZmMjQtNGU3My1hZjcxLWRmYjY1YzgyMzA5ZiJ9.v0IAKYv2RP7V9Py6NAWyXUjYLE0-xPa_U3nhuSEjjIyaoy85KeEkUVelCMVuOM7kSS-B3uwhUKMCvLtmsEKa7e4UcWZwbLm9ltCDS65e0EqvH-4lwxHY9lLXElOl2rgO-Cids9xcnGwnpmpNQOJhv1rFcqXOfoajTNm36X8DvMlX7y_hOOw8R2lSCBNKxazB0ptcR_0pz3MB-PZEDIucaaU2DXuKOPK9Fzq_whAFr-BCC0Zkhtc5-n1Skcd3ItWlFp54iIRIsU4UO8Q7gte5MGyzzof-dA9dJRuyhQsMA3kFqEUal7p3nFP6xDN4wLF4zZpi7T6vo34lZx3GuHp2xg&expires_in=3600&token_type=Bearer"
var idToken = url_string.split("#").pop().split("&")[0].split("=")[1];
if (idToken != null) {
    auth();
    const decoded = jwt_decode(idToken);
    customerEmail = decoded["email"];
    console.log(customerEmail);

    const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
    const params_cognito = {
        UserPoolId: 'us-east-1_TX9kAr7Ie',
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

            insert(customerEmail, customerName);
            }   
    });

}


function showUsersViewNum(){
    var getparams = {
        TableName: 'customers',
        Key: {
            email: customerEmail,
        },
    }
    docClient.get(getparams, function (err, data) {
    if (err) console.log(err)
    else {
        document.getElementById('view-num').innerHTML = data['Item']['viewNum'];
    }
    })
}

function showUploadNum(){
    var getparams = {
        TableName: 'customers',
        Key: {
            email: customerEmail
        },
    }
    docClient.get(getparams, function (err, data) {
    if (err) console.log(err)
    else {
        document.getElementById('upload-num').innerHTML = data['Item']['uploadNum'];
    }
    })
}

showUsersViewNum();
showUploadNum();

let query_table = [];

function updateDataUpload(){
    var getparams = {
        TableName: 'customers',
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
                TableName: 'customers',
                Item: items,
            };
            docClient.put(putparams, (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log("data uploaded");
            });
            showUploadNum();
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
        updateDataUpload();

    }
}

var numViews = 0;

function updateUsersView(){
    var getparams = {
        TableName: 'customers',
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
                TableName: 'customers',
                Item: items,
            };
            docClient.put(putparams, (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log("data uploaded");
            });
            showUsersViewNum();
        }
    })
    
        
}

function searchUser(){
    var query = document.getElementById("search").value;

    var userList = document.getElementById('user-list');
    userList.innerHTML = "";

    const tableHeaders = ['Email', 'First Name', 'Last Name', 'Phone'];
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    query_table.push(tableHeaders);

    tableHeaders.forEach((headerText) => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    userList.appendChild(headerRow);


    if (query.length==0){
        document.getElementById('search-msg').innerHTML = "Please Enter A Keyword";
    }
    else{
        document.getElementById('search-msg').innerHTML = "";
        sdk.searchGet(
            {'q': query, 'companyEmail':customerEmail},
            {},
            {}
        )
        .then((response) =>{
            console.log("received "+query);
            console.log(response.data);

            if (response.data.output.length != 0){
                response.data.output.forEach(element => {
                    if (element){
                        const userDiv = document.createElement('tbody');

                        const userEmail = document.createElement('td');
                        userEmail.textContent = `${element.email}`;
    
                        const userFirstName = document.createElement('td');
                        userFirstName.textContent = `${element.firstName}`;
    
                        const userLastName = document.createElement('td');
                        userLastName.textContent = `${element.lastName}`;
    
                        const userPhone = document.createElement('td');
                        userPhone.textContent = `${element.phoneNumber}`;
    
                        userDiv.appendChild(userEmail);
                        userDiv.appendChild(userFirstName);
                        userDiv.appendChild(userLastName);
                        userDiv.appendChild(userPhone);
    
                        query_table.push([userEmail.textContent, userFirstName.textContent, userLastName.textContent, userPhone.textContent]);
    
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
    sdk.dashboardGet(
        {'companyEmail':customerEmail},
        {},
        {}
    )
    .then((response) =>{
        // console.log(response.data);
        age_info = response.data["age_info"];
        return_info = response.data["return_info"];
        state_info = response.data["state_info"];

        initMap();
        barChart();

    })
    .catch((error) => {
        console.log("error", error);
    });

}

setInterval(getDashboard, 5000);

function barChart(){
    // console.log(age_info);
    var xValues = ['<15', '15-30', '30-45', '45-60', '60-75', '>75', 'NaN'];
    var yValues = [age_info['<15'], age_info['15-30'], age_info['30-45'], age_info['45-60'], age_info['60-75'], age_info['>75'], age_info['NaN']];

    const age_chart = document.getElementById('age_chart');
    var barColors = [
        "rgba(0,0,255,1.0)",
        "rgba(0,0,255,0.8)",
        "rgba(0,0,255,0.6)",
        "rgba(0,0,255,0.4)",
        "rgba(0,0,255,0.2)",
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
        // console.log(state_info);

        var stateArray = [['Country', 'Return Rate']];

        for(var i=0; i<state_info.length; i++){
            element = state_info[i];
            stateArray.push(element);
        }

        function drawRegionsMap() {
            // console.log(stateArray);
            var data = google.visualization.arrayToDataTable(stateArray);
            var options = {region: 'US', resolution:'provinces',  colorAxis: {colors: ["#FF5733"]}};
            var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));
            chart.draw(data, options);
        }
}

function histChart(){
    console.log()
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
            datasets: [{
                label: '# of Users',
                data: [12, 15, 3, 7, 5, 37, 23],
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



// var s = document.getElementById('select');
// s.innerHTML = "";
// var optionArray = ["Subcat3", "Subcat3.1", "Subcat3.3"];
// var arrLen = optionArray.length;

// function checklist() {
//     for (var i = 0; i < arrLen; i++) {
//         var pair = optionArray[i];
//         var label = document.createElement('label')
//         var checkbox = document.createElement("input");
//         checkbox.type = "checkbox";
//         checkbox.id = "checkbox_"+i;
//         checkbox.name = pair;
//         label.appendChild(checkbox);
//         label.appendChild(document.createTextNode(pair));
//         s.appendChild(label);
//         s.appendChild(document.createElement("br"));

//     }
// }


// function submitcheck(){
//     var checkedArr = []; 
    
//     for(var i=0; i < arrLen; ++i){
//         var boxId = "checkbox_"+i;
//         var element = document.getElementById(boxId);
//         if (element.checked == true){
//             checkedArr.push(element.name);
//         }

//     }

//     console.log(checkedArr);

// }

// setInterval(checklist(), 50);