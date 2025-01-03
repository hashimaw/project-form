import { Button, Center } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";
import AddMerchantForm from "../Components/AddMerchantForm";
import { IMerchant } from "../interfaces/marchant";
import { useSelector } from 'react-redux';
import { RootState } from "../Redux/store";
import { BarChart } from "@mantine/charts";
import { useEffect, useState } from "react";
import '@mantine/charts/styles.css';


export default function Merhcants(){
      const [openMerchantForm, { open, close }] = useDisclosure(false);
      const [chartData, setChartData] = useState([] as any);
        const merchants = useSelector((state: RootState) => state.merchant); 
        const sales = useSelector((state: RootState) => state.database); 

      useEffect(() => {
        setChartData(sales.map((sale) => {
            const total = sale.orderdItems.reduce((sum, item) => sum + item.quantity * item.sellingPrice, 0);
            return {
              merchant: merchants.find((merchant) => merchant.id === sale.merchant)?.name,
              totalSales: total,
            };
        }));
    }, []);
    console.log(chartData);

    
  
    return(
        <>
        <Center mt={20}>
            <Button onClick={open} variant='outline'  >
                Add Merchant
            </Button> 
        </Center>
        
        <AddMerchantForm opened={openMerchantForm} onClose={close}/>

        <Center mt={20}>
            <table className="border-collapse border-spacing-y-2">
                <thead>
                    <tr className="text-teal-900 border text-lg font-semibold">
                        <th className="w-40 py-3 pl-2 text-start">Marchant ID</th>
                        <th className="w-80 py-3 text-start">Merhcant Name</th>
                        <th className="w-40 py-3 text-start">Phone</th>
                        <th className="w-40 py-3 text-start">Address</th>
                        <th className="w-52 text-start"></th>
                    </tr>
                    <tr></tr>
                </thead>

                <tbody className="text-stone-900 text-base font-medium">
                {merchants.map((data: IMerchant , index) => (
                    <tr key={index} className="overflow-hidden border items-start">
                        <td className="content-start pl-2">{data.id}</td>
                        <td className="content-start">{data.name}</td>
                        <td className="content-start">{data.phone}</td>
                        <td className="content-start">{data.address}</td>
                    </tr>
                  ))}
                 </tbody>
            </table>

        </Center>      
        <div className="mt-10">
        {
                chartData.length === 0 ? <h1>You will see sales chart here when you have sells. and to be able to sell you need to create mercahnts</h1> : 
                <BarChart
                data={chartData}
                h={400}
                
                dataKey="merchant" 
                series={[
                    { name: 'totalSales', color: 'violet.6' },
                    { name: 'Laptops', color: 'blue.6' },
                    { name: 'Tablets', color: 'teal.6' },
                ]}
                tickLine="y"
                />
            }
        </div>
      
        </>
    )
}
