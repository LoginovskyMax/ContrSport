
import { ADD_EVENT, BACKEND_URL, USER_PATH , EventData, EventDataResp} from "../data/authData";


import { getUserToken } from "./Auth";


export const addEvent = async (data:EventDataResp) =>
  fetch(`${BACKEND_URL}${ADD_EVENT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getUserToken()}`,
    },
    body: JSON.stringify(data),
  }).then<EventData>((response) => response.json());

export const findUser = async (name: string) => {
  const path = `${USER_PATH}/?q=${name}`
  return fetch(`${BACKEND_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getUserToken()}`,
    },
  }).then((response) => response.json());
};

export const getEvents = async () => {
  return  fetch(`${BACKEND_URL}/events/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getUserToken()}`,
    },
  }).then<EventData[]>((response) => response.json());

}
 

// export const banUser = async (userName: string) =>
//   fetch(`${BACKEND_URL}${USER_PATH}/ban?userName=${userName}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getUserToken()}`,
//     },
//   });

// export const unbanUser = async (userName: string) =>
//   fetch(`${BACKEND_URL}${USER_PATH}/unban?userName=${userName}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getUserToken()}`,
//     },
//   });

// export const deleteUser = async (name: string) =>
//   fetch(`${BACKEND_URL}${USER_PATH}`, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getUserToken()}`,
//     },
//     body: JSON.stringify({ userName: name }),
//   }).then((response) => response.json());
