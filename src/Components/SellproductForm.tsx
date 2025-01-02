import { Modal, Select, Button, Center, Stepper, NumberInput, TextInput } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { DateInput } from '@mantine/dates';
import { useState, useEffect } from "react"
import { useForm } from "@mantine/form";
import { ISales, IOrderedItem, IPayment } from "../interfaces/sales";
import { zodResolver } from "@mantine/form";
import { orderedItemSchema, paymentSchema } from "../schemas/validationSchema";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { AddSales } from "../Redux/addSalesSlice";
import { RootState } from "../Redux/store";
import Merhcants from "../Routes/Merchants";
import { IMerchant } from "../interfaces/marchant";

type TsellProductsform = {
    opened: boolean
    onClose: () => void;
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

export default function SellProductsForm({opened, onClose }:TsellProductsform, ){
    const [page] = useState(1);
    const [items, setItems]= useState<any>([]);
    const [active, setAcitve] = useState(0)
    const [payable, setPayable] = useState(0);
    const [paid, setPaid] = useState(0);
    const [orderedItems, setOrderedItems] = useState<IOrderedItem[]>([]);
    const [paymentOptions, setPaymentOptions] = useState<IPayment[]>([]);
    const [merchant, setMerchant] = useState('');
    const [SelectableMerchants, setSelectableMerchants] = useState<any>([]);

    const dispatch = useDispatch();
    const merchants = useSelector((state: RootState) => state.merchant); 
    
    const handlefileupload = (merchant:any,orderdItems:any,payments:any) => {
        const newSale: ISales = {
            merchant,
            orderdItems,
            payments,
          };
          dispatch(AddSales(newSale));;
        }

    
    

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

        useEffect(()=>{
            if(merchants){
            setSelectableMerchants(merchants.map((item: IMerchant) => ({
                    label: item.name,
                    value: item.id,
                })));
            }
        }, []);

      

        const merchantSchema = z.object({
            merchant: z.string().min(1, "Please Select Merchant")
          });
          
        const marchantForm = useForm({
            mode: "uncontrolled",
            initialValues:{ merchant:''},
            validate: zodResolver(merchantSchema),
            onValuesChange: (values) => {
               setMerchant(values.merchant);
            }
        })

        const orederdItemsForm = useForm<{ orderdItems: IOrderedItem[];
        }>({mode:"uncontrolled",
            initialValues: { orderdItems: [{ id:'', quantity:0, sellingPrice:0 }]},
            validate: zodResolver(orderedItemSchema),
            onValuesChange: (values) => {
                let total=0
                setOrderedItems(values.orderdItems)
                for (let i = 0; i < values.orderdItems.length; i++) {
                          const item = values.orderdItems[i];
                          total += item.sellingPrice * item.quantity;
                        }
                setPayable(total)
            }
        })


        const paymentForm = useForm<{ selectedPayments: IPayment[];
        }>({ mode: 'uncontrolled',
            initialValues: { selectedPayments: [{ accountNumber:'', bank:'', amount:0, date: new Date() }]},
            validate: zodResolver(paymentSchema),
            onValuesChange: (values) => {
                setPaymentOptions(values.selectedPayments);
                let total=0
                for (let i = 0; i < values.selectedPayments.length; i++) {
                          const item = values.selectedPayments[i];
                          total += item.amount;
                        }
                setPaid(total);
            }
        })


        const addItem = () => {
            orederdItemsForm.insertListItem('orderdItems', { id: '', quantity:0, sellingPrice: 0 });
        };

        const removeItem = (index: number) => {
            orederdItemsForm.removeListItem('orderdItems', index);
        };
        const addPaymentOption = ( ) => {
            paymentForm.insertListItem('selectedPayments', { accountNumber:'', bank:'', amount:0, date: new Date() });
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
                    orederdItemsForm.values.orderdItems.map(( index) => (
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
                    paymentForm.values.selectedPayments.map((index) => (
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
           
            <Modal opened={active==4} 
                onClose={() => {
                    onClose(); 
                    orederdItemsForm.reset(); 
                    setAcitve(0)
                    }} 
                title='Form recorderd successfully'>
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
                                data={SelectableMerchants}
                                key={marchantForm.key('merchant')}
                                {...marchantForm.getInputProps('merchant')}
                                error={marchantForm.errors.merchant}
                                />
                        </form>
                    </Stepper.Step>
                    
                    <Stepper.Step label='select Item'>
                        <form onSubmit={orederdItemsForm.onSubmit((values) => {console.log(values); })}>
                        {orederdItemsForm.values.orderdItems.map((_, index) => (
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
                        <center>
                        Total Price: {payable}
                        </center>
                        
                        <Button onClick={()=>addItem()}>Add Item</Button>
                    </Stepper.Step>

                    <Stepper.Step label='add your payment options'>
                        <form onSubmit={paymentForm.onSubmit((values) => {console.log(values); })}>
                        <center>
                        {`Total Price: ${payable} -- You've paid: ${paid} -- Remaining: ${payable-paid}`}
                        </center>
                        {paymentForm.values.selectedPayments.map((_, index) => (
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
                   
                   
                        <Button onClick={()=>addPaymentOption()}>Add Item</Button>
                    </Stepper.Step>
                    

                    <Stepper.Completed>
                        <div>
                           Selling the following Products for {merchant}
                           <table className="border-collapse mt-1 mb-10 border-spacing-y-2">
                              <thead>
                                  <tr className="text-teal-900 border text-lg font-semibold">
                                      <th className="w-80 py-3 pl-2 text-start">Item Id</th>
                                      <th className="w-40 py-3 text-start">Quantity</th>
                                      <th className="w-40 py-3 text-start">Selling Price</th>
                                  </tr>
                              </thead>
                              <tbody className="text-stone-900 text-base font-medium">
                              {orderedItems.map((item)=>(
                                <tr className="overflow-hidden border items-start">
                                    <td className="pl-2">{item.id}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.sellingPrice}</td>
                                </tr>
                                ))}
                                    
                               </tbody>
                          </table>
                           

                          You have paid with the following payment options:
                           <table className="border-collapse mt-1 border-spacing-y-2">
                              <thead>
                                  <tr className="text-teal-900 border text-lg font-semibold">
                                      <th className="w-40 py-3 pl-2 text-start">bank</th>
                                      <th className="w-80 py-3 text-start">Account Number</th>
                                      <th className="w-40 py-3 text-start">Ammount</th>
                                      <th className="w-40 py-3 text-start">date</th>
                                  </tr>
                              </thead>
                              <tbody className="text-stone-900 text-base font-medium">
                              {paymentOptions.map((payment)=>(
                                <tr className="overflow-hidden border items-start">
                                    <td className="pl-2">{payment.bank}</td>
                                    <td>{payment.accountNumber}</td>
                                    <td>{payment.amount}</td>
                                    <td className="pr-3 my-4">{new Date (payment.date).toLocaleDateString("en-US", {year:'numeric', month:'short',day:'numeric'})}</td>
                                </tr>
                                ))}
                                    
                               </tbody>
                          </table>
                           

                           <h6 className="text-teal-900 text-lg font-bold text-center mt-5"> Do You Want to Proceed? </h6>
                        </div>
                    </Stepper.Completed>
                </Stepper>
               

                <Center mt={50}>
                    {active>0?<Button mr={25} onClick={stepBack} >Back</Button>:<></>}
                    <Button 
                        disabled={active==2? payable-paid==0? false:true:false}
                        onClick={()=>{
                            stepNext(); 
                            active==3&& handlefileupload(merchant, orderedItems, paymentOptions)
                        }} 
                            type={active == 3 ? 'submit':'button' 
                            }>Next</Button>
                </Center>
        
        </Modal>
        </>
    )
}
