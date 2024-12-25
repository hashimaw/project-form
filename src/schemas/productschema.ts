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