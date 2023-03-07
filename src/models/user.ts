export interface UserModel {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface TransactionModel {
  description: string;
  value: number;
  date: Date;
  category_id: number;
  user_id: number;
  type: string;
}
