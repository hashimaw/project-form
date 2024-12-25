import { Modal, Select, Button, Center, Stepper, NumberInput } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useState, useEffect } from "react"
import { useForm } from "@mantine/form";
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from "zod";
import { useSet } from "@mantine/hooks";

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

export default function SellProductsForm({opened, onClose}:TsellProductsform){
    const [page, setPage] = useState(1);
    const [items, setItems]= useState<any>([]);
    const [active, setAcitve] = useState(0)
    

    const stepNext = () => { if(!form.errors.id){
        setAcitve((current) => (current < 2 ? current + 1 : current))
    }
         }
    const stepBack = () => setAcitve((current) => (current > 0 ? current-1 : current))

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

        const id = z.object({
            id: z.string().min(2, {message:"Please select the item"}),
            quantity: z.number().min(1, {message:'Quantity can not be less than 1'}),
            sellingPrice: z.number().min(1, {message:'selling price can not be less than 1'})
        })

        const form = useForm({
            mode:'uncontrolled',
            initialValues: {id:''},
            validate: zodResolver(id)
        })

    return(
        <>
        <Modal opened={opened} size="auto" onClose={onClose} title='Sell Product' >
            <form onSubmit={form.onSubmit((values) => console.log(values))}>
                <Stepper iconSize={32} active={active} onStepClick={setAcitve} allowNextStepsSelect={true}>
                    <Stepper.Step label='Select Items' >
                        {data && 
                        <div className="flex my-5 gap-5">
                        <Select
                            mb={10}
                            w={200}
                            label="Select an item"
                            data={items}
                            key={form.key('id')}
                            {...form.getInputProps('id')}
                            error={form.errors.id}
                        />
                        <NumberInput mb={7}
                            label="Quantity"
                            placeholder="100"
                            key={form.key('quantity')}
                            {...form.getInputProps('quantity')}
                        />
                        <NumberInput mb={7}
                            label="Selling Price"
                            placeholder="Selling price"
                            prefix="$"
                            key={form.key('sellingPrice')}
                            {...form.getInputProps('sellingPrice')}
                        />
                        </div>
                        }

                        <Button>Add Item</Button>
                    </Stepper.Step>
                    
                    <Stepper.Step label='Second Step'>
                        hi
                    </Stepper.Step>
                    <Stepper.Completed>
                        your order is recorded
                    </Stepper.Completed>
                </Stepper>
               

                <Center mt={50}>
                    <Button mr={25} onClick={stepBack} >Back</Button>
                    <Button onClick={stepNext}  type="submit" >Next</Button>
                </Center>
            </form>
        </Modal>

        </>
    )
}
