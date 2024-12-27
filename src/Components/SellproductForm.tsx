import { Modal, Select, Button, Center, Stepper, NumberInput, TextInput } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { DateInput } from '@mantine/dates';
import { useState, useEffect } from "react"
import { useForm } from "@mantine/form";
import { ISales, IOrderedItem, IPayment } from "../interfaces/sales";
import { zodResolver } from "@mantine/form";
import { salesSchema, productschema, orderedItemSchema, paymentSchema } from "../schemas/validationSchema";
import { z } from "zod";

type TsellProductsform = {
    opened: boolean
    onClose: () => void

}

interface ISelectorItem  {
    name: string;
    id: string;
}



const fetchProducts = async (page: number) => {
    const { data } = await axios.get(`https://test-api.nova-techs.com/products`, {
        params: { page },
    });
    return data
}

export default function SellProductsForm({opened, onClose,  }:TsellProductsform, ){
    const [page] = useState(1);
    const [items, setItems]= useState<any>([]);
    const [active, setAcitve] = useState(0)
    const [database, setDatabase] = useState<ISales[]>([]);

    // const handlefileupload = (Database: any) => {
    //     setDatabase(prev => [...prev, Database]);
    // }

    
    

    const { isFetched, data } = useQuery({
        queryKey: ['products', page],
        queryFn: () => fetchProducts(page),
            enabled: true,
        })

        useEffect(()=>{
            if (isFetched) {
                setItems(data.data.map((item: ISelectorItem) => ({
                    label: item.name,
                    value: item.id,
                })));
            }
        }, [isFetched]);

        const merchantSchema = z.object({
            merchant: z.string().min(1, "Please Select Merchant")
          });
          
        const marchantForm = useForm({
            mode:'uncontrolled',
            initialValues:{ merchant:''},
            validate: zodResolver(merchantSchema)
        })

        const orederdItemsForm = useForm<{ orderdItems: IOrderedItem[];
        }>({
            mode:'uncontrolled',
            initialValues: { orderdItems: [{ id:'', quantity:0, sellingPrice:0 }]},
            validate: zodResolver(orderedItemSchema)
        })

        const paymentForm = useForm<{ selectedPayments: IPayment[];
        }>({
            mode:'uncontrolled',
            initialValues: { selectedPayments: [{ accountNumber:'', bank:'', amount:0, date: new Date() }]},
            validate: zodResolver(paymentSchema)
        })

    

        const addItem = () => {
            orederdItemsForm.insertListItem('orderdItems', { id: '', quantity:0, sellingPrice: 0 });
        };

        const removeItem = (index: number) => {
            orederdItemsForm.removeListItem('orderdItems', index);
        };
        const addPaymentOption = ( ) => {
            paymentForm.insertListItem('selectedPayments', { id: '', quantity:0, sellingPrice: 0 });
        };

        const removePaymentOption = ( index: number) => {
            paymentForm.removeListItem('selectedPayments', index);
        };


        const stepNext = () => { 

            switch(active){
                case 0:
                    marchantForm.validateField("merchant")
                    if(marchantForm.isValid("merchant")){
                    setAcitve((current) => (current < 2 ? current + 1 : current))
                    }else{console.log('error1')}
                    console.log(marchantForm.errors.merchant)
                    break;

                case 1:
                    orederdItemsForm.values.orderdItems.map((item, index) => (
                        orederdItemsForm.validateField(`orderdItems.${index}.id`),
                        orederdItemsForm.validateField(`orderdItems.${index}.sellingPrice`),
                        orederdItemsForm.validateField(`orderdItems.${index}.quantity`)
                    ))

                    const itmesVerified = orederdItemsForm.validate();

                    if (!itmesVerified.hasErrors){
                       setAcitve((current) => (current < 2 ? current + 1 : current)) 
                    }
                    
                    break;

                case 2:
                    paymentForm.values.selectedPayments.map((item, index) => (
                        paymentForm.validateField(`selectedPayments.${index}.bank`),
                        paymentForm.validateField(`selectedPayments.${index}.accountNumber`),
                        paymentForm.validateField(`selectedPayments.${index}.amount`),
                        paymentForm.validateField(`selectedPayments.${index}.date`)
                    ))

                    const paymentVerified = paymentForm.validate();

                    if (!paymentVerified.hasErrors){
                       setAcitve((current) => (current < 3 ? current + 1 : current)) 
                    }
                
                    break;

                case 3:
                    setAcitve((current) => (current < 4 ? current + 1 : current)) 
                    break;
                default:
                    console.log('allerror')
            }
        }
        const stepBack = () => setAcitve((current) => (current > 0 ? current-1 : current))

    return(
        <>
        <Modal opened={opened} size="auto" 
            onClose={()=>{
                onClose(); 
                orederdItemsForm.reset(); 
                marchantForm.reset(); 
                paymentForm.reset();
                setAcitve(0)
            }} title='Sell Product' >
           
            <Modal opened={active==4} onClose={() => {onClose(); orederdItemsForm.reset(); setAcitve(0)}} title='Form recorderd successfully'>
                <Button 
                onClick={()=>{
                    onClose(); 
                    orederdItemsForm.reset(); 
                    marchantForm.reset(); 
                    paymentForm.reset();
                    setAcitve(0)
                }}>OK</Button>
            </Modal>

           
                <Stepper iconSize={32} active={active} onStepClick={setAcitve} >
                    
                    <Stepper.Step label='Select marchant' >
                        <form onSubmit={marchantForm.onSubmit((values) => {console.log(values); })}>
                        <Select
                            mb={10}
                            label="Select a marchant"
                            placeholder="merchant2"
                            data={['marhcant1', 'marchant2', 'marhchant3']}
                            key={marchantForm.key('merchant')}
                            {...marchantForm.getInputProps('merchant')}
                            error={marchantForm.errors.merchant}
                            />
                        </form>
                    </Stepper.Step>
                    
                    <Stepper.Step label='select Item'>
                        <form onSubmit={orederdItemsForm.onSubmit((values) => {console.log(values); })}>
                        {orederdItemsForm.values.orderdItems.map((item, index) => (
                         
                            <div className="flex items-center my-5 gap-5" key={index}>
                            <Select
                                mb={10}
                                w={200}
                                label="Select an item"
                                data={items}
                                key={orederdItemsForm.key(`orderdItems.${index}.id`)}
                                {...orederdItemsForm.getInputProps(`orderdItems.${index}.id`)}
                             
                            />
                            <NumberInput mb={7}
                                label="Quantity"
                                placeholder="100"
                                trimLeadingZeroesOnBlur
                                key={orederdItemsForm.key(`orderdItems.${index}.quantity`)}
                                {...orederdItemsForm.getInputProps(`orderdItems.${index}.quantity`)}
                            />
                            <NumberInput mb={7}
                                label="Selling Price"
                                placeholder="Selling price"
                                trimLeadingZeroesOnBlur
                                prefix="$"
                                key={orederdItemsForm.key(`orderdItems.${index}.sellingPrice`)}
                                {...orederdItemsForm.getInputProps(`orderdItems.${index}.sellingPrice`)}
                            />
                            <Button onClick={()=>removeItem(index)}>Remove</Button>
                            </div>
                            
                    ))}
                        </form>
                   
                   
                        <Button onClick={()=>addItem()}>addItem</Button>
                    </Stepper.Step>

                    <Stepper.Step label='add your payment options'>
                        <form onSubmit={paymentForm.onSubmit((values) => {console.log(values); })}>
                        {paymentForm.values.selectedPayments.map((item, index) => (
                         
                            <div className="flex items-center my-5 gap-5" key={index}>
                            <Select
                                mb={10}
                                w={200}
                                label="Select Your Bank"
                                data={["CBE", "Dashen Bank", "Anbessa Bank", "Awash Bank", "Abyssinia Bank"]}
                                key={paymentForm.key(`selectedPayments.${index}.bank`)}
                                {...paymentForm.getInputProps(`selectedPayments.${index}.bank`)}
                             
                            />
                            <TextInput mb={7}
                                label="Account Number"
                                placeholder="100"
                                key={paymentForm.key(`selectedPayments.${index}.accountNumber`)}
                                {...paymentForm.getInputProps(`selectedPayments.${index}.accountNumber`)}
                            />
                            <NumberInput mb={7}
                                label="Ammount"
                                placeholder="0"
                                trimLeadingZeroesOnBlur
                                prefix="$"
                                key={paymentForm.key(`selectedPayments.${index}.amount`)}
                                {...paymentForm.getInputProps(`selectedPayments.${index}.amount`)}
                            />
                            <DateInput
                                w={200}
                                label="Payment Date"
                                placeholder="Payment Date"
                                key={paymentForm.key(`selectedPayments.${index}.date`)}
                                {...paymentForm.getInputProps(`selectedPayments.${index}.date`)}
                            />
                            <Button onClick={()=>removePaymentOption(index)}>Remove</Button>
                            </div>
                            
                    ))}
                        </form>
                   
                   
                        <Button onClick={()=>addPaymentOption()}>addItem</Button>
                    </Stepper.Step>
                    

                    <Stepper.Completed>
                        <div>
                            your order is fully recorderd
                            do you want to submit?
                        </div>
                    </Stepper.Completed>
                </Stepper>
               

                <Center mt={50}>
                    {active>0?<Button mr={25} onClick={stepBack} >Back</Button>:<></>}
                    <Button 
                        onClick={()=>{
                            stepNext(); 
                            console.log(orederdItemsForm.errors);
                            console.log(paymentForm.errors);
                        }} 
                            type={active == 4 ? 'submit':'button' 
                            }>Next</Button>
                </Center>
        
        </Modal>
        </>
    )
}
