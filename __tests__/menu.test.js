const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const { getAll, getSingle, deleteMenu, createMenu, updateMenu } = require('../controllers/menu');


jest.mock('../db/connect');

describe('Menu Route GetAll', () => {
  let req;
  let res;
  let mockCollection;
  let mockDb;
  let mockClient;

  beforeEach(() => {
    req = {};
    res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    // Mock the MongoDB collection
    mockCollection = {
      find: jest.fn().mockReturnThis(),
      toArray: jest.fn(),
    };

    // Mock the MongoDB database
    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };

    // Mock the MongoDB client
    mockClient = {
      db: jest.fn().mockReturnValue(mockDb),
    };

    mongodb.getDb.mockReturnValue(mockClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should retrieve and return all menus', async () => {
    const menuList = [{ name: 'Menu 1' }, { name: 'Menu 2' }];
    mockCollection.toArray.mockResolvedValue(menuList);

    await getAll(req, res);

    expect(mockClient.db).toHaveBeenCalled();
    expect(mockDb.collection).toHaveBeenCalledWith('menu');
    expect(mockCollection.find).toHaveBeenCalled();
    expect(mockCollection.toArray).toHaveBeenCalled();
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(menuList);
    expect(res.send).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalledWith(500);
  });

  test('should handle errors and return 500 status', async () => {
    const errorMessage = 'An error occurred';
    mockCollection.toArray.mockRejectedValue(new Error(errorMessage));

    await getAll(req, res);

    expect(mockClient.db).toHaveBeenCalled();
    expect(mockDb.collection).toHaveBeenCalledWith('menu');
    expect(mockCollection.find).toHaveBeenCalled();
    expect(mockCollection.toArray).toHaveBeenCalled();
    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(errorMessage);
    expect(res.send).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalledWith(200);
  });
});

describe('Menu Route getSingle', () => {
  let req;
  let res;
  let mockCollection;
  let mockDb;
  let mockClient;

  beforeEach(() => {
    req = {
      params: {
        id: '646f79d0f3c0b6aa6b2be7b7',
      },
    };
    res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the MongoDB collection
    mockCollection = {
      find: jest.fn().mockReturnThis(),
      toArray: jest.fn(),
    };

    // Mock the MongoDB database
    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };

    // Mock the MongoDB client
    mockClient = {
      db: jest.fn().mockReturnValue(mockDb),
    };

    mongodb.getDb.mockReturnValue(mockClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should retrieve and return a single menu', async () => {
    const menu = { name: 'Menu 1' };
    const menuList = [menu];
    mockCollection.toArray.mockResolvedValue(menuList);

    await getSingle(req, res);

    expect(mockDb.collection).toHaveBeenCalledWith('menu');
    expect(mockCollection.find).toHaveBeenCalledWith({ _id: ObjectId('646f79d0f3c0b6aa6b2be7b7') });
    expect(mockCollection.toArray).toHaveBeenCalled();
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(menu);
    expect(res.status).not.toHaveBeenCalledWith(404);
  });

  test('should handle restaurant not found and return 404 status', async () => {
    const menuList = [];
    mockCollection.toArray.mockResolvedValue(menuList);

    await getSingle(req, res);

    expect(mockDb.collection).toHaveBeenCalledWith('menu');
    expect(mockCollection.find).toHaveBeenCalledWith({ _id: ObjectId('646f79d0f3c0b6aa6b2be7b7') });
    expect(mockCollection.toArray).toHaveBeenCalled();
    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith('Restaurant not found.');
    expect(res.status).not.toHaveBeenCalledWith(200);
  });

  test('should handle errors and return 500 status', async () => {
    const errorMessage = 'An error occurred';
    mockCollection.toArray.mockRejectedValue(new Error(errorMessage));

    await getSingle(req, res);

    expect(mockDb.collection).toHaveBeenCalledWith('menu');
    expect(mockCollection.find).toHaveBeenCalledWith({ _id: ObjectId('646f79d0f3c0b6aa6b2be7b7') });
    expect(mockCollection.toArray).toHaveBeenCalled();
    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(errorMessage);
    expect(res.status).not.toHaveBeenCalledWith(200);
  });
});

