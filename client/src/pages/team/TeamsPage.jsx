import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaPlus } from "react-icons/fa";
import CreateTeamModal from "../../components/team/CreateTeamModal";
import InviteMemberModal from "../../components/team/InviteMemberModal";
import { getTeams } from "../../services/teamService";

function TeamsPage() {
  const [openModal, setOpenModal] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teams, setTeams] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const data = await getTeams();
      setTeams(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">
            Team Management
          </h1>

          <p className="text-slate-500 mt-2">
            Manage your finance teams and members.
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="
            flex
            items-center
            gap-2
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-6
            py-3
            rounded-xl
            shadow-lg
            transition-all
          "
        >
          <FaPlus />
          Create Team
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
        {teams.map((team) => (
          <div
            key={team._id}
            onClick={() => navigate(`/teams/${team._id}`)}
            className="
              bg-white
              cursor-pointer
              rounded-3xl
              shadow-lg
              p-6
              hover:shadow-2xl
              transition-all
            "
          >
            <div className="flex items-center gap-4 mb-5">
              <div
                className="
                  h-14
                  w-14
                  rounded-full
                  bg-blue-600
                  text-white
                  flex
                  items-center
                  justify-center
                  text-2xl
                  font-bold
                "
              >
                {team.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  {team.name}
                </h2>

                <p className="text-slate-500">
                  {team.description}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <p>
                👑 Owner:
                <strong>
                  {" "}
                  {team.owner?.name}
                </strong>
              </p>

              <p>
                👥 Members:
                <strong>
                  {" "}
                  {team.members.length}
                </strong>
              </p>

              <p>
                📅 Created:
                <strong>
                  {" "}
                  {new Date(
                    team.createdAt
                  ).toLocaleDateString()}
                </strong>
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-slate-100 rounded-xl p-3 text-center">
                <p className="text-xl font-bold">
                  {team.members.length}
                </p>
                <p className="text-xs text-slate-500">
                  Members
                </p>
              </div>

              <div className="bg-yellow-100 rounded-xl p-3 text-center">
                <p className="text-xl font-bold">
                  {team.pendingInvites?.length || 0}
                </p>
                <p className="text-xs text-slate-500">
                  Pending
                </p>
              </div>

              <div className="bg-green-100 rounded-xl p-3 text-center">
                <p className="text-xl font-bold">
                  Active
                </p>
                <p className="text-xs text-slate-500">
                  Status
                </p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTeam(team);
                setInviteOpen(true);
              }}
              className="
                mt-6
                w-full
                bg-indigo-600
                hover:bg-indigo-700
                text-white
                py-3
                rounded-xl
              "
            >
              Invite Member
            </button>
          </div>
        ))}
      </div>

      <CreateTeamModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        fetchTeams={fetchTeams}
      />

      <InviteMemberModal
        open={inviteOpen}
        teamId={selectedTeam?._id}
        onClose={() => setInviteOpen(false)}
      />
    </div>
  );
}

export default TeamsPage;