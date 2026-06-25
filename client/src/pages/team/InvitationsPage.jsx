import { useEffect, useState } from "react";
import { getMyInvitations, acceptInvitation, rejectInvitation } from "../../services/teamService";

function InvitationsPage() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const data = await getMyInvitations();
      setTeams(data);
    } catch (error) {
      console.error("Failed to fetch invitations:", error);
    }
  };

  const handleAccept = async (teamId) => {
    try {
      await acceptInvitation(teamId);
      fetchInvitations();
    } catch (error) {
      console.error("Failed to accept invitation:", error);
    }
  };

  const handleReject = async (teamId) => {
    try {
      await rejectInvitation(teamId);
      fetchInvitations();
    } catch (error) {
      console.error("Failed to reject invitation:", error);
    }
  };

  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">
        Team Invitations
      </h1>

      {teams.length === 0 ? (
        <p className="text-slate-500">You have no pending invitations.</p>
      ) : (
        <div className="space-y-6">
          {teams.map((team) => (
            <div
              key={team._id}
              className="bg-white rounded-3xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold">
                {team.name}
              </h2>

              <p className="text-slate-500 mt-2">
                Owner: {team.owner?.name}
              </p>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => handleAccept(team._id)}
                  className="bg-green-600 hover:bg-green-700 transition-colors text-white px-5 py-2 rounded-xl"
                >
                  Accept
                </button>

                <button
                  onClick={() => handleReject(team._id)}
                  className="bg-red-600 hover:bg-red-700 transition-colors text-white px-5 py-2 rounded-xl"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InvitationsPage;