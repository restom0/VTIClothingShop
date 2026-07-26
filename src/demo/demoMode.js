import { useCallback, useSyncExternalStore } from "react";
import { STORAGE_KEYS } from "../constants/storage.constant";
import { DEMO_CART, DEMO_USER_PROFILE } from "../mocks/demo_data.mock";

export const DEMO_MODE_EVENT = "vti-shop-demo-mode-change";

const DEMO_MODE_VALUE = "enabled";
const DEMO_SESSION_KEYS = [
  STORAGE_KEYS.TOKEN,
  STORAGE_KEYS.NAME,
  STORAGE_KEYS.AVATAR,
  STORAGE_KEYS.ORDER_ID,
];
const DEMO_SESSION = {
  [STORAGE_KEYS.TOKEN]: "demo-token",
  [STORAGE_KEYS.NAME]: DEMO_USER_PROFILE.name,
  [STORAGE_KEYS.AVATAR]: DEMO_USER_PROFILE.avatar_url,
  [STORAGE_KEYS.ORDER_ID]: String(DEMO_CART.id),
};

/** Gets browser storage when available. */
const getStorage = () => {
  if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
  return globalThis.localStorage;
};

/** Emits demo mode change. */
const emitDemoModeChange = (enabled) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(DEMO_MODE_EVENT, { detail: { enabled } }));
};

/** Reads saved session backup. */
const readSessionBackup = (storage) => {
  try {
    return JSON.parse(storage.getItem(STORAGE_KEYS.DEMO_SESSION_BACKUP));
  } catch {
    return null;
  }
};

/** Saves current auth/cart session before demo session replaces it. */
const saveSessionBackup = (storage) => {
  if (storage.getItem(STORAGE_KEYS.DEMO_SESSION_BACKUP)) return;

  const snapshot = Object.fromEntries(DEMO_SESSION_KEYS.map((key) => [key, storage.getItem(key)]));
  storage.setItem(STORAGE_KEYS.DEMO_SESSION_BACKUP, JSON.stringify(snapshot));
};

/** Applies demo auth/cart session. */
const applyDemoSession = (storage) => {
  Object.entries(DEMO_SESSION).forEach(([key, value]) => storage.setItem(key, value));
};

/** Restores auth/cart session that existed before demo mode. */
const restoreSessionBackup = (storage) => {
  const backup = readSessionBackup(storage);

  if (!backup) {
    DEMO_SESSION_KEYS.forEach((key) => {
      if (storage.getItem(key) === DEMO_SESSION[key]) storage.removeItem(key);
    });
    return;
  }

  DEMO_SESSION_KEYS.forEach((key) => {
    if (backup[key] === null) {
      storage.removeItem(key);
      return;
    }

    storage.setItem(key, backup[key]);
  });
  storage.removeItem(STORAGE_KEYS.DEMO_SESSION_BACKUP);
};

/** Checks whether demo mode enabled. */
export const isDemoModeEnabled = (storage = getStorage()) =>
  storage?.getItem(STORAGE_KEYS.DEMO_MODE) === DEMO_MODE_VALUE;

/** Sets demo mode enabled state. */
export const setDemoModeEnabled = (enabled, storage = getStorage()) => {
  if (!storage) return false;

  if (enabled) {
    saveSessionBackup(storage);
    storage.setItem(STORAGE_KEYS.DEMO_MODE, DEMO_MODE_VALUE);
    applyDemoSession(storage);
  } else {
    storage.removeItem(STORAGE_KEYS.DEMO_MODE);
    restoreSessionBackup(storage);
  }

  emitDemoModeChange(enabled);
  return enabled;
};

/** Subscribes to demo mode changes. */
const subscribeToDemoMode = (listener) => {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(DEMO_MODE_EVENT, listener);
  window.addEventListener("storage", listener);

  return () => {
    window.removeEventListener(DEMO_MODE_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
};

/** Gets demo mode snapshot. */
const getDemoModeSnapshot = () => isDemoModeEnabled();

/** Uses demo mode state. */
export const useDemoMode = () => {
  const enabled = useSyncExternalStore(subscribeToDemoMode, getDemoModeSnapshot, () => false);
  const setEnabled = useCallback((nextEnabled) => setDemoModeEnabled(nextEnabled), []);

  return [enabled, setEnabled];
};
