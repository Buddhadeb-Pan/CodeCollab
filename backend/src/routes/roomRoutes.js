const express = require("express");
const router = express.Router();
const { createNewRoom, getRoomByCode, getMyRooms, deleteRoomById } = require("../controllers/roomController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createNewRoom);
router.get("/my", protect, getMyRooms);
router.get("/:code", protect, getRoomByCode);
router.delete("/:id", protect, deleteRoomById);

module.exports = router;
