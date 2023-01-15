const express = require("express");
const app = express();
const PORT = 4000;
const Users = require("./models/Users");
const bcrypt = require("bcryptjs");
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());

async function open (){
    await mongoose.connect(
        process.env.HEROKUDB||process.env.DBURL
        ).then(()=>console.log("db connect"))
         .catch((err)=>console.log(err));
};

async function close(){
   await mongoose.connection.close()
        .then(()=>console.log("db close"))
        .catch((err)=>console.log(err));
};

app.use(express.static("public"));
app.listen(PORT,function(){
    console.log("server起動");
});

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html');
});

app.post('/register',async(req,res)=>{
    const Id = req.body.Id;
    const Password = req.body.Password;
    console.log(Id);
    if(!IdCheck(Id)||!PasswordCheck(Password)){
        console.log("barierror");
        return res.status(400).json([
            {
                message:"入力された値が正しくありません。",
            },
        ]);
    };
     
    await open();
    const UserData = await Users.find({id:Id});
    await close();

    if(UserData.length){
        console.log("データが重複しています。");
        return res.status(400).json([
            {
                message:"すでにそのIDは使われています。",
            },
        ]);
    };

    //パスワードの暗号化
    let hashedPassword = await bcrypt.hash(Password,10);
    console.log(hashedPassword);

    await open();
    const createUsers = await Users.create({
       id:Id,
       password:hashedPassword,
    });
    await close();
    console.log("ja");
    return res.status(200).json(createUsers);

});

app.get('/rogin',async(req,res)=>{
    const Id = req.query.Id;
    const Password = req.query.Password;

    await open();
    const UserData = await Users.find({id:Id});
    await close();

    if(!UserData.length){
        console.log("データが重複しています。");
        return res.status(400).json([
            {
                message:"そのIDは存在しません。",
            },
        ]);
    };

    const dataPassword =  UserData[0].password;

    console.log(Password);
    console.log(dataPassword);

    const isPassword =  await bcrypt.compare(Password,dataPassword);
    
    if(isPassword){
        return res.status(200).json({
            Id:Id,
        });
    }else{
        return res.status(400).json([
            {
                message:"パスワードが間違っています。",
            },
        ]);
    };
});



//半角チェック
function IsSingleByte(str){
    if (str.match(/^[A-Za-z0-9]*$/)) return true;
    return false;
};

function IdCheck(id){
    if(id.length < 4 || id.length > 10)return false;
    if(!IsSingleByte(id))return false;
    return true;
};

function PasswordCheck(password){
    if(password.length < 4 || password.length > 10)return false;
    if(!IsSingleByte(password))return false;
    return true;
};

const main = require("./router/main");
app.use('/main',main);