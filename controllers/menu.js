const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAllMenu = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('menu').find();
    const lists = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while retrieving menus.');
  }
};

const getSingleMenu = async (req, res) => {
  try {
    const menuId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('menu').find({ _id: menuId });
    const menu = await result.toArray();
    if (menu.length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(menu[0]);
    } else {
      res.status(404).json('Menu not found.');
    }
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while retrieving the menu.');
  }
};

const createMenu = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      restaurant_id 
    } = req.body;

    const menu = {
      name,
      description,
      restaurant_id,
    };

    const response = await mongodb.getDb().db().collection('menu').insertOne(menu);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json('Some error occurred while creating the menu.');
    }
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while creating the menu.');
  }
};

const updateMenu = async (req, res) => {
  try {
    const menuId = new ObjectId(req.params.id);

    // Validate the required fields
    const requiredFields = ['name', 'description', 'restaurant_id'];
    const missingFields = requiredFields.filter(field => !(field in req.body));
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    const { 
      name, 
      description, 
      restaurant_id 
    } = req.body;

    const menu = {
      name,
      description,
      restaurant_id,
    };

    const response = await mongodb.getDb().db().collection('menu').replaceOne({ _id: menuId }, menu);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json('Some error occurred while updating the menu.');
    }
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while updating the menu.');
  }
};

const deleteMenu = async (req, res) => {
  //#swagger.tags=['Menu']
  try {
    const menuId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection('menu').deleteOne({ _id: menuId }, true);
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json('Some error occurred while deleting the menu.');
    }
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while deleting the menu.');
  }
};

module.exports = {
  getAllMenu,
  getSingleMenu,
  deleteMenu,
  createMenu,
  updateMenu,
};
