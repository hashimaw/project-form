import { Modal, Button, Center, NumberInput, TextInput, LoadingOverlay, ActionIcon } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "@mantine/form";
import { IMerchant } from "../interfaces/marchant";
import { merchantSchema } from "../schemas/validationSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { IconEdit } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useSelector } from "react-redux";

type TEditMerchantform = {
    merchant: IMerchant;
}
  
export default function EditMerchantForm({merchant }:TEditMerchantform ){

    const [merchantEdit,{ open , close }]=useDisclosure(false);
    const queryClient = useQueryClient();
    const api = useSelector((state:any) => state.apiLink);

    const editMerchant = async (newPost: IMerchant) => {
        try {
            const { data } = await axios.patch(`${api}merchants/${merchant.id}`, newPost);
            return data;
        } catch (error: any) {
          
            throw error.response?.data || new Error('Failed to update Merchant');
        }
    };
    
      const {mutate, isPending:merchantEditPending, error } = useMutation({
        mutationFn: (newPost: IMerchant) => editMerchant(newPost),
          onError:()=>{open()},
          onSuccess:() => {
            queryClient.invalidateQueries({queryKey: ["merchants"]});
            close();
            MerchantForm.reset();
          }
      })
    
    const handlefileupload = (values:IMerchant) => {
      
          mutate({ ...values })
        }


           const MerchantForm = useForm({
                mode:"uncontrolled",
                    initialValues: { ...merchant },
                    validate: zodResolver(merchantSchema)
                })
        
       
    return(
        <>
        <ActionIcon
            title="Edit"
            color="blue"
            variant="outline"
            size={25}
            onClick={open}
            >
            <IconEdit/>
        </ActionIcon>
        <Modal opened={merchantEdit}  
            onClose={()=>{
                close(); 
                MerchantForm.reset();
            }} title='Merchant Edit Form' >
                <LoadingOverlay visible={merchantEditPending} />
                <form onSubmit={MerchantForm.onSubmit((values)=>{handlefileupload(values); console.log(values);})}>
                    {error&& <p className="place-self-center text-red-500">{error.message}</p>}
                    <TextInput mb={7}
                        label="Merchant Name"
                        placeholder="John Doe"
                        key={MerchantForm.key(`name`)}
                        {...MerchantForm.getInputProps(`name`)}
                        />
                    <TextInput mb={7}
                        label="Address"
                        placeholder="Addis Ababa"
                        key={MerchantForm.key(`address`)}
                        {...MerchantForm.getInputProps(`address`)}
                        />
                    <NumberInput mb={7}
                        label="Phone"
                        placeholder="+251"
                        allowNegative={false}
                        trimLeadingZeroesOnBlur={false}
                        allowLeadingZeros={true}
                        hideControls
                        key={MerchantForm.key(`phone`)}
                        {...MerchantForm.getInputProps(`phone`)}
                        />

                    <Center mt={20}>
                        <Button  type="submit">Submit</Button>
                    </Center>

                </form>
        </Modal>
        </>
    )
}
