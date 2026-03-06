/**
 * Shared move-state flags used by both PlayerController (keyboard)
 * and MobileControls (touch).  A plain object + ref avoids the overhead
 * of a reactive store for per-frame reads.
 */

export interface MoveFlags {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    run: boolean;
}

export const moveFlags: MoveFlags = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
    run: false,
};

/** Set a single movement flag (called by both keyboard and touch handlers). */
export function setMoveFlag(flag: keyof MoveFlags, value: boolean) {
    moveFlags[flag] = value;
}

/** Reset all flags to false (e.g. when overlays open). */
export function resetMoveFlags() {
    moveFlags.forward = false;
    moveFlags.backward = false;
    moveFlags.left = false;
    moveFlags.right = false;
    moveFlags.up = false;
    moveFlags.down = false;
    moveFlags.run = false;
}
