export const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];
  
/** CSS string form of EASE_OUT for inline style transitions. */
 
/** Press feedback on buttons and other tappable surfaces. */
export const PRESS_SCALE = 0.97 as const;

 
/** Content swaps — label/icon slots trading places inside a control. */
 
/** Overlay panel entrances — modals and sheets summoned by pointer. */
 
/** Shared-layout glides — pills, indicators and panels morphing between positions. */
export const SPRING_LAYOUT = {
  type: "spring",
  stiffness: 360,
  damping: 32,
  mass: 0.6,
} as const;

/** Cursor-follow physics for decorative mouse tracking (magnetic, tilt, dock). */
 
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
 