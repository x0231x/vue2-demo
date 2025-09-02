import { User, Role } from "@/types/user";

export const users: User[] = [
  { id: 1, name: "Alice Chen", email: "alice@example.com", role: "Admin" },
  { id: 2, name: "Bob Wang", email: "bob@example.com", role: "User" },
  { id: 3, name: "Cindy Lin", email: "cindy@example.com", role: "User" },
];

export const roles: Role[] = ["Admin", "User"];
