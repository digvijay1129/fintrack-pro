const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createTeam,
  getTeams,
  deleteTeam,
  updateTeam,
  inviteMember,
  getTeamById,
  removeMember,
  acceptInvitation,
  rejectInvitation,
  getMyInvitations,
} = require("../controllers/teamController");

router.post("/", protect, createTeam);

router.get("/", protect, getTeams);

router.delete("/:id", protect, deleteTeam);

router.post("/:id/invite", protect, inviteMember);

// IMPORTANT: Fixed route placed before the dynamic /:id route
router.get("/my-invitations", protect, getMyInvitations);

router.get("/:id", protect, getTeamById);

router.delete("/:teamId/members/:userId", protect, removeMember);

router.post("/:teamId/accept", protect, acceptInvitation);

router.post("/:teamId/reject", protect, rejectInvitation);

router.put("/:id", protect, updateTeam);

module.exports = router;