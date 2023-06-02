const mongodb = require('../db/connect');

const getAll = async (req, res) => {
  //#swagger.tags=['Users']
  try {
    const result = await mongodb.getDb().db('users').collection('users').find();
    let lists = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json(err);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while retrieving users.');
  }
};

const getOne = async (req, res) => {
  //#swagger.tags=['Users']
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db('users').collection('users').find({ _id: userId });
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists[0]);
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

const createUser = async (req, res) => {
  //#swagger.tags=['Users']
  try {
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };
    const response = await mongodb.getDb().db('users').collection('users').insertOne(contact);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json(response.error || 'Error occured shile creating contact.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
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
    const response = await mongodb
      .getDb()
      .db('restaurant')
      .collection('users')
      .replaceOne({ _id: userId }, contact);
    console.log(response);
    if (response.acknowledged) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Error occured shile updating contact.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
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
  //#swagger.tags=['Users']
  try {
  try {
    const userId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db('restaurant')
      .collection('users')
      .deleteOne({ _id: userId }, true);
    console.log(response);
    if (response.deletedCount > 0) {
      res.status(200).send();
    } else {
      res.status(500).json(response.error || 'Error occured while deleting contact.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
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

module.exports = { getAll, getOne, createUser, updateUser, deleteUser };

module.exports = {
  getAllUser,
  getSingleUser,
  deleteUser,
  createUser,
  updateUser,
};
