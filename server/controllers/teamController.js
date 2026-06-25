const Team = require("../models/Team");
const User = require("../models/User");
const Notification = require("../models/Notification");

// Create Team
const createTeam = async (req, res) => {
    try {
        const { name, description } = req.body;

        const team = await Team.create({
            name,
            description,
            owner: req.user._id,
            members: [req.user._id],
        });

        res.status(201).json(team);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Get My Teams
const getTeams = async (req, res) => {
    try {
        const teams = await Team.find({
            members: req.user._id,
        })
            .populate("owner", "name email")
            .populate("members", "name email");

        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Delete Team
const deleteTeam = async (req, res) => {
    try {
        const team = await Team.findOne({
            _id: req.params.id,
            owner: req.user._id,
        });

        if (!team) {
            return res.status(404).json({
                message: "Team not found",
            });
        }

        await team.deleteOne();

        res.status(200).json({
            message: "Team deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const updateTeam = async (req, res) => {
    try {
        const { name, description } = req.body;

        const team = await Team.findOne({
            _id: req.params.id,
            owner: req.user._id,
        });

        if (!team) {
            return res.status(404).json({
                message: "Team not found",
            });
        }

        team.name = name || team.name;
        team.description = description || team.description;

        await team.save();

        res.status(200).json(team);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const inviteMember = async (req, res) => {
    try {
        const { email } = req.body;

        const team = await Team.findOne({
            _id: req.params.id,
            owner: req.user._id,
        });

        if (!team) {
            return res.status(404).json({
                message: "Team not found or you are not the owner",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (team.members.includes(user._id)) {
            return res.status(400).json({
                message: "User already a member",
            });
        }

        if (team.pendingInvites.includes(user._id)) {
            return res.status(400).json({
                message: "Invitation already sent",
            });
        }

        team.pendingInvites.push(user._id);

        await team.save();

        // Create Notification when Inviting
        await Notification.create({
            user: user._id,

            title: "Team Invitation",

            message: `${req.user.name} invited you to join "${team.name}"`,

            type: "team-invite",

            team: team._id,

            inviterName: req.user.name,
        });

        res.status(200).json({
            message: "Invitation sent",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getTeamById = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id)
            .populate("owner", "name email")
            .populate("members", "name email")
            .populate("pendingInvites", "name email");

        if (!team) {
            return res.status(404).json({
                message: "Team not found",
            });
        }

        res.status(200).json(team);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const removeMember = async (req, res) => {
    try {
        const team = await Team.findById(req.params.teamId);

        if (!team) {
            return res.status(404).json({
                message: "Team not found",
            });
        }

        if (team.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Only owner can remove members",
            });
        }

        if (team.owner.toString() === req.params.userId) {
            return res.status(400).json({
                message: "Owner cannot be removed",
            });
        }

        team.members = team.members.filter(
            (member) => member.toString() !== req.params.userId
        );

        await team.save();

        res.status(200).json({
            message: "Member removed",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const acceptInvitation = async (req, res) => {
    try {
        const team = await Team.findById(req.params.teamId);

        if (!team) {
            return res.status(404).json({
                message: "Team not found",
            });
        }

        if (!team.pendingInvites.includes(req.user._id)) {
            return res.status(400).json({
                message: "Invitation not found",
            });
        }

        team.pendingInvites = team.pendingInvites.filter(
            (id) => id.toString() !== req.user._id.toString()
        );

        team.members.push(req.user._id);

        await team.save();

        res.status(200).json({
            message: "Invitation accepted",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const rejectInvitation = async (req, res) => {
    try {
        const team = await Team.findById(req.params.teamId);

        if (!team) {
            return res.status(404).json({
                message: "Team not found",
            });
        }

        team.pendingInvites = team.pendingInvites.filter(
            (id) => id.toString() !== req.user._id.toString()
        );

        await team.save();

        res.status(200).json({
            message: "Invitation rejected",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getMyInvitations = async (req, res) => {
    try {
        const teams = await Team.find({
            pendingInvites: req.user._id,
        })
            .populate("owner", "name email")
            .populate("members", "name email");

        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
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
};