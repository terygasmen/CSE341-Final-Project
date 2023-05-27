// Mock database
const database = {
  menu: [
    {
      _id: '1',
      name: 'Item 1',
      description: 'Description 1',
      price: 10.99,
      cost: 5.99,
      average_rating: 4.5,
      menu_id: 'menu1'
    },
    {
      _id: '2',
      name: 'Item 2',
      description: 'Description 2',
      price: 8.99,
      cost: 3.99,
      average_rating: 3.8,
      menu_id: 'menu2'
    }
    // Add more menu items here if needed
  ]
};

// Helper function to simulate asynchronous behavior
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock MongoDB functions
const getDb = () => ({
  db: () => ({
    collection: (collectionName) => ({
      find: () => ({
        toArray: async () => {
          // Simulate delay to mimic asynchronous behavior
          await delay(100);
          return database[collectionName];
        }
      }),
      insertOne: async (document) => {
        // Simulate delay to mimic asynchronous behavior
        await delay(100);
        database[collectionName].push(document);
        return { acknowledged: true };
      },
      replaceOne: async (filter, document) => {
        // Simulate delay to mimic asynchronous behavior
        await delay(100);
        const index = database[collectionName].findIndex((item) => item._id === filter._id);
        if (index !== -1) {
          database[collectionName][index] = document;
          return { modifiedCount: 1 };
        } else {
          return { modifiedCount: 0 };
        }
      },
      deleteOne: async (filter) => {
        // Simulate delay to mimic asynchronous behavior
        await delay(100);
        const index = database[collectionName].findIndex((item) => item._id === filter._id);
        if (index !== -1) {
          database[collectionName].splice(index, 1);
          return { deletedCount: 1 };
        } else {
          return { deletedCount: 0 };
        }
      }
    })
  })
});

module.exports = {
  getAll: async (req, res) => {
    try {
      const result = await getDb().db().collection('menu').find();
      const lists = await result.toArray();
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    } catch (error) {
      res.status(500).json(error.message || 'Some error occurred while retrieving restaurants.');
    }
  },
  getSingle: async (req, res) => {
    try {
      const userId = req.params.id;
      const result = await getDb().db().collection('menu').find({ _id: userId });
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
  },
  createMenu: async (req, res) => {
    try {
      const { name, description, price, cost, average_rating, menu_id } = req.body.menu;

      const menu = {
        _id: Date.now().toString(), // Generate a unique ID for the menu item
        name,
        description,
        price,
        cost,
        average_rating,
        menu_id
      };

      const response = await getDb().db().collection('menu').insertOne(menu);
      if (response.acknowledged) {
        res.status(201).json(response);
      } else {
        res.status(500).json('Some error occurred while creating the restaurant.');
      }
    } catch (error) {
      res.status(500).json(error.message || 'Some error occurred while creating the restaurant.');
    }
  },
  updateMenu: async (req, res) => {
    try {
      const userId = req.params.id;

      // Validate the required fields
      const requiredFields = ['name', 'description', 'price', 'cost', 'average_rating', 'menu_id'];
      const missingFields = requiredFields.filter((field) => !(field in req.body));
      if (missingFields.length > 0) {
        return res
          .status(400)
          .json({ error: `Missing required fields: ${missingFields.join(', ')}` });
      }

      const { name, description, price, cost, average_rating, menu_id } = req.body;

      const menu = {
        _id: userId,
        name,
        description,
        price,
        cost,
        average_rating,
        menu_id
      };

      const response = await getDb().db().collection('menu').replaceOne({ _id: userId }, menu);

      if (response.modifiedCount > 0) {
        res.status(204).send();
      } else {
        res.status(500).json('Some error occurred while updating the restaurant.');
      }
    } catch (error) {
      res.status(500).json(error.message || 'Some error occurred while updating the restaurant.');
    }
  },
  deleteMenu: async (req, res) => {
    try {
      const userId = req.params.id;
      const response = await getDb().db().collection('menu').deleteOne({ _id: userId }, true);
      console.log(response);
      if (response.deletedCount > 0) {
        res.status(204).send();
      } else {
        res.status(500).json('Some error occurred while deleting the restaurant.');
      }
    } catch (error) {
      res.status(500).json(error.message || 'Some error occurred while deleting the restaurant.');
    }
  }
};
