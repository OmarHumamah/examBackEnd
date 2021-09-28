"use strict";

const express = require("express");

const cors = require("cors");

const axios = require("axios");

require("dotenv").config();

const server = express();

server.use(cors());

server.use(express.json());

let PORT = process.env.PORT;

const mongoose = require('mongoose');

let fruitModal;

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://Omar_Humamah:123Omar321@omarcluster-shard-00-00.reqod.mongodb.net:27017,omarcluster-shard-00-01.reqod.mongodb.net:27017,omarcluster-shard-00-02.reqod.mongodb.net:27017/fruit?ssl=true&replicaSet=atlas-104q19-shard-0&authSource=admin&retryWrites=true&w=majority');

  
  const fruitSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: String,
    email: String
  });

  fruitModal = mongoose.model('fruit', fruitSchema);
}


server.get('/getfruit', getHandler);
server.post('/getFav', getFavHandler);
server.get('/ruderfav', renderFav);
server.delete('/deletefruit/:id', deleteFruit);
server.put('/updatefruit/:id',updateFruit)

function getHandler (req, res){
    axios
    .get('https://fruit-api-301.herokuapp.com/getFruit')
    .then(result=>{
        res.send(result.data.fruits)
    })
    .catch(err=>console.log(err))
}

async function getFavHandler(req, res){
  let email = req.query.email;
  let {name, image, price} = req.body;
  await fruitModal.create({
    name: name,
    image: image,
    price: price,
    email: email
  });

  fruitModal.find({email}, (err, result)=>{
    if(err){
      console.log(err);
    }else{
      res.send(result)
    }
  })  
}

function renderFav (req, res){
  let email = req.query.email;

  fruitModal.find({email}, (err, result)=>{
    if(err){
      console.log(err);
    }else{
      res.send(result)
    }
  })  
}

function deleteFruit (req, res){
 let id = req.params.id;
 let email = req.query.email;
 console.log(id);
 fruitModal.deleteOne({_id:id}, (err, result)=>{
  fruitModal.find({email}, (err, result)=>{
    if(err){
      console.log(err);
    }else{
      res.send(result)
    }
  })  

 })

}

function updateFruit (req, res){
  let id = req.params.id;
 let email = req.query.email;
 let {name, image, price} = req.body;
 console.log(name, price, id);
 fruitModal.findByIdAndUpdate({_id:id}, {name : name, image: image, price:price }, (err, result)=>{
  fruitModal.find({email}, (err, result)=>{
    if(err){
      console.log(err);
    }else{
      res.send(result)
    }
  })  

 })

}

server.listen(PORT,()=> {console.log(`the app is running on ${PORT}`);})