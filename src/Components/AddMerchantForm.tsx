import { Modal, Button, Center, NumberInput, TextInput, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "@mantine/form";
import { IMerchant } from "../interfaces/marchant";
import { merchantSchema } from "../schemas/validationSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "../utils/config";
import { QUERY_KEYS } from "../Constants/queryKeys";

type TAddMerchantform = {
    opened: boolean
    onClose: () => void;
}
  
export default function AddMerchantForm({opened, onClose }:TAddMerchantform, ){

    const queryClient = useQueryClient();
    

    const createMerchant = async (newPost: IMerchant) => {
        try {
            const { data } = await axios.post(`${API_BASE_URL}merchants`, newPost);
            return data; 
        } catch (error: any) {
          
            throw error.response?.data || new Error('Failed to create product');
        }
    };

    const { isPending:UploadPending, mutate } = useMutation({
        mutationFn: (newPost: IMerchant) => createMerchant(newPost),
          onError:()=>{},
          onSuccess:() => {
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.MERCHANTS]});
            onClose();
            MerchantForm.reset();
          }
      })

    const handleupload = (merchant:any) => {
        const newSale: IMerchant = {
            id: Math.random().toString(36).substr(2, 9),
            name: merchant.name,
            address: merchant.address,
            phone: merchant.phone,
          };
         mutate(newSale);
        }


           const MerchantForm = useForm({
                mode:"uncontrolled",
                    initialValues: { id:'', name:'', address:'', phone:'' },
                    validate: zodResolver(merchantSchema)
                })
        
       
    return(
        <>
        <Modal opened={opened}  
            onClose={()=>{
                onClose(); 
                MerchantForm.reset();
            }} title='Merchant Add Form' >
                <LoadingOverlay visible={UploadPending} />
                <form  onSubmit={MerchantForm.onSubmit(handleupload)}>

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
                        <Button  type="submit" loading={UploadPending}>Submit</Button>
                    </Center>

                </form>
        </Modal>
        </>
    )
}
