import { Button, Center } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";
import AddMerchantForm from "../Components/AddMerchantForm";
import { IMerchant } from "../interfaces/marchant";
import { BarChart } from "@mantine/charts";
import { useEffect, useState } from "react";
import '@mantine/charts/styles.css';
import axios from "axios";
import { useQuery } from "@tanstack/react-query";


export default function Merhcants(){
      const [openMerchantForm, { open, close }] = useDisclosure(false);
      const [chartData, setChartData] = useState<any>([])

      const fetchMerchants = async () => {
        const { data } = await axios.get(`http://localhost:3000/merchants`);
        return data;
    };
        const { data:merchants } = useQuery({
            queryKey: ['merchants'],
            queryFn: () => fetchMerchants(),
                enabled: true,
            })
       
let arrayOfColors = [
    'teal',
    'blue',
    'red',
    'green',
    'purple',
    'pink',
    'yellow',
    'indigo',
    'cyan',
    'gray',
    'lime',
    'amber',
    'orange',
    'brown',
]
            const fetchSales = async () => {
                const { data } = await axios.get(`http://localhost:3000/sales`);
                return data;
            };
                const { data:sales } = useQuery({
                    queryKey: ['sales'],
                    queryFn: () => fetchSales(),
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
            


      useEffect(() => {
        let processedMerchants;
        processedMerchants =
            sales?.reduce((acc:any, sale:any) => {
                sale.orderdItems.forEach((item:any) => {
                  const itemTotal = item.quantity * item.sellingPrice;
                  
                  // Check if merchant already exists
                  let existingMerchant = acc.find((data:any) => data.merchant === sale.merchant);
                  
                  if (!existingMerchant) {
                    // Create new merchant entry
                    existingMerchant = { merchant: (sale.merchant) };
                    acc.push(existingMerchant);
                  }
              
                  // Add item total under item name (or accumulate if exists)
                  existingMerchant[item.id] = (existingMerchant[item.id] || 0) + itemTotal;
                });
              
                return acc;
              }, [] as Record<string, any>[])
        
       setChartData(processedMerchants);
       chartData && console.log(chartData);
        }, [sales]);




        // Create lookup objects for idMapping and merchantMapping
const idMap = fetchedProducts?.reduce((acc: Record<string, string>, item:any) => {
    acc[item.id] = item.name;
    return acc;
  }, {});
  
  const merchantMap =  merchants?.reduce((acc: Record<string, string>, item:any) => {
    acc[item.id] = item.name;
    return acc;
  }, {});
  
  // Substitute keys and merchant values
  const finedChartData = chartData.map((entry:any) => {
    const newEntry: any = {};
  
    Object.keys(entry).forEach((key) => {
      const newKey = idMap[key] || key;  // Replace key if found in idMap
      newEntry[newKey] = entry[key];
    });
  
    // Substitute merchant value if it exists in the merchant map
    if (entry.merchant) {
      newEntry.merchant = merchantMap[entry.merchant] || entry.merchant;
    }
  
    return newEntry;
  });


        let charfiles:any = [];

        if(finedChartData){
        charfiles=Array.from(new Set(
            finedChartData.flatMap((data: any) =>
                Object.keys(data)
                .filter((key) => key !== 'merchant')
            )
        )).map((key,index) => ({ name: key, color: arrayOfColors[index] }));
        }

        console.log(charfiles);
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
                {merchants && merchants.map((data: IMerchant, index:number ) => (
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
        <div className="mt-20 mb-20 w-8/12 place-self-center">
            {
                chartData?.length === 0 ? <h1>You will see sales chart here when you have sells. and to be able to sell you need to create mercahnts</h1> : 
                <div>
                    <BarChart 
                        dataKey="merchant"
                        data={finedChartData}
                        h={300}
                        type="stacked"
                        series={charfiles? charfiles: [{ name: 'No Data'}] }/>
                </div>
            }
        </div>
      
        </>
    )
}
