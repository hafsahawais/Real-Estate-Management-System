const moment = require('moment');
const fs = require('fs');
var Grid  = require('gridfs-stream');
const mongoose = require("mongoose");
var property_type = require('../models/property_type');
var Property = require('../models/property');
const helpers = require('../provider/helper');


var gfs;
var conn = mongoose.connection;
conn.on('connected', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('imageMeta');
});

module.exports = {
  propertyTypeList: (req, res) => {
    property_type.find({is_active: true}, (err, result) => {
      if (err)
        res.status(400).send(err);
      else
        res.status(200).json(result);
    });
  },
  addPropertyType: (req, res) => {
    var proptyp = new property_type();

    proptyp.title = req.body.title;
    proptyp.type = req.body.type;
    proptyp.createdOn = Date.now();

    proptyp.save((err, result) => {
      if (err)
        res.status(400).send(err);
      else
        res.status(200).json({ message: 'Property type added successfully', id: result._id });
    });
  },
  addNewProperty: async (req, res) => {
    let imgs = [];
    try{

      if(req.files && req.files.length)
        req.files.forEach(ele => imgs.push(ele.filename) );
      //Creating slug for the listing
      var slug  = await helpers.slugGenerator(req.body.title, 'title', 'property');
      req.body.slug = slug;
      req.body.type = req.body.Proptype;
      req.body.cornerPlot = req.body.cornerPlot ? true : false;
      req.body.images = imgs;
      req.body.imgPath = 'properties';

      const prop = new Property(req.body);
      const result = await prop.save();

      if(result && result._id && result.slug)
        res.status(200).json({result, message: "Your property has been successfully posted"});
      else throw new Error('Something Went Wrong');
    }
    catch(err){
      console.log({err});
      res.status(400).json({message: err.message});
    }
  },
  addPropertyToProject: (req, res) => {

    Property.find({_id: req.params.projectId}).exec((err, resp) => {
      let imgs = [];
      if (req.files && req.files.length)
        req.files.forEach(ele => imgs.push(ele.filename));

      Property.title = req.body.title;
      Property.description = req.body.description;
      Property.location = req.body.location;
      Property.images = imgs;
      Property.propertyFor = req.body.propertyFor;
      Property.length= req.body.length;
      Property.breadth= req.body.breadth;
      Property.cornerPlot = req.body.cornerPlot ? true : false;
      Property.price = req.body.price;
      Property.status = req.body.status;
      Property.bookingId = req.body.bookingId;
      Property.address = req.body.address;
      Property.email = req.body.email;
      Property.phoneNo  = req.body.phoneNo;
      Property.propertyTypes = req.body.propertyTypes;
      Property.imgPath = 'properties';

      Property.save((err, data) => {
        if (err) res.status(400).send(err);
        else
          res
              .status(200)
              .json({message: "Property Added Successfully to the project", id: data._id});
      });


    })
    // new Promise((resolve, reject) => {
    //     return Project.findOne({ _id: req.body._id })
    // })
    //     .then(resp => {
    //         res.status(200).json({resp});
    //     })
    //     .catch()
  },
  getUserList: (req, res) => {
    Property.find({ isActive: true, userId: req.params.userId })
      .populate('userId')

      .exec((err, result) => {
        if (err)
          res.status(400).send(err);
        else
          res.status(200).json(result);
      });
  },
  getPropertyForProject: async (req, res) => {
    try{
      var result  = await Property.find({ projectId: req.params.projectId })
          .populate('projectId');
      if(result) res.status(200).json({result});
      else throw new Error('Something Went Wrong');
    }
    catch(err){
      res.status(400).json({message: err.message});
    }

  },
  getMyProperty: async (req, res) => {
    try{
      var result  = await Property.find({ userId: req.params.userId })
          .populate('userId');
      if(result) res.status(200).json({result});
      else throw new Error('Something Went Wrong');
    }
    catch(err){
      res.status(400).json({message: err.message});
    }

  },
  getSingleProperty: async (req, res) => {
    try{
      var result  = await Property.findOne({ _id: req.params.propertyId })
          .populate('userId');
      if(result) res.status(200).json({result});
      else throw new Error('Something Went Wrong');
    }
    catch(err){
      res.status(400).json({message: err.message});
    }

  },
  getFullList: (req, res) => {
    Property.find({ isActive: true, projectId: null})
      .populate('userId')
      .exec((err, result) => {
        if (err)
          res.status(400).send(err);
        else
          res.status(200).json(result);
      });
  },
  markAsSold: async (req, res) => {
    try{
      const result = await Property.findOneAndUpdate({ _id: req.body._id }, { status: req.body.status , userId: req.body.userId });
      console.log({result});
      if(result && result.nModified === 1 && status === 'Sold') res.status(200).json({ result, message: "Property has been updated Successfully" });
      else throw new Error('Error in updating property');
    }
    catch(err){
      res.status(400).json({message: err.message});
    }
  },

  filterProperties: (req, res) => {
    // console.log('propertyFor ', req.query.propertyFor, typeof req.query.propertyFor);
    // console.log(req.query.propertyFor.split(","));
    var query = {};
    query['isActive'] = true;

    if (req.query.propertyFor)
      query['propertyFor'] = { $in: req.query.propertyFor.split(",") };
    if (req.query.type)
      query['type'] = { $in: req.query.type.split(",") };
    if (req.query.city)
      query['city'] = { $in: req.query.city.split(",") };
    if (req.query.userId)
      query['userId'] = req.query.userId;
    if (req.query.notUserId)
      query['userId'] = { $ne: req.query.notUserId };
    if (req.query.status)
      query['status'] = { $in: req.query.status.split(",") };
    console.log({ query });
    Property.find(query)
      .populate('userId')
      .exec((err, result) => {
        if (err)
          res.status(400).send(err);
        else
          res.status(200).json(result);
      });
  },
  showGFSImage: (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }

      // Check if image
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    })
  }
};
