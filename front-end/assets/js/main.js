// cognito
var idToken = null;
var customerEmail = null;

function auth() {
    AWS.config.update({region: "us-east-1"});
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId : 'us-east-1:066c45f8-3e30-47ac-9734-f03ea3568881',
            Logins : {"cognito-idp.us-east-1.amazonaws.com/us-east-1_MN4G95WEx": idToken}
          });
}

// store information to dynamodb
AWS.config.update({
    region: 'us-east-1',
    apiVersion: 'latest',
    credentials: {
      accessKeyId: 'AKIARVY2KF7ANTG5H7TY',
      secretAccessKey: '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'
    }
  })

const docClient = new AWS.DynamoDB.DocumentClient();
function insert(customerEmail){
    const params = {
        TableName: 'customers',
        Item: {
          email:customerEmail,
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

// var url_string = window.location.href;
var url_string = "https://hubpixel-front-end.s3.amazonaws.com/dashboard.html#id_token=eyJraWQiOiJWUHRQQ0NJQUhFWE1CRlNuSkFYQXZIR0pHSzNZaDIranpIb3Zvb0V1NURvPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiY2lCcGtidU4zQVJsQUF6M1RfYmtEZyIsInN1YiI6IjgzNjE4MTk3LTUzZjAtNDMwMS05YzkwLWMzOTZhMmQ2N2JlYyIsImNvZ25pdG86Z3JvdXBzIjpbImh1Yi1waXhlbCJdLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfTU40Rzk1V0V4IiwiY29nbml0bzp1c2VybmFtZSI6InVzZXIiLCJjb2duaXRvOnJvbGVzIjpbImFybjphd3M6aWFtOjoxMTU0ODI0Mzk2MTY6cm9sZVwvZHluYW1vZGItY29nbml0by1yb2xlIl0sImF1ZCI6IjZiaGY3anAyaWRpYmQ3ZTIyYmVuaHFwMG1hIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2ODE3ODc0NTIsImV4cCI6MTY4MTc5MTA1MiwiaWF0IjoxNjgxNzg3NDUyLCJqdGkiOiI0NTY5NWY3NS02MjVkLTQ4ZTktYTM2Ni1kMzU3ZDUwMzY2OGEiLCJlbWFpbCI6InN0MzUxMEBjb2x1bWJpYS5lZHUifQ.EeXiX4af2gKFTZl9vy6x9-kFJBJkec-D2MafioHgVKfspYozOTUzY_xV1z4MDaR-AN98-Oebf2fV7haSf5ebq-5p7yfo73YJwQdRcghmB5Q7o5ao3-9GJ7mLTP4xWwzHXey-aQ04TT7ZNI2Cbdc29sjHGEVqf-7yvSR45OUzc2cLyEd0-VBp-1oO8H2BhGM8CrPYpg7TzU_Q81XWDaHnYI1GZR8CQdLRqxIfFA9-LvEp6ZPCtP51nWWFALPgpI0YKH9q9DQ8mibPM_hBm41c-aWpGQgXUSDeUiCacPaOjCHs2fEHdm1dnTOtUbXrXvwSgX85xVJDX_tHQffaLLBuAw&access_token=eyJraWQiOiJWeHZiR0swZUZDVXZYUDlcL1wvcHBOWEFLdHY3MFdzcFZ4NVRqZFwvc2p0aWFnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4MzYxODE5Ny01M2YwLTQzMDEtOWM5MC1jMzk2YTJkNjdiZWMiLCJjb2duaXRvOmdyb3VwcyI6WyJodWItcGl4ZWwiXSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfTU40Rzk1V0V4IiwidmVyc2lvbiI6MiwiY2xpZW50X2lkIjoiNmJoZjdqcDJpZGliZDdlMjJiZW5ocXAwbWEiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6InBob25lIG9wZW5pZCBlbWFpbCIsImF1dGhfdGltZSI6MTY4MTc4NzQ1MiwiZXhwIjoxNjgxNzkxMDUyLCJpYXQiOjE2ODE3ODc0NTIsImp0aSI6IjVmMjQ1ZTg2LTgyYzctNGFkYS1iZDlkLTA3ZmIyZGY0N2RkNiIsInVzZXJuYW1lIjoidXNlciJ9.ithJ4c2Xk03cQBPQtQDPHBGTOWp1bmRvDiETW4GOuEYZVFtJY2Y0_Vcvf60aVAYq_IX5lMHX3zDde2FnBYlL2D47E3e02nYYqPMaAppN6vKhEiNa1B8puIcDVNki8EC4065NJ9Y1wRH3qNuJ65ch7FvCxdgVQRV3Dqcszgi0HbauvE6sx3e7DB8s4__PIfF-x0utUUVrD2Syk5C4vF57NDKM_0altM3VjlKLUnKvgOzwdzy_tEd1gY-e8lUAwR2Tl7QOeVZckODLdGYLpZvcFI69dGjy0VWvgYLveDSzK5EfRolU7jiaNp6mEbkm2Wa46FmPRpJ7yz6Bw9azxcqPhQ&expires_in=3600&token_type=Bearer";
var idToken = url_string.split("#").pop().split("&")[0].split("=")[1];
if (idToken != null) {
    auth();
    const decoded = jwt_decode(idToken);
    customerEmail = decoded["email"]
    console.log(customerEmail);
    var params = {
        TableName: 'customers',
        Key: {
            email: customerEmail,
        },
      }
      
    docClient.get(params, function (err, data) {
    if (err) console.log(err)
    else {
        console.log(data['Item']);   
    }
    })
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
            email: customerEmail,
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

        sdk.searchGet(
            {'q': query},
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


const ctx = document.getElementById('myChart');
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

