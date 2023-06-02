const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');
const { getAll, getOne, createUser, updateUser, deleteUser } = require('../controllers/users');

// Mock MongoDB functions
jest.mock('../db/connect');

describe('Users Route GetAll', () => {
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

  test('should retrieve and return all users', async () => {
    const userList = [{ name: 'User 1' }, { name: 'User 2' }];
    mockCollection.toArray.mockResolvedValue(userList);

    await getAll(req, res);

    expect(mockClient.db).toHaveBeenCalled();
    expect(mockDb.collection).toHaveBeenCalledWith('users');
    expect(mockCollection.find).toHaveBeenCalled();
    expect(mockCollection.toArray).toHaveBeenCalled();
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(userList);
    expect(res.send).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalledWith(500);
  });

  test('should handle errors and return 500 status', async () => {
    const errorMessage = 'An error occurred';
    mockCollection.toArray.mockRejectedValue(new Error(errorMessage));

    await getAll(req, res);

    expect(mockClient.db).toHaveBeenCalled();
    expect(mockDb.collection).toHaveBeenCalledWith('users');
    expect(mockCollection.find).toHaveBeenCalled();
    expect(mockCollection.toArray).toHaveBeenCalled();
    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(new Error(errorMessage));
    expect(res.send).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalledWith(200);
  });
});


describe('Users Route GetOne', () => {
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
  
    test('should retrieve and return a single user', async () => {

        
      const user = { name: 'John Doe' };
      const userId = new ObjectId(req.params.id);
      mockCollection.toArray.mockResolvedValueOnce([user]);
  
      await getOne(req, res);
  
      expect(mockClient.db).toHaveBeenCalled();
      expect(mockDb.collection).toHaveBeenCalledWith('users');
      expect(mockCollection.find).toHaveBeenCalledWith({ _id: userId });
      expect(mockCollection.toArray).toHaveBeenCalled();
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
      expect(res.send).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalledWith(500);
    });
       
  });


  describe('createUser', () => {

    let req;
    let res;
    let mockCollection;
    let mockDb;
    let mockClient;
  
    beforeEach(() => {
      req = {
        body: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            favoriteColor: 'blue',
            birthday: '1990-01-01'
          }
      };
      res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      }  
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
    test('should create a new user and return 201 status', async () => {
     
      await createUser(req, res);
  
      expect(mockCollection.insertOne).toHaveBeenCalledWith({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
      });
      
      expect(mockDb.collection).toHaveBeenCalledWith('users');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ acknowledged: true });
    });
  
    test('should return 500 status and error message when insertion fails', async () => {
      
        const errorMessage = 'An error occurred';
        mockCollection.insertOne.mockRejectedValue(new Error(errorMessage));
    
        await createUser(req, res);
    
        expect(mockDb.collection).toHaveBeenCalledWith('users');
        expect(mockCollection.insertOne).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(new Error(errorMessage));
        expect(res.status).not.toHaveBeenCalledWith(201);
    });
  
  });

  // Update the test cases
  describe('updateUser', () => {
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
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          favoriteColor: 'blue',
          birthday: '1990-01-01'
        }
      };
  
      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn()
      };
  
      mockCollection = {
        replaceOne: jest.fn().mockReturnValue({ acknowledged: true })
      };
  
      mockDb = {
        collection: jest.fn().mockReturnValue(mockCollection)
      };
  
      mockClient = {
        db: jest.fn().mockReturnValue(mockDb)
      };
  
      mongodb.getDb.mockReturnValue(mockClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
      });
  
    test('should update a user and return 204 status', async () => {
             
        await updateUser(req, res);
      
        expect(mongodb.getDb).toHaveBeenCalled();
        expect(mockDb.collection).toHaveBeenCalledWith('users');
        expect(mockCollection.replaceOne).toHaveBeenCalledWith(
          { _id: ObjectId('646f79d0f3c0b6aa6b2be7b7') },
          {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            favoriteColor: 'blue',
            birthday: '1990-01-01'
          }
        );
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
      });
      
      test('should return 500 status and error message when update fails', async () => {
        // Simulate failure while updating user
        const mockReplaceOneResponse = {
          acknowledged: false,
          error: 'Update failed'
        };
      
        // set the return value of the replaceOne function to failure
        mockCollection.replaceOne.mockResolvedValue(mockReplaceOneResponse);
      
        await updateUser(req, res);
      
        expect(mongodb.getDb).toHaveBeenCalled();
        expect(mockDb.collection).toHaveBeenCalledWith('users');
        expect(mockCollection.replaceOne).toHaveBeenCalledWith(
          { _id: ObjectId('646f79d0f3c0b6aa6b2be7b7') },
          {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            favoriteColor: 'blue',
            birthday: '1990-01-01'
          }
        );
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith('Update failed');
      });
      
      test('should return 500 status and error when an exception occurs', async () => {
        const mockError = new Error('Database error');
      
        mockCollection.replaceOne.mockRejectedValue(mockError);
      
        await updateUser(req, res);
      
        expect(mongodb.getDb).toHaveBeenCalled();
        expect(mockDb.collection).toHaveBeenCalledWith('users');
        expect(mockCollection.replaceOne).toHaveBeenCalledWith(
          { _id: ObjectId('646f79d0f3c0b6aa6b2be7b7') },
          {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            favoriteColor: 'blue',
            birthday: '1990-01-01'
          }
        );
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(mockError);
      });
      
  });
  