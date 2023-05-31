const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAllUser = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('user').find();
    const users = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while retrieving users.');
  }
};

const getSingleUser = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('user').find({ _id: userId });
    const user = await result.toArray();
    if (user.length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(user[0]);
    } else {
      res.status(404).json('User not found.');
    }
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while retrieving the user.');
  }
};

const createUser = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      birthday 
    } = req.body;

    const user = {
      firstName,
      lastName,
      email,
      birthday,
    };

    const response = await mongodb.getDb().db().collection('user').insertOne(user);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json('Some error occurred while creating the user.');
    }
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while creating the user.');
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);

    // Validate the required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'birthday'];
    const missingFields = requiredFields.filter(field => !(field in req.body));
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    const { 
      firstName, 
      lastName, 
      email, 
      birthday 
    } = req.body;

    const user = {
      firstName,
      lastName,
      email,
      birthday,
    };

    const response = await mongodb.getDb().db().collection('user').replaceOne({ _id: userId }, user);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json('Some error occurred while updating the user.');
    }
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while updating the user.');
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection('user').deleteOne({ _id: userId }, true);
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json('Some error occurred while deleting the user.');
    }
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while deleting the user.');
  }
};

module.exports = {
  getAllUser,
  getSingleUser,
  deleteUser,
  createUser,
  updateUser,
};
