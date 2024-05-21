const express = require("express");
const debug = require('debug')('app');
const _ = require("lodash");
const auth = require('../middlewares/auth');
const { Course, validate } = require("../models/course");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    if (courses.length === 0) return res.status(404).send("No Course Found");
    res.send(courses);
  } catch(err) {
    debug(err)
    res.send(err)
  }
});

router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if(!course) return res.status(404).send('Course is not found.')
  
    res.status(200).send(course);
  }  catch(err) {
    res.send(err)
    debug(err)
  }
});

router.post("/",  auth,async (req, res) => {
  try {
    const { error } = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)
  
    const newCourse = new Course(
      _.pick(req.body, ["name", "instructor", "NoOfperiods"])
    );
    await newCourse.save();
    
    res.send(newCourse);
  }
   catch(err) {
    res.send(err)
    debug(err)
   }
});

router.put("/:id", auth,async (req, res) => {
  try {  
    const { error } = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)
  
    const course = await Course.findByIdAndUpdate(req.params.id, _.pick(req.body, ["name", "instructor", "NoOfperiods"]))
    if(!course) return res.status(404).send("Course is not found.")
    res.send(course)
  } catch(err) {
    res.send(err)
    debug(err)
  }
  });
  
  router.delete("/:id", auth,async (req, res) => {
    try {
      const course = await Course.findByIdAndDelete(req.params.id);
       if(!course) return res.status(404).send("Course is not found.")
      res.status(200).send(course)
    }
   catch(err) {
    res.send(err)
    debug(err)
  }
});

module.exports = router;
