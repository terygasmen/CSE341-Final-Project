const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('contacts').find();
    const lists = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while retrieving contacts.');
  }
};

const getSingle = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('contacts').find({ _id: userId });
    const lists = await result.toArray();
    if (lists.length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists[0]);
    } else {
      res.status(404).json('Contact not found.');
    }
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while retrieving the contact.');
  }
};

const createContact = async (req, res) => {
  try {
    const {
      name,
      bio,
      brand,
      social_media: {
        Facebook: {
          user_handle: facebook_user_handle,
          link_title: facebook_link_title,
          website: facebook_website,
          url: facebook_url
        },
        Instagram: {
          user_handle: instagram_user_handle,
          link_title: instagram_link_title,
          website: instagram_website,
          url: instagram_url
        },
        Twitter: {
          user_handle: twitter_user_handle,
          link_title: twitter_link_title,
          website: twitter_website,
          url: twitter_url
        },
        LinkedIn: {
          user_handle: linkedin_user_handle,
          link_title: linkedin_link_title,
          website: linkedin_website,
          url: linkedin_url
        },
        Youtube: {
          user_handle: youtube_user_handle,
          link_title: youtube_link_title,
          website: youtube_website,
          url: youtube_url
        },
        Pinterest: {
          user_handle: pinterest_user_handle,
          link_title: pinterest_link_title,
          website: pinterest_website,
          url: pinterest_url
        },
        Snapchat: {
          user_handle: snapchat_user_handle,
          link_title: snapchat_link_title,
          website: snapchat_website,
          url: snapchat_url
        },
        Tiktok: {
          user_handle: tiktok_user_handle,
          link_title: tiktok_link_title,
          website: tiktok_website,
          url: tiktok_url
        },
        Reddit: {
          user_handle: reddit_user_handle,
          link_title: reddit_link_title,
          website: reddit_website,
          url: reddit_url
        },
        WhatsApp: {
          user_handle: whatsapp_user_handle,
          link_title: whatsapp_link_title,
          website: whatsapp_website,
          url: whatsapp_url
        }
      }
    } = req.body;

    const contact = {
      name,
      bio,
      brand,
      social_media: {
        Facebook: {
          user_handle: facebook_user_handle,
          link_title: facebook_link_title,
          website: facebook_website,
          url: facebook_url
        },
        Instagram: {
          user_handle: instagram_user_handle,
          link_title: instagram_link_title,
          website: instagram_website,
          url: instagram_url
        },
        Twitter: {
          user_handle: twitter_user_handle,
          link_title: twitter_link_title,
          website: twitter_website,
          url: twitter_url
        },
        LinkedIn: {
          user_handle: linkedin_user_handle,
          link_title: linkedin_link_title,
          website: linkedin_website,
          url: linkedin_url
        },
        Youtube: {
          user_handle: youtube_user_handle,
          link_title: youtube_link_title,
          website: youtube_website,
          url: youtube_url
        },
        Pinterest: {
          user_handle: pinterest_user_handle,
          link_title: pinterest_link_title,
          website: pinterest_website,
          url: pinterest_url
        },
        Snapchat: {
          user_handle: snapchat_user_handle,
          link_title: snapchat_link_title,
          website: snapchat_website,
          url: snapchat_url
        },
        Tiktok: {
          user_handle: tiktok_user_handle,
          link_title: tiktok_link_title,
          website: tiktok_website,
          url: tiktok_url
        },
        Reddit: {
          user_handle: reddit_user_handle,
          link_title: reddit_link_title,
          website: reddit_website,
          url: reddit_url
        },
        WhatsApp: {
          user_handle: whatsapp_user_handle,
          link_title: whatsapp_link_title,
          website: whatsapp_website,
          url: whatsapp_url
        }
      }
    };

    const response = await mongodb.getDb().db().collection('contacts').insertOne(contact);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json('Some error occurred while creating the contact.');
    }
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while creating the contact.');
  }
};

const updateContact = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);

    // Validate the required fields
    const requiredFields = ['name', 'bio', 'brand'];
    const missingFields = requiredFields.filter(field => !(field in req.body));
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    // Validate the fields that should be integers
    const integerFields = ['facebook_user_handle', 'twitter_user_handle', 'instagram_user_handle', 'linkedin_user_handle', 'youtube_user_handle', 'pinterest_user_handle', 'snapchat_user_handle', 'tiktok_user_handle', 'reddit_user_handle', 'whatsapp_user_handle'];
    const invalidIntegerFields = integerFields.filter(field => {
      const value = req.body[field];
      return value !== undefined && typeof value !== 'number' && isNaN(value);
    });
    if (invalidIntegerFields.length > 0) {
      return res.status(400).json({ error: `Invalid integer fields: ${invalidIntegerFields.join(', ')}` });
    }

    const contact = {
      name: req.body.name,
      bio: req.body.bio,
      brand: req.body.brand,
      social_media: {
        Facebook: {
          user_handle: req.body.facebook_user_handle,
          link_title: req.body.facebook_link_title,
          website: req.body.facebook_website,
          url: req.body.facebook_url
        },
        Instagram: {
          user_handle: req.body.instagram_user_handle,
          link_title: req.body.instagram_link_title,
          website: req.body.instagram_website,
          url: req.body.instagram_url
        },
        Twitter: {
          user_handle: req.body.twitter_user_handle,
          link_title: req.body.twitter_link_title,
          website: req.body.twitter_website,
          url: req.body.twitter_url
        },
        LinkedIn: {
          user_handle: req.body.linkedin_user_handle,
          link_title: req.body.linkedin_link_title,
          website: req.body.linkedin_website,
          url: req.body.linkedin_url
        },
        Youtube: {
          user_handle: req.body.youtube_user_handle,
          link_title: req.body.youtube_link_title,
          website: req.body.youtube_website,
          url: req.body.youtube_url
        },
        Pinterest: {
          user_handle: req.body.pinterest_user_handle,
          link_title: req.body.pinterest_link_title,
          website: req.body.pinterest_website,
          url: req.body.pinterest_url
        },
        Snapchat: {
          user_handle: req.body.snapchat_user_handle,
          link_title: req.body.snapchat_link_title,
          website: req.body.snapchat_website,
          url: req.body.snapchat_url
        },
        Tiktok: {
          user_handle: req.body.tiktok_user_handle,
          link_title: req.body.tiktok_link_title,
          website: req.body.tiktok_website,
          url: req.body.tiktok_url
        },
        Reddit: {
          user_handle: req.body.reddit_user_handle,
          link_title: req.body.reddit_link_title,
          website: req.body.reddit_website,
          url: req.body.reddit_url
        },
        WhatsApp: {
          user_handle: req.body.whatsapp_user_handle,
          link_title: req.body.whatsapp_link_title,
          website: req.body.whatsapp_website,
          url: req.body.whatsapp_url
        }
      }
    };

    const response = await mongodb.getDb().db().collection('contacts').replaceOne({ _id: userId }, contact);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json('Some error occurred while updating the contact.');
    }
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while updating the contact.');
  }
};


const deleteContact = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db()
      .collection('contacts')
      .deleteOne({ _id: userId }, true);
    console.log(response);
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json('Some error occurred while deleting the contact.');
    }
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while deleting the contact.');
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact
};