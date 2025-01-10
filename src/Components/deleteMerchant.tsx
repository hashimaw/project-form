import { TextInput, Center, Button, Modal, ActionIcon, LoadingOverlay } from '@mantine/core';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { IconTrash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IMerchant } from '../interfaces/marchant';
import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";

type TDeleteMerchant = {
    merchant: IMerchant;
}
  
export function DeleteMerchant ({ merchant }: TDeleteMerchant) {

  const [opened, { open, close }] = useDisclosure(false);
  const [merchantHasSales, setMerchantHasSales] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const api = useSelector((state:any) => state.apiLink);

  const fetchSales = async () => {
    const { data } = await axios.get(`${api}sales`);
    return data;
};
const { data:sales } = useQuery({
    queryKey: ['sales'],
    queryFn: () => fetchSales(),
        enabled: true,
    })
useEffect(() => {
    if (sales) {
        const hasSales = sales.some((sale: any) => sale.merchant === merchant.id);
        setMerchantHasSales(hasSales);
    }
}
, [sales, merchant.id]);
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { deleteItem: ""},
    validate: {
        deleteItem: (value) => (value == 'Delete Merchant' ? null : 'pleace Write Delete Merchant to Confirm'),
    },
  });

  const deleteProduct = async () => {
    try {
        const { data } = await axios.delete(`${api}merchants/${merchant.id}`);
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
  <ActionIcon
        title="Delete"
        color="red"
        variant="outline"
        size={25}
        onClick={open}
        >
        <IconTrash />
    </ActionIcon>
      <Modal opened={opened} onClose={close} title={`You are about to delete:  '${merchant.name}' `} centered>
        
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <LoadingOverlay visible={isPending} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }}>
          </LoadingOverlay>
          {merchantHasSales&&<div className='text-center text-red-400'>Unable to Delete! This Merchant Has Transaction. </div>}
          {error&&<div className='text-center text-red-400'>{error.message}</div>}
          <TextInput mb={7}
          label="Please Write 'Delete Merchant' to confirm"
          placeholder=""
          key={form.key('deleteItem')}
          {...form.getInputProps('deleteItem')}
          /> 
          <Center mt={20}> <Button disabled={merchantHasSales} type='submit' variant="filled">Delete Merchant</Button></Center>
             
        </form>
      </Modal>
   
      </>
    )
}