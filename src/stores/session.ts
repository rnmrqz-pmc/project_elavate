

// ===============================
// Session Store (Pinia)
// ===============================
// This file contains the definition of the session store which is used to store information about the current user.
// The store is used to store the user's id, name, email and other relevant information in localStorage.
// The store is used by the entire application to get or set the user's information.
// ===============================


import { defineStore } from "pinia";

export interface User {
  id: number;
  name: string;
  email: string;
}

export const useSessionStore = defineStore("session", {
  state: () => <any>({
    user: JSON.parse(localStorage.getItem("user") || "null") as User | null,
    auth: localStorage.getItem("auth") || "null",
    auth_token: localStorage.getItem("auth_token") || "null",
  }),
  actions: {
    setUser(user: User) {
      this.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    
    logout() {
      this.user = null;
      this.details = null;
      this.auth = 'null'
      localStorage.removeItem("user");
      localStorage.removeItem("details");
      localStorage.removeItem("auth");
      localStorage.removeItem("auth_token");
    },
    getUser() {
      return this.user;
    },

  },
});
