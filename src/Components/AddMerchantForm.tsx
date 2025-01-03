import { Modal, Button, Center, NumberInput, TextInput } from "@mantine/core";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { zodResolver } from "@mantine/form";
import { useDispatch } from "react-redux";
import { IMerchant } from "../interfaces/marchant";
import { AddMerchant } from "../Redux/addMarchantSlice";
import { merchantSchema } from "../schemas/validationSchema";

type TAddMerchantform = {
    opened: boolean
    onClose: () => void;
}
  
export default function AddMerchantForm({opened, onClose }:TAddMerchantform, ){

    const dispatch = useDispatch();
    const [confirmation, SetConfirmation] = useState(false);
 
    const handlefileupload = (merchant:any) => {
        const newSale: IMerchant = {
            id: Math.random().toString(36).substr(2, 9),
            name: merchant.name,
            address: merchant.address,
            phone: merchant.phone,
           
          };
          dispatch(AddMerchant(newSale));
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
                <Modal opened={confirmation} 
                onClose={() => {
                    onClose(); 
                    MerchantForm.reset();
                    }}
                title='Form recorderd successfully'>
                <Button 
                onClick={()=>{
                    onClose(); 
                    MerchantForm.reset(); 
                    SetConfirmation(false);
                }}>OK</Button>
            </Modal >
                <form onSubmit={MerchantForm.onSubmit((values)=>{handlefileupload(values); console.log(values);})}>

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
                        <Button onClick={()=>{if(MerchantForm.isValid()){SetConfirmation(true)}}} type="submit">Submit</Button>
                    </Center>

                </form>
        </Modal>
        </>
    )
}
