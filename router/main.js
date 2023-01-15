const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const Memo = require("../models/Memo");
const bcrypt = require("bcryptjs");
require('dotenv').config();
const mongoose = require("mongoose");
const { memoryUsage } = require("process");

router.use(bodyParser.urlencoded({ extended: true }))
router.use(express.json());

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

router.get('/',(req,res)=>{
    const filePath = path.join(__dirname, "../main.html");
    console.log(filePath);
    res.sendFile(filePath);
});

router.get('/all',async(req,res)=>{
    const userId = req.query.userId;
    await open();
    const MemoData = await Memo.find({userid:userId});
    await close();
    return res.status(200).json(MemoData);
});

router.get('/completion',async(req,res)=>{
    const userId = req.query.userId;
    await open();
    const MemoData = await Memo.find({userid:userId,completion:true});
    await close();
    return res.status(200).json(MemoData);
});

router.get('/incomplete',async(req,res)=>{
    const userId = req.query.userId;
    await open();
    const MemoData = await Memo.find({userid:userId,completion:false});
    await close();
    return res.status(200).json(MemoData);
});

router.post('/add',async(req,res)=>{
    const userId = req.body.userId;
    const title = req.body.title;
    const content = req.body.content;

    await open();
    const MemoData = await Memo.create({
        userid:userId,
        title:title,
        content:content,
        completion:false,
    });
    await close();
    return res.status(200).json(MemoData);
});

router.post('/edit',async(req,res)=>{
    const id = req.body.id;
    const title = req.body.title;
    const content = req.body.content;

    await open();
    await Memo.findByIdAndUpdate(id,{$set:{title:title,content:content}});
    await close();

    return res.send(200).json();
});

router.delete('/delete',async(req,res)=>{
    let id = req.query.id;
    console.log(id);
    await open();
    await Memo.findByIdAndRemove(id);
    await close();

    return res.status(200).json();
});

router.get('/idData',async(req,res)=>{
    let id = req.query.id;
    await open();
    const data = await Memo.findById(id);
    await close();
    return res.status(200).json(data);
});

router.post('/check',async(req,res)=>{
    const id = req.body.id;
    const check = req.body.check;

    await open();
    await Memo.findByIdAndUpdate(id,{$set:{completion:check}});
    await close();

    return res.send(200).json();
});


module.exports = router;