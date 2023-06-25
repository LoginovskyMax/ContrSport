
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
 

export const delEvent = async (id: number) =>
  fetch(`${BACKEND_URL}/events/delete?id=${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getUserToken()}`,
    }
  }).then((response) => response.json());

export const confirmEvent = async (id:number) =>
  fetch(`${BACKEND_URL}/events/confirm?id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getUserToken()}`,
    },
  }).then((response) => response.json());

export const getOneEvent = async (id: number) =>
  fetch(`${BACKEND_URL}/events/item?id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getUserToken()}`,
    },
  }).then((response) => response.json());

  export const payForEvent = async (id: number|string, price:number|string) =>
  fetch(`${BACKEND_URL}/events/confirm?id=${id}&price${price}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getUserToken()}`,
    },
  }).then((response) => response.json());
