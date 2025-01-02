import { Button, Center } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";
import SellProductsForm from "../Components/SellproductForm";
import { ISales } from "../interfaces/sales";
import { useSelector } from 'react-redux';
import { RootState } from "../Redux/store";


export default function Sales(){
      const [opened, { open, close }] = useDisclosure(false);
   // const [database, setDatabase] = useState<ISales[]>([]);
    
    const database = useSelector((state: RootState) => state.database); 

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
                        <th className="w-80 py-3 text-start">Orderd Item ID</th>
                        <th className="w-40 py-3 text-start">Quantity</th>
                        <th className="w-40 py-3 text-start">Selling Price</th>
                        <th className="w-52 text-start">Payment Options</th>
                    </tr>
                    <tr></tr>
                </thead>

                <tbody className="text-stone-900 text-base font-medium">
                {database.map((data: ISales , index) => (
                    <tr key={index} className="overflow-hidden border items-start">
                        <td className="content-start pl-2">{data.merchant}</td>
                        <td>
                            {data.orderdItems.map((data:any)=>(
                                <td className="py-2 flex flex-col">{data.id}</td>
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
