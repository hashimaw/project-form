import { NumberInput, ActionIcon, Pill, TextInput, Textarea, Center, Button, Modal, LoadingOverlay } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { IconEdit, IconX } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { productschema } from '../schemas/validationSchema';
import { zodResolver } from '@mantine/form';
import axios from 'axios';

interface Product {id:string, name: string; description: string; price: number; category: string; tags: string[]; use: string; minimumQuantity: number; sellingPrice: number; addedBy: string; expiresAt: Date; quantityOnHand: number; reservedQuantity: number; discount: number; imageUrls: string[];}
interface ProductProps { product: Product; }

export function EditProduct ({ product }: ProductProps) {

  const [opened, { open, close }] = useDisclosure(false);

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');
  const [imageInputValue, setImageInputValue] = useState<string>(''); 
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const queryClient = useQueryClient();

  useEffect(() => { if (product) { 
    setImageUrls(product.imageUrls)
    setTags(product.tags); 
} }, [product]);
  

  const form = useForm<Product>({
    mode: 'uncontrolled',
    initialValues: { 
        ...product,
        expiresAt: dayjs(product.expiresAt).toDate()
    },
    validate: zodResolver(productschema),
  });

  const editProduct = async (newPost: Product) => {
    try {
        const { data } = await axios.patch(`https://test-api.nova-techs.com/products/${product.id}`, newPost);
        return data; 
    } catch (error: any) {
      
        throw error.response?.data || new Error('Failed to update product');
    }
};

  const {mutate, isPending, error } = useMutation({
    mutationFn: (newPost: Product) => editProduct(newPost),
      onError:()=>{open()},
      onSuccess:() => {
        queryClient.invalidateQueries({queryKey: ["product"]});
        form.reset();
        setTags([]);
        close();
      }
  })

  const handleSubmit = (values: Product) => { mutate({ ...values }); };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      form.setFieldValue('tags', newTags);
      setTagInput('');
    }
  };
  
  const removeTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    form.setFieldValue('tags', newTags);
  };
  

  const addImageUrl = () => { 
    if (imageInputValue.trim() && !imageUrls.includes(imageInputValue.trim())) { 
        const newImageUrls = [...imageUrls, imageInputValue.trim()]; 
        setImageUrls(newImageUrls); 
        form.setFieldValue('imageUrls', newImageUrls); 
        setImageInputValue(''); 
    } }; 
    const removeImageUrl = (url: string) => { 
        const newImageUrls = imageUrls.filter((imgUrl) => imgUrl !== url); 
        setImageUrls(newImageUrls); 
        form.setFieldValue('imageUrls', newImageUrls);
    };
    return (
      <>
  <Button onClick={open} leftSection={<IconEdit/>} type='submit' variant="outline">Edit</Button>
      <Modal opened={opened} size='auto' onClose={close} title="Add Product Form" centered>
        
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <LoadingOverlay visible={isPending} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }}>
          </LoadingOverlay>
          {error&&<div className='text-center text-red-400'>{error.message}</div>}

          <div className='flex gap-5 mb-3'>
            <TextInput mb={7}
              label="Product Name"
              placeholder="nike shoes"
              key={form.key('name')}
              {...form.getInputProps('name')}
              /> 
              <Textarea mb={7}
                label="description"
                w={200}
                placeholder="product description"
                key={form.key('description')}
              {...form.getInputProps('description')}
              />
              <NumberInput mb={7}
                label="Price"
                placeholder="price"
                prefix="$"
                key={form.key('price')}
                {...form.getInputProps('price')}
            />

            <div >
              <TextInput
                label="Tags"
                placeholder="Enter tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.currentTarget.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Tab') {
                    e.preventDefault();
                    addTag();
                    }
                }}
                error={form.errors.tags}
                />
            <div className='max-w-44'> 
            {tags.map((tag) => ( 
                <Pill key={tag} onRemove={() => removeTag(tag)}> {tag} 
                <ActionIcon size="xs" ml={2} onClick={() => removeTag(tag)}> 
                    <IconX size={10} /> 
                </ActionIcon> 
                </Pill> ))} 
            </div>
            </div>
         ` 
          </div>
         
          <div className='flex gap-5 mb-3'>
            <TextInput mb={7}
                label="Category"
                placeholder="Electronics"
                key={form.key('category')}
                {...form.getInputProps('category')}
                />
            <TextInput mb={7}
                w={200}
                label="Use"
                placeholder="use of the product"
                key={form.key('use')}
                {...form.getInputProps('use')}
                />
            <NumberInput mb={7}
                label="Selling Price"
                placeholder="Selling price"
                prefix="$"
                key={form.key('sellingPrice')}
                {...form.getInputProps('sellingPrice')}
                /> 
            <TextInput mb={7}
                label="Added By"
                placeholder="product created by"
                key={form.key('addedBy')}
                {...form.getInputProps('addedBy')}
                /> 
          </div>
        
        <div className='flex gap-5 mb-3'>
          <NumberInput mb={7}
            w={190}
            label="Available Quantity"
            placeholder="quantity"
            key={form.key('quantityOnHand')}
            {...form.getInputProps('quantityOnHand')}
            />
          <NumberInput mb={7}
            label="Minimum Quantity"
            placeholder="minimum Quantity"
            key={form.key('minimumQuantity')}
            {...form.getInputProps('minimumQuantity')}
            />
          <DateInput
            w={200}
            label="Expiration Date"
            placeholder="Expiration Date"
            key={form.key('expiresAt')}
            {...form.getInputProps('expiresAt')}
            />

          <div>
            <TextInput 
              label="Image URLs" 
              placeholder="Enter image URL" 
              value={imageInputValue} 
              onChange={(e) => setImageInputValue(e.currentTarget.value)} 
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Tab') 
                  { e.preventDefault(); addImageUrl(); } }} 
                  error={form.errors.imageUrls}
              /> 
              <div className='max-w-44'> 
                  {imageUrls.map((url) => ( 
                      <Pill w={200} key={url}>
                      <ActionIcon size="xs" onClick={() => removeImageUrl(url)}> 
                          <IconX size={10} /> 
                      </ActionIcon>  
                      {url} 
                  </Pill> ))} 
              </div>
            </div>
        
        </div>
         

          <Center mt={20}> <Button type='submit' variant="filled">Edit Product</Button></Center>
             
        </form>
      </Modal>
   
      </>
    )
}