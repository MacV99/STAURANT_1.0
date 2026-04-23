import type { Restaurant, Dish } from "../lib/data.ts";
import { escapeHtml } from "../lib/data.ts";

// ─── Rating helpers ────────────────────────────────────────────────────────────

export function getRatingClass(score: number): string {
  if (score <= 4) return "badge-low";
  if (score <= 7) return "badge-mid";
  return "badge-high";
}

export function getRatingBadgeHTML(score: number | null): string {
  if (score === null) return `<span class="rating-badge badge-empty"><i class="bi bi-star-fill"></i></span>`;
  const cls = getRatingClass(score);
  return `<span class="rating-badge ${cls}"><span class="rating-num">${score}</span></span>`;
}

// ─── HTML renderers ────────────────────────────────────────────────────────────

/** Runtime renderer para inyección via innerHTML. Template canónico: src/components/RestaurantCard.astro */
export function renderRestaurantCard(
  r: Restaurant,
  avg: number | null,
  dishCount: number
): string {
  const badge = getRatingBadgeHTML(avg);
  const dishPill = r.status === "visited"
    ? `<span class="dish-count-pill"><i class="bi bi-journal-text"></i> ${dishCount} ${dishCount === 1 ? "plato" : "platos"}</span>`
    : `<span class="pending-tag"><i class="bi bi-bookmark-fill"></i> Pendiente</span>`;

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

export function renderDishCard(d: Dish, typeName?: string | null): string {
  const badge = getRatingBadgeHTML(d.rating);
  const typeTag = typeName
    ? `<span class="dish-type-tag">${escapeHtml(typeName)}</span>`
    : "";
  return `
    <article class="dish-card" data-id="${d.id}">
      <div class="dish-info">
        <h4>${escapeHtml(d.name)}</h4>
        ${typeTag}
        ${d.notes ? `<p class="dish-notes">${escapeHtml(d.notes)}</p>` : ""}
      </div>
      <div class="dish-actions">
        ${badge}
        <div class="dish-menu">
          <button class="btn-menu boton2" data-id="${d.id}">
            <i class="bi bi-three-dots-vertical"></i>
          </button>
          <div class="menu-popup">
            <button class="menu-item btn-edit-dish" data-id="${d.id}">
              <i class="bi bi-pencil-fill"></i>
              <span>Editar</span>
            </button>
            <button class="menu-item btn-delete-dish" data-id="${d.id}">
              <i class="bi bi-trash-fill"></i>
              <span>Eliminar</span>
            </button>
          </div>
        </div>
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
