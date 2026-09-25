const { createRoom, findRoomByCode, findRoomById, getUserRooms, deleteRoom } = require("../models/roomModel");
const generateRoomCode = require("../utils/generateRoomCode");
const { validateRoomName } = require("../middleware/validateInput");

const sanitizeLanguage = (lang) => {
  const allowed = ["javascript", "python", "cpp", "java"];
  if (!lang || !allowed.includes(lang)) return "javascript";
  return lang;
};

const createNewRoom = async (req, res) => {
  const { name, language } = req.body;
  const ownerId = req.user.id;
  const sanitizedLanguage = sanitizeLanguage(language);

  const nameError = validateRoomName(name);
  if (nameError) {
    res.status(400);
    throw new Error(nameError);
  }

  let code;
  let existingRoom;
  let attempts = 0;
  do {
    code = generateRoomCode();
    existingRoom = await findRoomByCode(code);
    attempts++;
  } while (existingRoom && attempts < 10);

  if (existingRoom) {
    res.status(500);
    throw new Error("Could not generate unique room code. Try again.");
  }

  const room = await createRoom({
    code,
    name: name.trim(),
    language: sanitizedLanguage,
    ownerId,
  });

  res.status(201).json({
    success: true,
    message: "Room created successfully",
    data: { room },
  });
};

const getRoomByCode = async (req, res) => {
  const { code } = req.params;
  const room = await findRoomByCode(code.toUpperCase());

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  res.status(200).json({
    success: true,
    data: { room },
  });
};

const getMyRooms = async (req, res) => {
  const rooms = await getUserRooms(req.user.id);

  res.status(200).json({
    success: true,
    data: { rooms },
  });
};

const deleteRoomById = async (req, res) => {
  const { id } = req.params;
  const room = await findRoomById(id);

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  if (room.owner_id !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to delete this room");
  }

  await deleteRoom(id, req.user.id);

  res.status(200).json({
    success: true,
    message: "Room deleted successfully",
  });
};

module.exports = { createNewRoom, getRoomByCode, getMyRooms, deleteRoomById };
