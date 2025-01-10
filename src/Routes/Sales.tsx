import { Button, Center } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";
import SellProductsForm from "../Components/SellproductForm";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

export default function Sales(){
      const [opened, { open, close }] = useDisclosure(false);
      const api = useSelector((state:any) => state.apiLink);
   const fetchSales = async () => {
    const { data } = await axios.get(`${api}sales`);
    return data;
};
    const { data } = useQuery({
        queryKey: ['sales'],
        queryFn: () => fetchSales(),
            enabled: true,
        })

        const fetchMerchants = async () => {
            const { data } = await axios.get(`${api}merchants`);
            return data;
        };
            const { data:merchants } = useQuery({
                queryKey: ['merchants'],
                queryFn: () => fetchMerchants(),
                    enabled: true,
                })
                const fetchProducts = async () => {
                    const { data } = await axios.get(`${api}items`);
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
                    <tr className="text-teal-900 bg-cyan-300 border text-base font-semibold">
                        <th className="w-40 py-3 pl-5 text-start">Marchant</th>
                        <th className="w-52 py-3 text-start">Orderd Item</th>
                        <th className="w-32 py-3 text-start">Quantity</th>
                        <th className="w-32 py-3 text-start">Selling Price</th>
                        <th className="w-48 text-start">Payment Options</th>
                    </tr>
                    <tr></tr>
                </thead>

                <tbody className="text-stone-900 text-sm font-medium">
                {data && data.map((data: any ) => (
                    <tr key={data.id} className="odd:bg-stone-200 even:bg-stone-50 overflow-hidden border items-start align-top">
                        <td className="content-start pl-5">{merchants?.find((item: { id: any; }) => item.id === data.merchant).name}</td>
                        <td>
                            {data.orderdItems.map((data:any)=>(
                                <td className="py-2 flex flex-col">{fetchedProducts?.find((item: { id: any; }) => item.id === data.id).name}</td>
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
