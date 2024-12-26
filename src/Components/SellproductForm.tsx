import { Modal, Select, Button, Center, Stepper, NumberInput, LoadingOverlay } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useState, useEffect } from "react"
import { useForm } from "@mantine/form";
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from "zod";

interface IDatabse {
    orderdItems: {
        id: string,
        quantity: number,
        sellingPrice: number,
    }[];
    merchant: string
}


type TsellProductsform = {
    opened: boolean
    onClose: () => void
    setDatabase: React.Dispatch<React.SetStateAction<IDatabse[]>>;
}

interface ISelectorItem  {
    name: string;
    id: string;
}

interface Item {
    id: string;
    quantity: number;
    sellingPrice: number;
  }


const fetchProducts = async (page: number) => {
    const { data } = await axios.get(`https://test-api.nova-techs.com/products`, {
        params: { page },
    });
    return data
}

export default function SellProductsForm({opened, onClose, setDatabase }:TsellProductsform, ){
    const [page, setPage] = useState(1);
    const [items, setItems]= useState<any>([]);
    const [active, setAcitve] = useState(0)

    const handlefileupload = (Database: any) => {
        setDatabase(prev => [...prev, Database]);
    }
    

    const { isPending, isFetched, error, data } = useQuery({
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


        const fields = z.object({
            id: z.string().min(2, {message:"Please select the item"}),
            quantity: z.number().min(1, {message:'Quantity can not be less than 1'}),
            sellingPrice: z.number().min(1, {message:'selling price can not be less than 1'}),
            merchant: z.string().min(2, {message: 'please select marchant'})
        })

        const form = useForm<{ orderdItems: Item[];
        }>({
            mode:'uncontrolled',
            initialValues: { orderdItems: [{ id:'', quantity:0, sellingPrice:0 }]},
            // validate: zodResolver(fields)
        })

        const addItem = () => {
            form.insertListItem('orderdItems', { id: '', quantity:0, sellingPrice: 0 });
        };

        const removeItem = (index: number) => {
            form.removeListItem('orderdItems', index);
        };
    
        const stepNext = () => { 
            switch(active){

                case 0:
                    form.validateField("merchant")
                    if(form.isValid("merchant")){
                    setAcitve((current) => (current < 2 ? current + 1 : current))
                    }else{console.log('error1')}
                    break;

                case 1:
                    setAcitve((current) => (current < 2 ? current + 1 : current))
                    break;

                case 2:
                    setAcitve((current) => (current < 3 ? current + 1 : current))
                    break;

                default:
                    console.log('allerror')
            }
        }
        const stepBack = () => setAcitve((current) => (current > 0 ? current-1 : current))

    return(
        <>
        <Modal opened={opened} size="auto" onClose={()=>{onClose(); form.reset(); setAcitve(0)}} title='Sell Product' >
           
            <Modal opened={active==3} onClose={() => {onClose(); form.reset(); setAcitve(0)}} title='Form recorderd successfully'>
                <Button onClick={()=>{onClose(); form.reset(); setAcitve(0)}}>OK</Button>
            </Modal>

            <form onSubmit={form.onSubmit((values) => {console.log(values); handlefileupload(values)})}>
                <Stepper iconSize={32} active={active} onStepClick={setAcitve} >
                    <Stepper.Step label='Select marchant' >
                        <Select
                            mb={10}
                            label="Select a marchant"
                            data={['marhcant1', 'marchant2', 'marhchant3']}
                            key={form.key('merchant')}
                            {...form.getInputProps('merchant')}
                            error={form.errors.merchant}
                        />
                    </Stepper.Step>
                    
                    <Stepper.Step label='select Item'>
                    {form.values.orderdItems.map((item, index) => (
                         
                            <div className="flex items-center my-5 gap-5" key={item.id}>
                            <Select
                                mb={10}
                                w={200}
                                label="Select an item"
                                data={items}
                                key={form.key(`orderdItems.${index}.id`)}
                                {...form.getInputProps(`orderdItems.${index}.id`)}
                            />
                            <NumberInput mb={7}
                                label="Quantity"
                                placeholder="100"
                                trimLeadingZeroesOnBlur
                                key={form.key(`orderdItems.${index}.quantity`)}
                                {...form.getInputProps(`orderdItems.${index}.quantity`)}
                            />
                            <NumberInput mb={7}
                                label="Selling Price"
                                placeholder="Selling price"
                                trimLeadingZeroesOnBlur
                                prefix="$"
                                key={form.key(`orderdItems.${index}.sellingPrice`)}
                                {...form.getInputProps(`orderdItems.${index}.sellingPrice`)}
                            />
                            <Button onClick={()=>removeItem(index)}>Remove</Button>
                            </div>
                            
                    ))}
                   
                        <Button onClick={addItem}>addItem</Button>
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
                    <Button onClick={()=>{stepNext(); console.log(active)}} type={active == 3 ? 'submit':'button' }>Next</Button>
                </Center>
            </form>
        </Modal>

        </>
    )
}
