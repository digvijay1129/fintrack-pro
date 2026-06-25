import { useState } from "react";
import { updateTeam, deleteTeam } from "../../services/teamService";
import { useNavigate } from "react-router-dom";

function TeamSettingsModal({
  open,
  onClose,
  team,
  refresh,
}) {
  const navigate = useNavigate();

  const [name, setName] = useState(team?.name || "");
  const [description, setDescription] = useState(team?.description || "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!open) return null;

  const handleSave = async () => {
    try {
      await updateTeam(team._id, {
        name,
        description,
      });

      await refresh();
      onClose();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTeam(team._id);
      await refresh();
      setShowDeleteConfirm(false);
      onClose();
      navigate("/teams");
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8">
          <h2 className="text-3xl font-bold mb-6">
            ⚙ Team Settings
          </h2>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-xl p-4 mb-4"
            placeholder="Team Name"
          />

          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-xl p-4"
            placeholder="Team Description"
          />

          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>

          {/* Delete Section */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="
                w-full
                bg-red-600
                hover:bg-red-700
                text-white
                py-3
                rounded-xl
                transition-all
              "
            >
              🗑 Delete Team
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="
            fixed
            inset-0
            bg-black/60
            flex
            items-center
            justify-center
            z-[60]
          "
        >
          <div
            className="
              bg-white
              rounded-3xl
              shadow-2xl
              p-8
              w-full
              max-w-md
              animate-fadeIn
            "
          >
            <h2
              className="
                text-2xl
                font-bold
                text-red-600
                mb-4
              "
            >
              ⚠ Delete Team?
            </h2>

            <p
              className="
                text-slate-600
                leading-7
                mb-8
              "
            >
              This action cannot be undone.
              <br /><br />
              All team members,
              pending invitations,
              and future shared activities
              will permanently lose access to this team.
            </p>

            <div
              className="
                flex
                justify-end
                gap-4
              "
            >
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="
                  px-6
                  py-3
                  rounded-xl
                  bg-slate-200
                  hover:bg-slate-300
                  transition-all
                "
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="
                  px-6
                  py-3
                  rounded-xl
                  bg-red-600
                  hover:bg-red-700
                  text-white
                  transition-all
                "
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TeamSettingsModal;