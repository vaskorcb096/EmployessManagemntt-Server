const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const cors=require('cors');
const mysql = require("mysql");
const app = express();
require('dotenv').config();
const nodemailer = require("nodemailer");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Password@123",
  database: "employeedatabase",
});
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

connection.connect(function (error) {
  if (!!error) console.log(error);
  else console.log("Database Connected!");
});

app.post("/SendServerEmployeeInfo", (req, res) => {
    
    console.log("push",req);
  const FirstName = req.body.firstName;
  const LastName = req.body.lastName;
  const Email = req.body.email;

  const sqlInsert =
    "INSERT INTO employee_details (employee_FirstName,employee_LastName,employee_email) VALUES  (?,?,?);";
  connection.query(sqlInsert, [FirstName, LastName, Email], (err, result) => {
    if (err) {
      console.log("Hello error");
    } else {
      res.send("This is My firstProject With Mysql+ node js ");
    }
  });
});

app.get('/getServertoClient',(req,res)=>{
    const sqlGet="SELECT * FROM employee_details"
    connection.query(sqlGet,(err,result)=>{
        if(err){
       console.log("Hello error");
        }
        else {
            console.log(result);
            res.send(result);
        }
    })
  
     
})
app.post('/sendEmail',(req,res)=>{
  console.log("data asche",req.body);


  const output = `
  <p>You have a new Message request</p>
 
  <h1>${req.body.subject}</h1>
  <h3>${req.body.message}</h3>
  <p>Thank You</p>
`;


  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
     port: 465,
     secure: false,
    service: 'gmail',
    auth: {
      user:`${process.env.EMAIL}`,
      pass: `${process.env.PASS}` // naturally, replace both with your real credentials or an application-specific password
    }
  });
  
  const mailOptions = {
    
    from: 'shurjocb11@gmail.com',
    to: `${req.body.userEmail}`,
    subject:`${req.body.subject}`,
    text: ' TechNExt.',
    html: output
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
    console.log("error asche",error);
    } else {
      console.log('Email sent: ' + info.response);
      res.send("Message Inserted Successfully");
    }
  });


})

app.listen(5000, () => {
  console.log("Runnning On port 5000");
});
