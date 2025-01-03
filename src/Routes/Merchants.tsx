import { Button, Center } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";
import AddMerchantForm from "../Components/AddMerchantForm";
import { IMerchant } from "../interfaces/marchant";
import { useSelector } from 'react-redux';
import { RootState } from "../Redux/store";
import { BarChart } from "@mantine/charts";
import { useEffect, useState } from "react";
import '@mantine/charts/styles.css';
import axios from "axios";

const fetchProducts = async (page: number) => {
    const { data } = await axios.get(`http://localhost:3000/items`, {
        params: { page },
    });
    return data;
};

export default function Merhcants(){
      const [openMerchantForm, { open, close }] = useDisclosure(false);
      const [chartData, setChartData] = useState([] as any);
        const merchants = useSelector((state: RootState) => state.merchant); 
        const sales = useSelector((state: RootState) => state.database);

        const [fetchedProducts, setFetchedProducts] = useState<any[]>();

        useEffect(() => {
            const fetchAndSet = async () => {
                const fetchedProducts = await fetchProducts(1);
                setFetchedProducts(fetchedProducts);
            }

            fetchAndSet();
        }, []);
    //   useEffect(() => {
    //     setChartData(sales.map((sale) => {
    //         const total = sale.orderdItems.reduce((sum, item) => sum + item.quantity * item.sellingPrice, 0);
    //         return {
    //           merchant: merchants.find((merchant) => merchant.id === sale.merchant)?.name,
    //           totalSales: total,
    //         };
    //     }));
    // }, []);
    // console.log(chartData);
      
      
      
      // Transform Data for Bar Chart (Show Each Item's Total Separately)
      useEffect(() => {

        let processedMerchants;

        if (fetchedProducts) {

            console.log(fetchedProducts);
            
            

            processedMerchants = merchants?.map((merchant) => {
                const merchantSales = sales.filter((sale) => sale.merchant === merchant.id);

                let items: string[];

                if (fetchedProducts && fetchedProducts.length) {
                    items = fetchedProducts?.map((item) => item.name);
                }

                const merchantItems = merchants?.map((merchant) => {
                    const m: Record<string, any> = {name: merchant.name, id: merchant.id};

                    for (const item of items) {
                        m[item] = 0;
                    }

                    return m;
                });

                // for (const sale of merchantSales) {
                //     for (const item of sale.orderdItems) {
                //         const itemTotal = item.quantity * item.sellingPrice;
                //         const merchantTotal = merchantItems.find((m) => m.id === sale.merchant);

                //         if (merchantTotal) {
                //             merchantTotal[item.id] += itemTotal;
                //         }
                //     }
                // }
                for (const merchant of merchantItems) {
                    const merchantSales = sales.filter((sale) => sale.merchant === merchant.id);

                    for (const sale of merchantSales) {
                        for (const item of sale.orderdItems) {
                            const itemTotal = item.quantity * item.sellingPrice;
                            const foundItem = fetchedProducts?.find(i => i.id === item.id);
                            if (foundItem) {
                                merchant[foundItem.name] += itemTotal;
                            }
                        }
                }
            }
                // return { merchant: merchant.name, totalSales: merchantTotal };
            });
        }

        // setChartData(
        //     sales.reduce((acc, sale) => {
        //         sale.orderdItems.forEach((item) => {
        //           const itemTotal = item.quantity * item.sellingPrice;
                  
        //           // Check if merchant already exists
        //           let existingMerchant = acc.find((data) => data.merchant === sale.merchant);
                  
        //           if (!existingMerchant) {
        //             // Create new merchant entry
        //             existingMerchant = { merchant: (sale.merchant) };
        //             acc.push(existingMerchant);
        //           }
              
        //           // Add item total under item name (or accumulate if exists)
        //           existingMerchant[item.id] = (existingMerchant[item.id] || 0) + itemTotal;
        //         });
              
        //         return acc;
        //       }, [] as Record<string, any>[])
        // )
        setChartData(processedMerchants);
    
        }, [sales,fetchedProducts]);
// console.log(chartData);
// console.log(  chartData.flatMap((data: any) => 
//     Object.keys(data)
//       .filter((key) => key !== 'merchant')
//       .map((key) => ({ name: key, color: 'teal' }))
//   ));
    //   const barChartData = sales.reduce((acc, sale) => {
    //     sale.orderdItems.forEach((item) => {
    //       const itemTotal = item.quantity * item.sellingPrice;
          
    //       // Check if merchant already exists
    //       let existingMerchant = acc.find((data) => data.merchant === sale.merchant);
          
    //       if (!existingMerchant) {
    //         // Create new merchant entry
    //         existingMerchant = { merchant: sale.merchant };
    //         acc.push(existingMerchant);
    //       }
      
    //       // Add item total under item name (or accumulate if exists)
    //       existingMerchant[item.id] = (existingMerchant[item.id] || 0) + itemTotal;
    //     });
      
    //     return acc;
    //   }, [] as Record<string, any>[]);
      
    //   // Console to check the output
    //   console.log(barChartData);
          
  
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
                {merchants?.map((data: IMerchant , index) => (
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
                chartData?.length === 0 ? <h1>You will see sales chart here when you have sells. and to be able to sell you need to create mercahnts</h1> : 
                <BarChart 
                dataKey="merchant"
                data={chartData}
                h={400}
                type="stacked"
                series={
                    chartData ?? []
                    // .flatMap((data: any) => 
                    //     Object.keys(data)
                    //       .filter((key) => key !== 'merchant')
                    //       .ma    p((key) => ({ name: key }))
                    //   )
                      
                }/>
            }
        </div>
      
        </>
    )
}
