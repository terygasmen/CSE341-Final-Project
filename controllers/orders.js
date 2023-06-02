const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAllOrder = async (req, res) => {
  //#swagger.tags=['Order']
  try {
    const result = await mongodb.getDb().db().collection('order').find();
    const orders = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while retrieving orders.');
  }
};

const getSingleOrder = async (req, res) => {
  //#swagger.tags=['Order']
  try {
    const orderId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('order').find({ _id: orderId });
    const orders = await result.toArray();
    if (orders.length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(orders[0]);
    } else {
      res.status(404).json('Order not found.');
    }
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while retrieving the order.');
  }
};

const createOrder = async (req, res) => {
  //#swagger.tags=['Order']
  try {
    const {
      menu_id,
      restaurant_id,
      customer_name,
      customer_email,
      total_amount,
      date_and_time_of_order,
      status
    } = req.body;

    const order = {
      menu_id,
      restaurant_id,
      customer_name,
      customer_email,
      total_amount,
      date_and_time_of_order,
      status
    };

    const response = await mongodb.getDb().db().collection('order').insertOne(order);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json('Some error occurred while creating the order.');
    }
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while creating the order.');
  }
};

const updateOrder = async (req, res) => {
  //#swagger.tags=['Order']
  try {
    const orderId = new ObjectId(req.params.id);

    // Validate the required fields
    const requiredFields = [
      'restaurant_id',
      'customer_name',
      'customer_email',
      'total_amount',
      'date_and_time_of_order',
      'status'
    ];
    const missingFields = requiredFields.filter((field) => !(field in req.body));
    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    const {
      menu_id,
      restaurant_id,
      customer_name,
      customer_email,
      total_amount,
      date_and_time_of_order,
      status
    } = req.body;

    const order = {
      menu_id,
      restaurant_id,
      customer_name,
      customer_email,
      total_amount,
      date_and_time_of_order,
      status
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection('order')
      .replaceOne({ _id: orderId }, order);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json('Some error occurred while updating the order.');
    }
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while updating the order.');
  }
};

const deleteOrder = async (req, res) => {
  //#swagger.tags=['Order']
  try {
    const orderId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db()
      .collection('order')
      .deleteOne({ _id: orderId }, true);
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json('Some error occurred while deleting the order.');
    }
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while deleting the order.');
  }
};

module.exports = {
  getAllOrder,
  getSingleOrder,
  createOrder,
  updateOrder,
  deleteOrder
};
