export interface Store {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  type: "PHYSICAL" | "ONLINE" | "HYBRID";
  active: boolean;
  createdAt: string;
  manager?: {
    firstName: string;
    lastName: string;
  };
}