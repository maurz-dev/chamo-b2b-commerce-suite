import type { Category } from "../types";
import rawCategories from "../data/categories.json";
import { simulateNetworkDelay } from "./api";

const categories = rawCategories as Category[];

export const categoryService = {
  async getAll(): Promise<Category[]> {
    return simulateNetworkDelay(categories);
  },

  async getById(id: string): Promise<Category | null> {
    const found = categories.find((c) => c.id === id) ?? null;
    return simulateNetworkDelay(found);
  },
};
