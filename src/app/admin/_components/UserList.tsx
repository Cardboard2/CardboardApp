export interface UserListInterface {
  name: string;
  id: string;
  email: string;
  role: string;
  usage: {
    userUsage: number;
    totalStorage: number;
  };
  tierId: string;
  tierExpiry: Date | null;
}
