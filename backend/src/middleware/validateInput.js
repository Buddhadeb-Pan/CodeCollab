const validateRoomName = (name) => {
  if (!name || typeof name !== "string") return "Room name is required";
  const trimmed = name.trim();
  if (trimmed.length < 2) return "Room name must be at least 2 characters";
  if (trimmed.length > 50) return "Room name must be under 50 characters";
  // Block HTML/script injection
  if (/<[^>]*>/g.test(trimmed)) return "Room name cannot contain HTML";
  return null;
};

const validateEmail = (email) => {
  if (!email || typeof email !== "string") return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email format";
  if (email.length > 255) return "Email too long";
  return null;
};

const validatePassword = (password) => {
  if (!password || typeof password !== "string") return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  if (password.length > 100) return "Password too long (max 100 chars)";
  return null;
};

const validateName = (name) => {
  if (!name || typeof name !== "string") return "Name is required";
  const trimmed = name.trim();
  if (trimmed.length < 2) return "Name must be at least 2 characters";
  if (trimmed.length > 100) return "Name too long (max 100 chars)";
  if (/<[^>]*>/g.test(trimmed)) return "Name cannot contain HTML";
  return null;
};

module.exports = { validateRoomName, validateEmail, validatePassword, validateName };
