import { z } from 'zod';

  export const productschema = z.object({
        name: z.string().min(2, { message: 'Name should have at least 2 letters' }),
        price: z.number().min(1, { message: "price can not be less than 1" }),
        category: z.string().min(1,{ message: "Please write the category" }),
        tags: z.array(z.string().nonempty({ message: "tags cannot be empty" })).min(1, { message: "At least one tag is required" }),
        use: z.string().min(1, { message: "use must be specified" }),
        addedBy: z.string().min(2, { message: 'Name should have at least 2 letters' }),
        quantityOnHand: z.number().min(1, { message: "quantity can not be less than 1" }),
        imageUrls: z.array(z.string().nonempty({ message: "URL cannot be empty" })).min(1, { message: "At least one image URL is required" }),
      });

  export const paymentSchema = z.object({
    selectedPayments: z.array(
      z.object({
        bank: z.string().min(1, "Bank name is required"),
        accountNumber: z.string().min(5, "Account number must be at least 5 digits"),
        amount: z.number().min(1, "Amount must be greater thatn 1"),
        date: z.coerce.date({ invalid_type_error: "Invalid date format" })
      })
    ).nonempty("At least one payment item is required")
        
      });

      export const orderedItemSchema = z.object({
        orderdItems: z.array(
          z.object({
            id: z.string().min(1, "Item ID is required"),
            quantity: z.number().int().min(1, "Quantity must be at least 1"),
            sellingPrice: z.number().min(1, "Selling price cannot be less than 1")
          })
        ).nonempty("At least one ordered item is required")
      });
      
  export const salesSchema = z.object({
        merchant: z.string().min(1, "Merchant name is required"),
        orderdItems: z.array(orderedItemSchema).nonempty("At least one ordered item is required"),
        payments: z.array(paymentSchema).nonempty("At least one payment is required")
      });
      
      export const merchantSchema = z.object({
        name: z.string().min(1, "Name is required"),
        address: z.string().min(1, "Address is required"),
        phone: z.any().transform((val) => {
          // Convert to string and remove non-digits
          const sanitized = String(val).replace(/\D+/g, '');
          return sanitized;
        })
        .refine((val) => val.length >= 10 && val.length <= 15, {
          message: 'Phone number must be between 10 and 15 digits',
        })
      });
      