const config = require("config");
const debug = require("debug")("app");
const _ = require("lodash");
const auth = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const { Student, validate } = require("../models/student");
const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    if (students.length === 0) return res.status(404).send("No Student Found");
    res.send(students);
  } catch (err) {
    res.send(err);
    debug(err);
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).send("Student is not found.");

    res.status(200).send(student);
  } catch (err) {
    debug(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newStudent = new Student(
      _.pick(req.body, ["fname", "lname", "email", "password"])
    );

    const salt = await bcrypt.genSalt(Number(config.get("SALT")));
    newStudent.password = await bcrypt.hash(req.body.password, salt);

    const token = newStudent.generateAuthToken();
    await newStudent.save();
    res
      .header("x-auth-token", token)
      .send(
        "Account Created Successfully!. Check your PRIVATEKEY in Response Headers");
  } catch (err) {
    res.send(err);
    debug(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      _.pick(req.body, ["fname", "lname", "email", "password"])
    );

    if (!student) return res.status(404).send("Student is not found.");
    const token = student.generateAuthToken();

    res.send(token);
  } catch (err) {
    res.send(err);
    debug(err);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).send("Student is not found.");
    res.status(200).send(student);
  } catch (err) {
    res.send(err);
    debug(err);
  }
});

module.exports = router;
