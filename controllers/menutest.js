//const express = require('express')
const mongodb = require('../mockDb')



const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('menu').find();
    const lists = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while retrieving restaurants.');
  }
};

const getSingle = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await mongodb.getDb().db().collection('menu').find({ _id: userId });
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

const createMenu = async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        cost,
        average_rating,
        menu_id
      } = req.body.menu;
  
      const menu = {
        name,
        description,
        price,
        cost,
        average_rating,
        menu_id
      };
  
      const response = await mongodb.getDb().db().collection('menu').insertOne(menu);
      if (response.acknowledged) {
        res.status(201).json(response);
      } else {
        res.status(500).json('Some error occurred while creating the restaurant.');
      }
    } catch (error) {
      res.status(500).json(error.message || 'Some error occurred while creating the restaurant.');
    }
  };
  
  const updateMenu = async (req, res) => {
    try {
      const userId =req.params.id;
  
      // Validate the required fields
      const requiredFields = ['name', 'description', 'price', 'cost', 'average_rating', 'menu_id'];
      const missingFields = requiredFields.filter(field => !(field in req.body));
      if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
      }
  
      const {
        name,
        description,
        price,
        cost,
        average_rating,
        menu_id
      } = req.body;
  
      const menu = {
        name,
        description,
        price,
        cost,
        average_rating,
        menu_id
      };
  
      const response = await mongodb.getDb().db().collection('menu').replaceOne({ _id: userId }, menu);
  
      if (response.modifiedCount > 0) {
        res.status(204).send();
      } else {
        res.status(500).json('Some error occurred while updating the restaurant.');
      }
    } catch (error) {
      res.status(500).json(error.message || 'Some error occurred while updating the restaurant.');
    }
  };
const deleteMenu = async (req, res) => {
    try {
      const userId = (req.params.id);
      const response = await mongodb
        .getDb()
        .db()
        .collection('menu')
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
  deleteMenu,
  createMenu,
  updateMenu
};


/*

export default function(database){
    const app = express()

    app.use(express.json())
    app.post('/menu',(req,res)=>{
        const {
            title,
            description,
            price,
            cost
        }
        =req.body;
        if (!title || !description || !price || !cost){
            res.sendStatus(400)
            return
        }
        res.send({userId:0})

    })
    return app
}
*/