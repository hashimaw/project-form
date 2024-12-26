import { TextInput, Center, Button, Modal, LoadingOverlay } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { IconTrash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Product {id:string, name: string; description: string; price: number; category: string; tags: string[]; use: string; minimumQuantity: number; sellingPrice: number; addedBy: string; expiresAt: Date; quantityOnHand: number; reservedQuantity: number; discount: number; imageUrls: string[];}
interface ProductProps { product: Product; }

export function DeleteProduct ({ product }: ProductProps) {

  const [opened, { open, close }] = useDisclosure(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { deleteItem: ""},
    validate: {
        deleteItem: (value) => (value == 'Delete Product' ? null : 'pleace Write Delete Product to Confirm'),
    },
  });

  const deleteProduct = async () => {
    try {
        const { data } = await axios.delete(`https://test-api.nova-techs.com/products/${product.id}`);
        return data; 
    } catch (error: any) {
      
        throw error.response?.data || new Error('Failed to update product');
    }
};

  const {mutate, isPending, error } = useMutation({
    mutationFn: () => deleteProduct(),
      onError:()=>{open()},
      onSuccess:() => {
        queryClient.invalidateQueries({queryKey: ["product"]});
        form.reset();
        close();
        navigate('/');
      }
  })

  const handleSubmit = () => { mutate(); };

    return (
      <>
  <Button onClick={open} leftSection={<IconTrash/>} variant="outline"> Delete </Button>
      <Modal opened={opened} onClose={close} title={`You are about to delete:  '${product.name}' `} centered>
        
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <LoadingOverlay visible={isPending} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }}>
          </LoadingOverlay>
          {error&&<div className='text-center text-red-400'>{error.message}</div>}
          <TextInput mb={7}
          label="Please Write 'Delete Product' to confirm"
          placeholder=""
          key={form.key('deleteItem')}
          {...form.getInputProps('deleteItem')}
          /> 
          <Center mt={20}> <Button type='submit' variant="filled">Delete Product</Button></Center>
             
        </form>
      </Modal>
   
      </>
    )
}