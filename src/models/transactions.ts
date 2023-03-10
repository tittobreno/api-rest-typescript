export interface TransactionModel {
  id: number;
  description: string;
  value: number;
  type: string;
  date: Date;
  category_id: number;
  category_name?: string;
  user_id: number;
}
