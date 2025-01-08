import { Button, Center } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";
import SellProductsForm from "../Components/SellproductForm";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function Sales(){
      const [opened, { open, close }] = useDisclosure(false);
   
   const fetchSales = async () => {
    const { data } = await axios.get(`http://localhost:3000/sales`);
    return data;
};
    const { isPending, error, data } = useQuery({
        queryKey: ['sales'],
        queryFn: () => fetchSales(),
            enabled: true,
        })

        const fetchMerchants = async () => {
            const { data } = await axios.get(`http://localhost:3000/merchants`);
            return data;
        };
            const { isFetched:merchantIsFetched, data:merchants } = useQuery({
                queryKey: ['merchants'],
                queryFn: () => fetchMerchants(),
                    enabled: true,
                })
                const fetchProducts = async () => {
                    const { data } = await axios.get(`http://localhost:3000/items`);
                    return data;
                };
                    const { data:fetchedProducts } = useQuery({
                        queryKey: ['products'],
                        queryFn: () => fetchProducts(),
                            enabled: true,
                        })
                

    return(
        <>
        <Center mt={20}>
            <Button onClick={open} variant='outline'  >
                sell Product
            </Button> 
        </Center>
        
        <SellProductsForm opened={opened} onClose={close}/>

        <Center mt={20}>

            <table className="border-collapse border-spacing-y-2">
                <thead>
                    <tr className="text-teal-900 border text-lg font-semibold">
                        <th className="w-40 py-3 pl-2 text-start">Marchant</th>
                        <th className="w-80 py-3 text-start">Orderd Item</th>
                        <th className="w-40 py-3 text-start">Quantity</th>
                        <th className="w-40 py-3 text-start">Selling Price</th>
                        <th className="w-52 text-start">Payment Options</th>
                    </tr>
                    <tr></tr>
                </thead>

                <tbody className="text-stone-900 text-base font-medium">
                {data && data.map((data: any ) => (
                    <tr key={data.id} className="overflow-hidden border items-start">
                        <td className="content-start pl-2">{merchants.find((item: { id: any; }) => item.id === data.merchant).name}</td>
                        <td>
                            {data.orderdItems.map((data:any)=>(
                                <td className="py-2 flex flex-col">{fetchedProducts.find((item: { id: any; }) => item.id === data.id).name}</td>
                            ))}
                        </td>
                        <td>
                            {data.orderdItems.map((data:any)=>(
                                <td className="flex flex-col py-2 ">{data.quantity}</td>  
                            ))}
                        </td>
                        <td>
                            {data.orderdItems.map((data:any)=>(
                                <td className="py-2 flex flex-col">{data.sellingPrice}</td>
                            ))}
                        </td>
                        <td>
                            {data.payments.map((data:any)=>(
                                <td className="py-2 flex flex-col">{data.bank}-{data.amount}</td>
                            ))}
                        </td>
                    </tr>
                  ))}
                 </tbody>
            </table>

        </Center>      
  
        </>
    )
}
