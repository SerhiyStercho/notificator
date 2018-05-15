const express = require('express');
const schedule = require('node-schedule');
const bodyParser = require('body-parser')
const FCM = require('fcm-node')
const app = express();
const router = express.Router();

const port = 8000;

const serverKey = require('./serverkey.json');
let fcm = new FCM(serverKey);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/utask',function(req,res){

    console.log(req.body);
    
    let requestBody = req.body;
    let date = new Date(requestBody.year, requestBody.month, requestBody.day, requestBody.hour, requestBody.minute, 0);

   
 
    res.sendStatus(200);


    var j = schedule.scheduleJob(date, function(){
        console.log(`Пора ${requestBody.taskName}`);

        fcm.send(createMessage(requestBody.token, requestBody.taskName, requestBody.taskBody), function(err, response){
            if (err) {
                console.log("Something has gone wrong!");
                console.log(err);
            } else {
                console.log("Successfully sent with response: ", response);
            }
        });
    });
});

let createMessage = function(token, t, b){
    var message = { 
        to: token, 
        
        notification: {
            title: t,
            priority: 'high', 
            body: b,
            sound: 'default'
        }
    };

    return message;
}

app.listen(port);

//app.listen(port, 'https://notificator-v1.herokuapp.com/', function(){});
