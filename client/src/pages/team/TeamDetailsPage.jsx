import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTeamById, removeMember } from "../../services/teamService";
import TeamSettingsModal from "../../components/team/TeamSettingsModal";

function TeamDetailsPage() {
  const { id } = useParams();

  const [team, setTeam] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const data = await getTeamById(id);
      setTeam(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await removeMember(team._id, userId);
      fetchTeam();
    } catch (error) {
      alert(error.response?.data?.message || "Error removing member");
    }
  };

  if (!team) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold">Loading Team...</h2>
      </div>
    );
  }

  // Filter out the owner to list regular members in the timeline
  const regularMembers = team.members.filter((m) => m._id !== team.owner._id);

  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      
      {/* Top Navigation Row */}
      <div className="flex justify-between items-center mb-6">
        <Link 
          to="/teams" 
          className="text-slate-500 hover:text-blue-600 font-semibold flex items-center gap-2 transition-colors"
        >
          ← Back to Teams
        </Link>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 shadow-xl flex justify-between items-start">
        <div className="flex gap-5">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-5xl font-bold text-white">
            {team.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-5xl font-bold text-white">
              {team.name}
            </h1>
            <p className="text-white/80 mt-2">
              {team.description}
            </p>
            <div className="flex gap-6 mt-5 text-white/90">
              <span>
                👑 {team.owner.name}
              </span>
              <span>
                📅 {new Date(team.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setSettingsOpen(true)}
          className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 transition-all"
        >
          ⚙ Team Settings
        </button>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <h2 className="text-5xl font-bold text-blue-600">
            {team.members.length}
          </h2>
          <p className="mt-2 text-slate-500">
            Members
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <h2 className="text-5xl font-bold text-yellow-500">
            {team.pendingInvites.length}
          </h2>
          <p className="mt-2 text-slate-500">
            Pending
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <h2 className="text-5xl font-bold text-green-600">
            Active
          </h2>
          <p className="mt-2 text-slate-500">
            Status
          </p>
        </div>
      </div>

      {/* Two Column Layout: Members & Timeline */}
      <div className="grid lg:grid-cols-5 gap-8 mt-8">
        
        {/* Left Column - Members */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">
                Members
              </h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition-all font-semibold">
                + Invite Member
              </button>
            </div>

            <div>
              {team.members.map((member) => (
                <div 
                  key={member._id} 
                  className="flex items-center justify-between bg-slate-50 hover:bg-slate-100 rounded-2xl p-5 mb-4 transition-all"
                >
                  <div className="flex gap-4">
                    <div className="h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {member.name}
                      </h3>
                      <p className="text-slate-500">
                        {member.email}
                      </p>
                    </div>
                  </div>

                  {/* Right side */}
                  {member._id === team.owner._id ? (
                    <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold">
                      👑 Owner
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRemoveMember(member._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl transition-all font-semibold"
                    >
                      ❌ Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Timeline */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-lg p-6 h-full">
            <h2 className="text-3xl font-bold mb-6">
              Activity Timeline
            </h2>

            <div className="mt-4">
              {/* Event: Team Created */}
              <div className="flex gap-4 mb-2">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <div className="w-1 h-12 bg-green-300"></div>
                </div>
                <div>
                  <h4 className="font-semibold">Team Created</h4>
                  <p className="text-slate-500 text-sm">
                    {new Date(team.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Event: Owner Joined */}
              <div className="flex gap-4 mb-2">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  {regularMembers.length > 0 && <div className="w-1 h-12 bg-green-300"></div>}
                </div>
                <div>
                  <h4 className="font-semibold">Owner Joined</h4>
                  <p className="text-slate-500 text-sm">
                    {team.owner.name}
                  </p>
                </div>
              </div>

              {/* Event: Members Joined */}
              {regularMembers.map((member, index) => (
                <div key={member._id} className="flex gap-4 mb-2">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    {/* Only show line if it's not the last member */}
                    {index !== regularMembers.length - 1 && (
                      <div className="w-1 h-12 bg-green-300"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold">Member Joined</h4>
                    <p className="text-slate-500 text-sm">
                      {member.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pending Invitations */}
      <div className="mt-8">
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-3xl font-bold mb-6">
            Pending Invitations
          </h2>

          {team.pendingInvites.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-3xl p-8 text-center">
              <h3 className="text-2xl font-bold text-green-700">
                ✅ No Pending Invitations
              </h3>
              <p className="text-green-600 mt-2">
                Everyone has responded.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {team.pendingInvites.map((user) => (
                <div
                  key={user._id}
                  className="bg-yellow-50 border border-yellow-300 rounded-2xl p-5 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-lg">{user.name}</p>
                    <p className="text-slate-600">{user.email}</p>
                  </div>
                  <span className="bg-yellow-200 text-yellow-800 px-5 py-2 rounded-full font-semibold">
                    ⏳ Pending
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      <TeamSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        team={team}
        refresh={fetchTeam}
      />
    </div>
  );
}

export default TeamDetailsPage;