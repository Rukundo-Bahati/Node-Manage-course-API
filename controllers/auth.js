const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const Joi = require('joi');
const { Student } = require("../models/student");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let existingstudent = await Student.findOne({ email: req.body.email });
  if (!existingstudent) {
    return res.status(400).send("Invalid Email or password.");
  }

  const validPassword = await bcrypt.compare(
    req.body.password,
    existingstudent.password
  );
  
  if (!validPassword) return res.status(400).send("Invalid Email or password.");
  const token = existingstudent.generateAuthToken()
  res.header('x-auth-token', token).send("Logged in Successfully! Welcome again");
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(5).max(500).required(),
  });

  return schema.validate(req);
}

module.exports = router;
