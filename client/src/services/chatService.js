import cookie from "js-cookie";
import axios from "axios";

const useHandleResponse = () => {
  const handleResponse = (response) => {
    return response.data;
  };

  return handleResponse;
};

// Get list of users conversations
export function useGetConversations() {
  const token = cookie.get("token"); // set token from cookie
  const handleResponse = useHandleResponse();
  const getConversations = () => {
    return axios(`/api/conversations`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${token}`,
      },
    })
      .then(handleResponse)
      .catch((err) => {
        console.log(err);
      });
  };

  return getConversations;
}

// get conversation messages based on
// to and from id's
export function useGetConversationMessages() {
  const handleResponse = useHandleResponse();
  const token = cookie.get("token"); // set token from cookie
  const getConversationMessages = (id) => {
    return axios(`/api/conversations/query?userId=${id}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${token}`,
      },
    })
      .then(handleResponse)
      .catch((err) => {
        console.log(err);
      });
  };

  return getConversationMessages;
}

// send conversation messages based on
// to and from id's
export function useSendConversationMessage() {
  const handleResponse = useHandleResponse();
  const token = cookie.get("token"); // set token from cookie
  const sendConversationMessage = (id, body) => {
    return axios(`/api/messages/`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${token}`,
      },
      data: { to: id, body: body },
    })
      .then(handleResponse)
      .catch((err) => {
        console.log(err);
      });
  };

  return sendConversationMessage;
}

// Receive global messages
export function useGetGlobalMessages() {
  const token = cookie.get("token"); // set token from cookie
  const handleResponse = useHandleResponse();
  const getGlobalMessages = () => {
    return axios(`/api/global`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${token}`,
      },
    })
      .then(handleResponse)
      .catch((err) => {
        console.log(err);
      });
  };

  return getGlobalMessages;
}

// Send a global message
export function useSendGlobalMessage() {
  const token = cookie.get("token"); // set token from cookie
  const handleResponse = useHandleResponse();
  const sendGlobalMessage = (body) => {
    return axios(`/api/global`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${token}`,
      },
      data: { body: body, global: true },
    })
      .then(handleResponse)
      .catch((err) => {
        console.log(err);
      });
  };

  return sendGlobalMessage;
}