describe('Menu Route createMenu', () => {
  let req;
  let res;
  let mockCollection;
  let mockDb;
  let mockClient;

  beforeEach(() => {
    req = {
      body: {
        menu: {
          name: 'Menu 1',
          description: 'Menu description',
          price: 10.99,
          cost: 5.99,
          average_rating: 4.5,
          menu_id: 'menu123',
        },
      },
    };
    res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the MongoDB collection
    mockCollection = {
      insertOne: jest.fn().mockReturnValue({ acknowledged: true }),
    };

    // Mock the MongoDB database
    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };

    // Mock the MongoDB client
    mockClient = {
      db: jest.fn().mockReturnValue(mockDb),
    };

    mongodb.getDb.mockReturnValue(mockClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create a menu and return 201 status', async () => {
    await createMenu(req, res);

    expect(mockDb.collection).toHaveBeenCalledWith('menu');
    expect(mockCollection.insertOne).toHaveBeenCalledWith(req.body.menu);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ acknowledged: true });
    expect(res.status).not.toHaveBeenCalledWith(500);
  });

  test('should handle errors and return 500 status', async () => {
    const errorMessage = 'An error occurred';
    mockCollection.insertOne.mockRejectedValue(new Error(errorMessage));

    await createMenu(req, res);

    expect(mockDb.collection).toHaveBeenCalledWith('menu');
    expect(mockCollection.insertOne).toHaveBeenCalledWith(req.body.menu);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(errorMessage);
    expect(res.status).not.toHaveBeenCalledWith(201);
  });
});


describe('Menu Route updateMenu', () => {
  let req;
  let res;
  let mockCollection;
  let mockDb;
  let mockClient;

  beforeEach(() => {
    req = {
      params: {
        id: '646f79d0f3c0b6aa6b2be7b7',
      },
      body: {
        name: 'Updated Menu 1',
        description: 'Updated Menu description',
        price: 12.99,
        cost: 6.99,
        average_rating: 4.8,
        menu_id: 'updated_menu123',
      },
    };
    res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    // Mock the MongoDB collection
    mockCollection = {
      replaceOne: jest.fn().mockReturnValue({ modifiedCount: 1 }),
    };

    // Mock the MongoDB database
    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };

    // Mock the MongoDB client
    mockClient = {
      db: jest.fn().mockReturnValue(mockDb),
    };

    mongodb.getDb.mockReturnValue(mockClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should update a menu and return 204 status', async () => {
    await updateMenu(req, res);

    expect(mockDb.collection).toHaveBeenCalledWith('menu');
    expect(mockCollection.replaceOne).toHaveBeenCalledWith(
      { _id: ObjectId('646f79d0f3c0b6aa6b2be7b7') },
      req.body
    );
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalledWith(500);
  });

  test('should handle errors and return 500 status', async () => {
    const errorMessage = 'An error occurred';
    mockCollection.replaceOne.mockRejectedValue(new Error(errorMessage));

    await updateMenu(req, res);

    expect(mockDb.collection).toHaveBeenCalledWith('menu');
    expect(mockCollection.replaceOne).toHaveBeenCalledWith(
      { _id: ObjectId('646f79d0f3c0b6aa6b2be7b7') },
      req.body
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(errorMessage);
    expect(res.status).not.toHaveBeenCalledWith(204);
  });

  test('should handle missing required fields and return 400 status', async () => {
    const missingFieldsReq = {
      params: { id: '646f79d0f3c0b6aa6b2be7b7' },
      body: {
        name: 'Updated Menu 1',
        description: 'Updated Menu description',
        price: 12.99,
        cost: 6.99,
      },
    };

    await updateMenu(missingFieldsReq, res);

    expect(mockDb.collection).not.toHaveBeenCalled();
    expect(mockCollection.replaceOne).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields: average_rating, menu_id' });
    expect(res.status).not.toHaveBeenCalledWith(204);
    expect(res.status).not.toHaveBeenCalledWith(500);
  });
});


describe('Menu Route deleteMenu', () => {
  let req;
  let res;
  let mockCollection;
  let mockDb;
  let mockClient;

  beforeEach(() => {
    req = {
      params: {
        id: '646f79d0f3c0b6aa6b2be7b7',
      },
    };
    res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    // Mock the MongoDB collection
    mockCollection = {
      deleteOne: jest.fn().mockReturnValue({ deletedCount: 1 }),
    };

    // Mock the MongoDB database
    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };

    // Mock the MongoDB client
    mockClient = {
      db: jest.fn().mockReturnValue(mockDb),
    };

    mongodb.getDb.mockReturnValue(mockClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should delete a menu and return 204 status', async () => {
    await deleteMenu(req, res);

    expect(mockDb.collection).toHaveBeenCalledWith('menu');
    expect(mockCollection.deleteOne).toHaveBeenCalledWith({ _id: ObjectId('646f79d0f3c0b6aa6b2be7b7') }, true);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalledWith(500);
  });

  test('should handle errors and return 500 status', async () => {
    const errorMessage = 'An error occurred';
    mockCollection.deleteOne.mockRejectedValue(new Error(errorMessage));

    await deleteMenu(req, res);

    expect(mockDb.collection).toHaveBeenCalledWith('menu');
    expect(mockCollection.deleteOne).toHaveBeenCalledWith({ _id: ObjectId('646f79d0f3c0b6aa6b2be7b7') }, true);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(errorMessage);
    expect(res.status).not.toHaveBeenCalledWith(204);
  });
});

