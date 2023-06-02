const { ObjectId } = require('mongodb');
const {
  getAll,
  getSingle,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
} = require('../controllers/restaurants');

// I'll first create the MongoDB connection and collection methods
jest.mock('../db/connect', () => {
  const mockCollection = {
    find: jest.fn().mockReturnThis(),
    toArray: jest.fn().mockResolvedValue([])
  };

  const mockDb = {
    collection: jest.fn().mockReturnValue(mockCollection)
  };

  const mockClient = {
    db: jest.fn().mockReturnValue(mockDb)
  };

  return {
    getDb: jest.fn().mockReturnValue(mockClient)
  };
});

describe('getAll', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {};
    res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should retrieve and return all restaurants', async () => {
    await getAll(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);

    expect(res.status).not.toHaveBeenCalledWith(500);
    expect(res.json).not.toHaveBeenCalledWith(expect.any(String));
  });

  test('should handle errors and return 500 status', async () => {
    const errorMessage = 'Some error occurred while retrieving restaurants.';
    const error = new Error(errorMessage);

    // Mock the collection method to throw an error
    const mockCollection = {
      find: jest.fn().mockReturnThis(),
      toArray: jest.fn().mockRejectedValue(error)
    };

    const mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection)
    };

    const mockClient = {
      db: jest.fn().mockReturnValue(mockDb)
    };

    require('../db/connect').getDb.mockReturnValueOnce(mockClient);

    await getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(errorMessage);

    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalledWith(200);
    expect(res.json).not.toHaveBeenCalledWith([]);
  });
});

describe('getSingle', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: {
        id: 1
      }
    };
    res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should retrieve and return a single restaurant', async () => {
    const mockRestaurant = { id: 1, name: 'Restaurant A' };

    // Mock the collection method to return a single restaurant
    const mockCollection = {
      find: jest.fn().mockReturnThis(),
      toArray: jest.fn().mockResolvedValue([mockRestaurant])
    };

    const mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection)
    };

    const mockClient = {
      db: jest.fn().mockReturnValue(mockDb)
    };

    require('../db/connect').getDb.mockReturnValueOnce(mockClient);

    await getSingle(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockRestaurant);

    expect(res.status).not.toHaveBeenCalledWith(404);
    expect(res.json).not.toHaveBeenCalledWith('Restaurant not found.');
    expect(res.status).not.toHaveBeenCalledWith(500);
    expect(res.json).not.toHaveBeenCalledWith(expect.any(String));
  });

  test('should handle restaurant not found', async () => {
    const mockToArray = jest.fn().mockResolvedValue([]);
    jest.spyOn(require('../db/connect').getDb().db().collection(), 'find').mockReturnValueOnce({
      toArray: mockToArray
    });

    await getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith('Restaurant not found.');

    expect(res.setHeader).not.toHaveBeenCalledWith('Content-Type', 'application/json');

    // check if res.json was called with a string argument
    expect(res.json).not.toHaveBeenCalledWith(Array);
    expect(res.status).not.toHaveBeenCalledWith(200);
  });
});

describe('createRestaurant', () => {
  let req;
  let res;
  let mockClient;
  let mockCollection;
  let mockDb;

  beforeEach(() => {
    req = {
      body: {
        name: 'Test Restaurant',
        description: 'Test description',
        phone_number: '1234567890',
        opening_hours: '9 AM - 5 PM',
        average_rating: 4.5,
        menu_id: 'abc123'
      }
    };
    res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mock the MongoDB insertOne method
    const mockInsertOne = jest.fn().mockResolvedValue({
      acknowledged: true,
      insertedId: 'def456'
    });

    mockCollection = {
      insertOne: mockInsertOne
    };

    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection)
    };

    mockClient = {
      db: jest.fn().mockReturnValue(mockDb)
    };

    require('../db/connect').getDb.mockReturnValue(mockClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create a restaurant and return 201 status with response', async () => {
    await createRestaurant(req, res);

    expect(require('../db/connect').getDb).toHaveBeenCalledTimes(1);
    expect(require('../db/connect').getDb).toHaveBeenCalledWith();
    expect(mockClient.db).toHaveBeenCalledTimes(1);
    expect(mockClient.db).toHaveBeenCalledWith();
    expect(mockDb.collection).toHaveBeenCalledTimes(1);
    expect(mockDb.collection).toHaveBeenCalledWith('restaurant');
    expect(mockCollection.insertOne).toHaveBeenCalledTimes(1);
    expect(mockCollection.insertOne).toHaveBeenCalledWith({
      name: 'Test Restaurant',
      description: 'Test description',
      phone_number: '1234567890',
      opening_hours: '9 AM - 5 PM',
      average_rating: 4.5,
      menu_id: 'abc123'
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      acknowledged: true,
      insertedId: 'def456'
    });

    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalledWith(500);
    expect(res.json).not.toHaveBeenCalledWith(expect.any(String));
  });

  test('should handle errors and return 500 status', async () => {
    const errorMessage = 'Some error occurred while creating the restaurant.';
    const error = new Error(errorMessage);

    // Mock the MongoDB insertOne method to throw an error
    mockCollection.insertOne.mockRejectedValue(error);

    await createRestaurant(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(errorMessage);

    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalledWith(201);
    expect(res.json).not.toHaveBeenCalledWith([expect.any(String)]);
  });
});

