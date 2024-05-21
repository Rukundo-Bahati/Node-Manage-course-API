const config = require("config");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const studentSchema = new mongoose.Schema({
  fname: {
    type: String,
  },

  lname: {
    type: String,
  },
  email: {
    type: String,
    required: true,
},
  password: {
    type: String,
    required: true,
  },
});

studentSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, config.get('STUDENTPRIVATEKEY'));
  return token;
};

const Student = mongoose.model("Student", studentSchema);

function validateStudent(student) {
  const schema = Joi.object({
    fname: Joi.string().required(),
    lname: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  return schema.validate(student);
}

module.exports.Student = Student;
module.exports.validate = validateStudent;
