const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAllItem = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('item').find();
    const items = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while retrieving items.');
  }
};

const getSingleItem = async (req, res) => {
  try {
    const itemId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('item').find({ _id: itemId });
    const items = await result.toArray();
    if (items.length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(items[0]);
    } else {
      res.status(404).json('Item not found.');
    }
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while retrieving the item.');
  }
};

const createItem = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price,
      menu_id
    } = req.body;

    const item = {
      name,
      description,
      price,
      menu_id
    };

    const response = await mongodb.getDb().db().collection('item').insertOne(item);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json('Some error occurred while creating the item.');
    }
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while creating the item.');
  }
};

const updateItem = async (req, res) => {
  try {
    const itemId = new ObjectId(req.params.id);

    // Validate the required fields
    const requiredFields = ['name', 'description', 'price', 'menu_id'];
    const missingFields = requiredFields.filter(field => !(field in req.body));
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    const { 
      name, 
      description, 
      price,
      menu_id
    } = req.body;

    const item = {
      name,
      description,
      price,
      menu_id
    };

    const response = await mongodb.getDb().db().collection('item').replaceOne({ _id: itemId }, item);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json('Some error occurred while updating the item.');
    }
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while updating the item.');
  }
};

const deleteItem = async (req, res) => {
  try {
    const itemId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection('item').deleteOne({ _id: itemId }, true);
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json('Some error occurred while deleting the item.');
    }
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while deleting the item.');
  }
};

module.exports = {
  getAllItem,
  getSingleItem,
  createItem,
  updateItem,
  deleteItem
};