describe('updateRestaurant', () => {
  let req;
  let res;
  let mockCollection;
  let mockDb;
  let mockClient;

  beforeEach(() => {
    req = {
      params: {
        id: '646f79d0f3c0b6aa6b2be7b7'
      },
      body: {
        name: 'Updated Restaurant',
        description: 'Updated description',
        phone_number: '9876543210',
        opening_hours: '10 AM - 6 PM',
        average_rating: 4.8,
        menu_id: 'xyz789'
      }
    };
    res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mock the MongoDB replaceOne method
    const mockReplaceOne = jest.fn().mockResolvedValue({
      modifiedCount: 1
    });

    mockCollection = {
      replaceOne: mockReplaceOne
    };

    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection)
    };

    mockClient = {
      db: jest.fn().mockReturnValueOnce(mockDb) 
    };

    require('../db/connect').getDb.mockReturnValue(mockClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should update a restaurant and return 204 status', async () => {
    await updateRestaurant(req, res);

    expect(mockClient.db).toHaveBeenCalledTimes(1);
    expect(mockClient.db).toHaveBeenCalledWith();
    expect(mockDb.collection).toHaveBeenCalledTimes(1);
    expect(mockDb.collection).toHaveBeenCalledWith('restaurant');
    expect(mockCollection.replaceOne).toHaveBeenCalledTimes(1);
    expect(mockCollection.replaceOne).toHaveBeenCalledWith(
      { _id: ObjectId('646f79d0f3c0b6aa6b2be7b7') },
      {
        name: 'Updated Restaurant',
        description: 'Updated description',
        phone_number: '9876543210',
        opening_hours: '10 AM - 6 PM',
        average_rating: 4.8,
        menu_id: 'xyz789'
      }
    );

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith({});

    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalledWith(500);
  });

  test('should handle errors and return 500 status', async () => {
    const errorMessage = 'Some error occurred while updating the restaurant.';
    const error = new Error(errorMessage);

    // Mock the MongoDB replaceOne method to throw an error
    mockCollection.replaceOne.mockRejectedValue(error);

    await updateRestaurant(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(errorMessage);

    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalledWith(204);
  });

  test('should handle missing required fields and return 400 status', async () => {
    // Let me omit the 'name' field so as to simulate a missing required field
    delete req.body.name;

    await updateRestaurant(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields: name' });

    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalledWith(204);
    expect(res.json).not.toHaveBeenCalledWith({});
  });
});

describe('deleteRestaurant', () => {
  let req;
  let res;
  let mockCollection;
  let mockDb;
  let mockClient;

  beforeEach(() => {
    req = {
      params: {
        id: '646f79d0f3c0b6aa6b2be7b7'
      }
    };

    res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // A Mock of the MongoDB deleteOne method
    const mockDeleteOne = jest.fn().mockResolvedValue({
      deletedCount: 1
    });

    mockCollection = {
      deleteOne: mockDeleteOne
    };

    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection)
    };

    mockClient = {
      db: jest.fn().mockReturnValue(mockDb)
    };

    require('../db/connect').getDb.mockReturnValue(mockClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should delete a restaurant and return 204 status', async () => {
    const resu = await deleteRestaurant(req, res);
    console.log(resu);
    expect(mockClient.db).toHaveBeenCalledTimes(1);
    expect(mockClient.db).toHaveBeenCalledWith();
    expect(mockDb.collection).toHaveBeenCalledTimes(1);
    expect(mockDb.collection).toHaveBeenCalledWith('restaurant');
    expect(mockCollection.deleteOne).toHaveBeenCalledTimes(1);
    expect(mockCollection.deleteOne).toHaveBeenCalledWith({ id: ObjectId('646f79d0f3c0b6aa6b2be7b7') });

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith({});
    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalledWith(500);
  });

  test('should handle errors and return 500 status', async () => {
    const errorMessage = 'Some error occurred while deleting the restaurant.';
    const error = new Error(errorMessage);

    // Mock the MongoDB deleteOne method to throw an error
    mockCollection.deleteOne.mockRejectedValue(error);

    await deleteRestaurant(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(errorMessage);
    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalledWith(204);
    expect(res.json).not.toHaveBeenCalledWith();
  });
});
