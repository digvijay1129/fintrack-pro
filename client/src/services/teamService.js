import axios from "axios";

const API_URL = "http://localhost:5000/api/teams";

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const createTeam = async (teamData) => {
  const response = await axios.post(
    `${API_URL}`,
    teamData,
    getConfig()
  );
  return response.data;
};

export const getTeams = async () => {
  const response = await axios.get(
    API_URL, 
    getConfig()
  );
  return response.data;
};

export const inviteMember = async (teamId, email) => {
  const response = await axios.post(
    `${API_URL}/${teamId}/invite`,
    { email },
    getConfig()
  );
  return response.data;
};

export const getTeamById = async (id) => {
  const response = await axios.get(
    `${API_URL}/${id}`, 
    getConfig()
  );
  return response.data;
};

export const updateTeam = async (id, teamData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    teamData,
    getConfig()
  );
  return response.data;
};

export const deleteTeam = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`, 
    getConfig()
  );
  return response.data;
};

// --- New Invitation Methods ---

export const getMyInvitations = async () => {
  const response = await axios.get(
    `${API_URL}/my-invitations`,
    getConfig()
  );
  return response.data;
};

export const acceptInvitation = async (teamId) => {
  const response = await axios.post(
    `${API_URL}/${teamId}/accept`,
    {},
    getConfig()
  );
  return response.data;
};

export const rejectInvitation = async (teamId) => {
  const response = await axios.post(
    `${API_URL}/${teamId}/reject`,
    {},
    getConfig()
  );
  return response.data;
};

export const removeMember=
async(
teamId,
userId
)=>{

const response=
await axios.delete(

`${API_URL}/${teamId}/members/${userId}`,

getConfig()

);

return response.data;

};