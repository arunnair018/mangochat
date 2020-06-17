import cookie from "js-cookie";
import axios from "axios";

const useHandleResponse = () => {
  const handleResponse = (response) => {
    return response.data;
  };

  return handleResponse;
};

export function useGetUsers() {
  const token = cookie.get("token"); // set token from cookie

  const handleResponse = useHandleResponse();

  const getUsers = () => {
    return axios(`/api/users`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${token}`,
      },
    })
      .then(handleResponse)
      .catch(() => console.log("Error loading users..."));
  };

  return getUsers;
}
