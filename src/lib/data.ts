// ─── Interfaces ────────────────────────────────────────────────────────────────

export interface Restaurant {
  id: string;
  name: string;
  status: "visited" | "pending";
  notes: string;
  createdAt: string;
}

export interface Dish {
  id: string;
  restaurantId: string;
  name: string;
  rating: number; // 1–10
  notes: string;
  createdAt: string;
}

// ─── Storage keys ──────────────────────────────────────────────────────────────

const KEYS = {
  restaurants: "staurant_restaurants",
  dishes: "staurant_dishes",
} as const;

// ─── Helpers ───────────────────────────────────────────────────────────────────

function generateId(): string {
  return crypto.randomUUID();
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ─── Restaurants ───────────────────────────────────────────────────────────────

export function getRestaurants(): Restaurant[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.restaurants) ?? "[]");
  } catch {
    return [];
  }
}

function saveRestaurants(list: Restaurant[]): void {
  localStorage.setItem(KEYS.restaurants, JSON.stringify(list));
}

export function createRestaurant(
  data: Omit<Restaurant, "id" | "createdAt">
): Restaurant {
  const restaurant: Restaurant = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  saveRestaurants([...getRestaurants(), restaurant]);
  return restaurant;
}

export function updateRestaurant(
  id: string,
  data: Partial<Omit<Restaurant, "id" | "createdAt">>
): Restaurant | null {
  const all = getRestaurants();
  const idx = all.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...data };
  saveRestaurants(all);
  return all[idx];
}

export function deleteRestaurant(id: string): void {
  saveRestaurants(getRestaurants().filter((r) => r.id !== id));
  saveDishes(getDishes().filter((d) => d.restaurantId !== id));
}

export function markAsVisited(id: string): Restaurant | null {
  return updateRestaurant(id, { status: "visited" });
}

// ─── Dishes ────────────────────────────────────────────────────────────────────

export function getDishes(): Dish[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.dishes) ?? "[]");
  } catch {
    return [];
  }
}

function saveDishes(list: Dish[]): void {
  localStorage.setItem(KEYS.dishes, JSON.stringify(list));
}

export function getDishesByRestaurant(restaurantId: string): Dish[] {
  return getDishes().filter((d) => d.restaurantId === restaurantId);
}

export function createDish(data: Omit<Dish, "id" | "createdAt">): Dish {
  const dish: Dish = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  saveDishes([...getDishes(), dish]);
  return dish;
}

export function updateDish(
  id: string,
  data: Partial<Omit<Dish, "id" | "createdAt">>
): Dish | null {
  const all = getDishes();
  const idx = all.findIndex((d) => d.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...data };
  saveDishes(all);
  return all[idx];
}

export function deleteDish(id: string): void {
  saveDishes(getDishes().filter((d) => d.id !== id));
}

// ─── Derived ───────────────────────────────────────────────────────────────────

export function getRestaurantAverage(restaurantId: string): number | null {
  const dishes = getDishesByRestaurant(restaurantId);
  if (dishes.length === 0) return null;
  const sum = dishes.reduce((acc, d) => acc + d.rating, 0);
  return Math.round((sum / dishes.length) * 10) / 10;
}
