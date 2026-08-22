export const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.77, 0, 0.175, 1];
export const EASE_DRAWER: [number, number, number, number] = [0.32, 0.72, 0, 1];

/** CSS string form of EASE_OUT for inline style transitions. */
export const EASE_OUT_CSS = "cubic-bezier(0.23, 1, 0.32, 1)";

/** Press feedback on buttons and other tappable surfaces. */
export const PRESS_SCALE = 0.97 as const;

export const SPRING_PRESS = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 0.6,
} as const;

/** Content swaps — label/icon slots trading places inside a control. */
export const SPRING_SWAP = {
  type: "spring",
  stiffness: 460,
  damping: 30,
  mass: 0.55,
} as const;

/** Overlay panel entrances — modals and sheets summoned by pointer. */
export const SPRING_PANEL = {
  type: "spring",
  stiffness: 420,
  damping: 40,
  mass: 0.5,
} as const;

/** Shared-layout glides — pills, indicators and panels morphing between positions. */
export const SPRING_LAYOUT = {
  type: "spring",
  stiffness: 360,
  damping: 32,
  mass: 0.6,
} as const;

/** Cursor-follow physics for decorative mouse tracking (magnetic, tilt, dock). */
export const SPRING_MOUSE = {
  stiffness: 200,
  damping: 15,
  mass: 0.3,
} as const;

/*
 * Apple fluid-interface presets (WWDC18 "Designing Fluid Interfaces"),
 * expressed as damping ratio (ζ) + response (τ, seconds), converted to
 * stiffness/damping at mass 1 via k = (2π/τ)², c = 2ζ·(2π/τ).
 * Default to ζ 1.0; reserve ζ < 1 for interactions that carried momentum.
 */

/** General move/reposition — critically damped, no overshoot (ζ 1.0, τ 0.4). */
export const SPRING_MOVE = {
  type: "spring",
  stiffness: 250,
  damping: 31.5,
  mass: 1,
} as const;

/** Rotation — slight life without wobble (ζ 0.8, τ 0.4). */
export const SPRING_ROTATE = {
  type: "spring",
  stiffness: 250,
  damping: 25,
  mass: 1,
} as const;

/** Drawer/sheet entrances — fast with gentle settle (ζ 0.8, τ 0.3). */
export const SPRING_SHEET = {
  type: "spring",
  stiffness: 440,
  damping: 33.5,
  mass: 1,
} as const;
