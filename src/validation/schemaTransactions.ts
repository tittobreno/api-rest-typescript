import z from "zod";

export const bodyNewTransaction = z.object({
  description: z.string({ required_error: "Description is required" }),
  value: z.number({ required_error: "Value is required" }),
  type: z.string({ required_error: "Type is required" }),
  date: z.string({ required_error: "Date is required" }),
  category_id: z.number({ required_error: "Category id is required" }),
});

export const schemaDetailTransaction = z.object({
  id: z.string({ required_error: "ID is required" }),
});
