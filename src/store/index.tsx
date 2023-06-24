import { create } from "zustand";

export type userSetter = (user: {
  firstName: string | null;
  email: string | null;
  image?: string;
  lastName: string | null;
  telegram: string | null;
  password: string | null;
}) => void;

interface UsersState {
  firstName: string | null;
  image?: string;
  lastName: string | null;
  telegram: string | null;
  password: string | null;
  email: string | null;
  setUser: userSetter;
  fetched: boolean;
}

const useUserStore = create<UsersState>((set) => ({
  firstName: null,
  email: null,
  fetched: false,
  lastName: null,
  telegram: null,
  password: null,
  setUser: (newUser) => set(() => newUser),
}));

export const nullUser = {
  firstName: null,
  lastName: null,
  telegram: null,
  password: null,
  email: null,
  fetched: true,
};

export default useUserStore;
