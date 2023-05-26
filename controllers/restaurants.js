const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('restaurant').find();
    const lists = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while retrieving restaurants.');
  }
};

const getSingle = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('restaurant').find({ _id: userId });
    const lists = await result.toArray();
    if (lists.length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists[0]);
    } else {
      res.status(404).json('Restaurant not found.');
    }
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while retrieving the restaurant.');
  }
};

const createRestaurant = async (req, res) => {
  try {
    const {
      name,
      description,
      phone_number,
      opening_hours,
      average_rating,
      menu_id
    } = req.body;

    const restaurant = {
      name,
      description,
      phone_number,
      opening_hours,
      average_rating,
      menu_id
    };

    const response = await mongodb.getDb().db().collection('restaurant').insertOne(restaurant);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json('Some error occurred while creating the restaurant.');
    }
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while creating the restaurant.');
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);

    // Validate the required fields
    const requiredFields = ['name', 'description', 'phone_number', 'opening_hours', 'average_rating', 'menu_id'];
    const missingFields = requiredFields.filter(field => !(field in req.body));
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    const {
      name,
      description,
      phone_number,
      opening_hours,
      average_rating,
      menu_id
    } = req.body;

    const restaurant = {
      name,
      description,
      phone_number,
      opening_hours,
      average_rating,
      menu_id
    };

    const response = await mongodb.getDb().db().collection('restaurant').replaceOne({ _id: userId }, restaurant);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json('Some error occurred while updating the restaurant.');
    }
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while updating the restaurant.');
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db()
      .collection('restaurant')
      .deleteOne({ _id: userId }, true);
    console.log(response);
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json('Some error occurred while deleting the restaurant.');
    }
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while deleting the restaurant.');
  }
};

module.exports = {
  getAll,
  getSingle,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
};
