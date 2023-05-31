const { ObjectId } = require('mongodb');
const mongodb = require('../db/connect');


const getAllUser = async (req, res) => {
    //#swagger.tags=['Users']
    try{
    const result = await mongodb.getDb().db('restaurant').collection('users').find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
  } catch (err) {
    res.status(500).json(err);
  }
};

const getOneUser = async (req, res) => {
    //#swagger.tags=['Users']
    try {
    const userId = new ObjectId(req.params.id);
  const result = await mongodb.getDb().db('restaurant').collection('users').find({ _id: userId });
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
  })
  } catch (err){
    res.status(500).json(err);
  }
};

const createUser = async (req, res) => {
    //#swagger.tags=['Users']
    try{ 
    const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  };
const response = await mongodb.getDb().db('restaurant').collection('users').insertOne(contact);
if (response.acknowledged) {
  res.status(201).json(response);
} else {
  res.status(500).json(response.error || 'Error occured shile creating contact.');
}  
} catch(err) {
  res.status(500).json(err);
}
};

const updateUser = async (req, res) => {
    //#swagger.tags=['Users']
    try { 
  const userId = new ObjectId(req.params.id);
  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  };
const response = await mongodb.getDb().db('restaurant').collection('users').replaceOne({_id: userId }, contact);
console.log(response);
if (response.acknowledged) {
  res.status(204).send();
} else {
  res.status(500).json(response.error || 'Error occured shile updating contact.');
}  
} catch(err) {
  res.status(500).json(err);
}
};

const deleteUser = async (req, res) => {
    //#swagger.tags=['Users']
    try{
    const userId = new ObjectId(req.params.id);
  const response = await mongodb.getDb().db('restaurant').collection('users').deleteOne({_id: userId }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(200).send();
  } else {
    res.status(500).json(response.error || 'Error occured while deleting contact.');
  }  
} catch(err) {
  res.status(500).json(err);
}
};

module.exports = { getAllUser, getOneUser, createUser, updateUser, deleteUser };