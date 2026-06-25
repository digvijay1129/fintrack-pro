import { useState } from "react";
import { createTeam } from "../../services/teamService";

function CreateTeamModal({
  open,
  onClose,
  fetchTeams,
}) {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateTeam = async () => {
    try {
      await createTeam({
        name: teamName,
        description,
      });

      alert("Team Created");

      await fetchTeams();

      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  if (!open) return null;

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/50
        flex
        items-center
        justify-center
        z-50
      "
    >
      <div
        className="
          bg-white
          rounded-3xl
          w-full
          max-w-lg
          p-8
          shadow-2xl
        "
      >
        <h2
          className="
            text-3xl
            font-bold
            mb-6
          "
        >
          Create Team
        </h2>

        <input
          type="text"
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="
            w-full
            border
            rounded-xl
            p-4
            mb-4
          "
        />

        <textarea
          rows="4"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="
            w-full
            border
            rounded-xl
            p-4
          "
        />

        <div
          className="
            flex
            justify-end
            gap-4
            mt-8
          "
        >
          <button
            onClick={onClose}
            className="
              px-6
              py-3
              rounded-xl
              bg-slate-200
            "
          >
            Cancel
          </button>

          <button
            onClick={handleCreateTeam}
            className="
              px-6
              py-3
              rounded-xl
              bg-blue-600
              text-white
            "
          >
            Create Team
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateTeamModal;