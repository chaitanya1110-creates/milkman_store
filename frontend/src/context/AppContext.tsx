// src/context/AppContext.tsx
// ============================================================
// Global state management for Milkman
// ============================================================

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { Product, SubscriptionPlan } from "../data/mockData";

// ── Types ─────────────────────────────────────────────────────

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  is_subscribed: boolean;
  is_staff: boolean;
}

export interface CartItem {
  id: string;           // "product-{id}" or "sub-{id}"
  type: "product" | "subscription";
  name: string;
  price: number;
  qty: number;
  emoji?: string;
  subDetails?: SubscriptionPlan;
  productDetails?: Product;
}

export interface AppState {
  customer: Customer | null;
  token: string | null;
  cart: CartItem[];
  isAuthModalOpen: boolean;
  authMode: "login" | "register";
  notification: { message: string; type: "success" | "error" | "info" } | null;
}

type Action =
  | { type: "SET_CUSTOMER"; payload: { customer: Customer; token: string } }
  | { type: "LOGOUT" }
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_QTY"; payload: { id: string; qty: number } }
  | { type: "CLEAR_CART" }
  | { type: "OPEN_AUTH_MODAL"; payload: "login" | "register" }
  | { type: "CLOSE_AUTH_MODAL" }
  | { type: "SET_NOTIFICATION"; payload: AppState["notification"] }
  | { type: "CLEAR_NOTIFICATION" };

// ── Reducer ────────────────────────────────────────────────────

const initialState: AppState = {
  customer: null,
  token: null,
  cart: [],
  isAuthModalOpen: false,
  authMode: "login",
  notification: null,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_CUSTOMER":
      return {
        ...state,
        customer: action.payload.customer,
        token: action.payload.token,
        isAuthModalOpen: false,
      };

    case "LOGOUT":
      localStorage.removeItem("milkman_token");
      localStorage.removeItem("milkman_customer");
      return { ...state, customer: null, token: null, cart: [] };

    case "ADD_TO_CART": {
      const existing = state.cart.find((i) => i.id === action.payload.id);
      if (existing) {
        // For subscriptions allow only qty=1
        if (action.payload.type === "subscription") return state;
        return {
          ...state,
          cart: state.cart.map((i) =>
            i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { ...state, cart: [...state.cart, action.payload] };
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((i) => i.id !== action.payload),
      };

    case "UPDATE_QTY":
      return {
        ...state,
        cart: state.cart
          .map((i) =>
            i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i
          )
          .filter((i) => i.qty > 0),
      };

    case "CLEAR_CART":
      return { ...state, cart: [] };

    case "OPEN_AUTH_MODAL":
      return { ...state, isAuthModalOpen: true, authMode: action.payload };

    case "CLOSE_AUTH_MODAL":
      return { ...state, isAuthModalOpen: false };

    case "SET_NOTIFICATION":
      return { ...state, notification: action.payload };

    case "CLEAR_NOTIFICATION":
      return { ...state, notification: null };

    default:
      return state;
  }
}

// ── Context ────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  cartTotal: number;
  cartCount: number;
  addProduct: (p: Product) => void;
  addSubscription: (s: SubscriptionPlan) => void;
  notify: (message: string, type?: "success" | "error" | "info") => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

// ── Provider ───────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState, (init) => {
    // Rehydrate from localStorage on mount
    try {
      const token    = localStorage.getItem("milkman_token");
      const customer = localStorage.getItem("milkman_customer");
      if (token && customer) {
        return {
          ...init,
          token,
          customer: JSON.parse(customer),
        };
      }
    } catch {}
    return init;
  });

  // Persist auth to localStorage
  useEffect(() => {
    if (state.token && state.customer) {
      localStorage.setItem("milkman_token", state.token);
      localStorage.setItem("milkman_customer", JSON.stringify(state.customer));
    } else if (!state.token && !state.customer) {
      localStorage.removeItem("milkman_token");
      localStorage.removeItem("milkman_customer");
    }
  }, [state.token, state.customer]);

  // Auto-clear notifications
  useEffect(() => {
    if (state.notification) {
      const t = setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 3500);
      return () => clearTimeout(t);
    }
  }, [state.notification]);

  const cartTotal = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);

  const addProduct = (p: Product) => {
    dispatch({
      type   : "ADD_TO_CART",
      payload: {
        id    : `product-${p.id}`,
        type  : "product",
        name  : p.name,
        price : p.price,
        qty   : 1,
        emoji : p.image_url,
        productDetails: p,
      },
    });
    notify(`${p.name} added to cart!`, "success");
  };

  const addSubscription = (s: SubscriptionPlan) => {
    dispatch({
      type   : "ADD_TO_CART",
      payload: {
        id    : `sub-${s.id}`,
        type  : "subscription",
        name  : s.name,
        price : s.price,
        qty   : 1,
        subDetails: s,
      },
    });
    notify(`${s.name} subscription added!`, "success");
  };

  const notify = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    dispatch({ type: "SET_NOTIFICATION", payload: { message, type } });
  };

  return (
    <AppContext.Provider
      value={{ state, dispatch, cartTotal, cartCount, addProduct, addSubscription, notify }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
