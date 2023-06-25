import { create } from "zustand";

interface IPriceState {
  price: number;
  setPrice: (newPrice: number) => void;
}

const priceStore = create<IPriceState>((set) => ({
  price: 0,
  setPrice: (newPrice) => set({ price: newPrice }),
}));

export default priceStore;