const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { isStrongPassword } = require("validator");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  // try {
  if (!email || !password) {
    return res.status(400).json({ error: "All fields must be filled" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ error: "Invalid password" });
  }
  const token = createToken(user._id);

  res.status(200).json({ email, token, _id: user._id });
  // } catch (error) {
  //   res.status(500).json({ error: error.message });
  // }
};

// signup a user
const signupUser = async (req, res) => {
  const { email, password, firstName, lastName, phoneNumber, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);
  // try {
  const userchecked = await User.findOne({
    email: req.body.email,
  });
  if (userchecked) {
    return res.status(400).json({ error: "Email already exists" });
  }
  const passwordCheck = isStrongPassword(password);
  if (!passwordCheck) {
    return res.status(400).json({ error: "Passwors not strong enough." });
  }
  const user = await User.signup(
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    role
  );
  const token = createToken(user._id);
  res.status(201).json({ email, token, _id: user._id });
  // } catch (error) {
  //   res.status(500).json({ error: error.message });
  // }
};

module.exports = { signupUser, loginUser };
