export const BACKEND_URL = "https://api.contr-sport.online";

export const BACKEND_LOGIN_PATH = "/auth/login/";

export const BACKEND_MYUSER_PATH = "/auth/me/";

export const BACKEND_REG_PATH = "/auth/registration";

export const BACKEND_FORGOT_PATH = "/auth/forgotpass/";

export const BACKEND_SETPASS_PATH = "/auth/setpass/";

export const COOKIE_TOKEN_VAL = "userToken";

export const FETCH_ERROR = "Failed to fetch";

export const FETCH_CORRECT_ERROR = "Too frequent requests";

export const ADD_EVENT = "/events/create";

export const USER_PATH = "/auth/user";

export interface Values {
  email: string;
  password: string;
}

export interface UserData {
  _id: string;
  image?: string;
  firstName: string;
  lastName: string;
  telegram: string;
  gender: string;
  countryCode: string;
  phone: string;
  email: string;
  password: string;
  id?:number
}

export interface TokenData {
  token: string;
}

export interface NewUserData {
  id?:number;
  firstName: string;
  lastName: string;
  telegram: string;
  gender: string;
  countryCode: string;
  phone: string;
  email: string;
  password: string;
  confirmed?:boolean;
}

export interface ForgotUserData {
  firstName?: string;
  email?: string;
}

export interface MessageData {
  message: string;
}

export interface NewPassData {
  resetToken: string;
  password: string;
}

export interface ChangePassData {
  password: string;
  newPassword: string;
}

interface expenditure {
  name:string;
  price:number;
}

export interface EventData {
  address: string;
  date: string;
  place: string;
  price?: number;
  priceForPersone?:number;
  expenditure:expenditure[]
  team:NewUserData[]
  id:number;
}
export interface EventDataResp {
  address: string;
  date: string;
  place: string;
  price?: number;
  priceForPersone?:number;
  expenditure:expenditure[]
  team:string[]
}

export interface CardData {
  firstName: string;
  lastName: string;
  CVV: number;
  date: string;
  cardNumber: number;
}

