import type { Restaurant, Dish } from "../lib/data.ts";
import { escapeHtml } from "../lib/data.ts";

// ─── Rating helpers ────────────────────────────────────────────────────────────

export function getRatingClass(score: number): string {
  if (score <= 4) return "badge-low";
  if (score <= 7) return "badge-mid";
  return "badge-high";
}

export function getRatingBadgeHTML(score: number | null): string {
  if (score === null) return `<span class="rating-badge badge-empty"><i class="bi bi-star"></i></span>`;
  const cls = getRatingClass(score);
  return `<span class="rating-badge ${cls}"><span class="rating-num">${score}</span></span>`;
}

// ─── HTML renderers ────────────────────────────────────────────────────────────

export function renderRestaurantCard(
  r: Restaurant,
  avg: number | null,
  dishCount: number
): string {
  const badge = getRatingBadgeHTML(avg);
  const dishPill = r.status === "visited"
    ? `<span class="dish-count-pill"><i class="bi bi-journal-text"></i> ${dishCount} ${dishCount === 1 ? "plato" : "platos"}</span>`
    : `<span class="pending-tag"><i class="bi bi-bookmark"></i> Pendiente</span>`;

  return `
    <article class="restaurant-card card-clickable" data-href="/restaurante?id=${r.id}" style="view-transition-name: restaurant-${r.id}">
      <div class="card-body">
        <h3>${escapeHtml(r.name)}</h3>
        ${dishPill}
      </div>
      ${badge}
    </article>
  `;
}

export function renderDishCard(d: Dish): string {
  const badge = getRatingBadgeHTML(d.rating);
  return `
    <article class="dish-card" data-id="${d.id}">
      <div class="dish-info">
        <h4>${escapeHtml(d.name)}</h4>
        ${d.notes ? `<p class="dish-notes">${escapeHtml(d.notes)}</p>` : ""}
      </div>
      <div class="dish-actions">
        ${badge}
        <button class="btn-edit-dish boton2" data-id="${d.id}">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn-delete-dish boton2" data-id="${d.id}">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </article>
  `;
}

// ─── Event bus ─────────────────────────────────────────────────────────────────

type AppEvent =
  | "restaurant:created"
  | "restaurant:updated"
  | "restaurant:deleted"
  | "restaurant:visited"
  | "dish:created"
  | "dish:updated"
  | "dish:deleted";

export function emit(event: AppEvent, detail?: unknown): void {
  document.dispatchEvent(new CustomEvent(event, { detail }));
}

export function on(
  event: AppEvent,
  handler: (e: CustomEvent) => void
): void {
  document.addEventListener(event, handler as EventListener);
}
