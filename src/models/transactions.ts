export interface TransactionModel {
  description: string;
  value: number;
  type: string;
  date: Date;
  category_id: number;
  user_id: number;
}
