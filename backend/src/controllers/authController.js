const bcrypt = require("bcryptjs");
const { createUser, findUserByEmail } = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const { validateEmail, validatePassword, validateName } = require("../middleware/validateInput");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate all fields
  const nameError = validateName(name);
  if (nameError) {
    res.status(400);
    throw new Error(nameError);
  }

  const emailError = validateEmail(email);
  if (emailError) {
    res.status(400);
    throw new Error(emailError);
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    res.status(400);
    throw new Error(passwordError);
  }

  const normalizedEmail = email.toLowerCase().trim();
  const trimmedName = name.trim();

  const userExists = await findUserByEmail(normalizedEmail);
  if (userExists) {
    res.status(409);
    throw new Error("User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser({
    name: trimmedName,
    email: normalizedEmail,
    password: hashedPassword,
  });
  const token = generateToken(user.id);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: { user, token },
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await findUserByEmail(normalizedEmail);
  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user.id);
  delete user.password;

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: { user, token },
  });
};

const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: { user: req.user },
  });
};

module.exports = { registerUser, loginUser, getMe };
