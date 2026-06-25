import { useState } from "react";
import { inviteMember } from "../../services/teamService";

function InviteMemberModal({
  open,
  onClose,
  teamId,
}) {

  const [email, setEmail] = useState("");

  if (!open) return null;

  const handleInvite = async () => {
    try {

      await inviteMember(
        teamId,
        email
      );

      alert("Invitation Sent");

      setEmail("");

      onClose();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Failed"
      );

    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-lg">

        <h2 className="text-3xl font-bold mb-6">
          Invite Member
        </h2>

        <input
          type="email"
          placeholder="Enter email..."
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full border rounded-xl p-4"
        />

        <div className="flex justify-end gap-4 mt-8">

          <button
            onClick={onClose}
            className="bg-slate-200 px-6 py-3 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={handleInvite}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            Invite
          </button>

        </div>

      </div>

    </div>
  );
}

export default InviteMemberModal;