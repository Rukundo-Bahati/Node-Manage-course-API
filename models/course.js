const mongoose = require('mongoose');
const Joi = require('joi');

const Course = mongoose.model('Course', 
  new mongoose.Schema({
    name: {
      type: String,
    },

    instructor: {
      type:String,
    },
    NoOfperiods: {
      type:Number,
      required: true
    },
  })
)

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().required(),
    instructor: Joi.string().required(),
    NoOfperiods: Joi.number().required(),
  })

 return schema.validate(course)
}

module.exports.Course = Course
module.exports.validate = validateCourse

