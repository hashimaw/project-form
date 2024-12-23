import { Button, SimpleGrid, Pagination, Skeleton, Center } from "@mantine/core";
import { IconSquareRoundedPlus } from '@tabler/icons-react';
import AddProductForm from "../Components/AddProductForm";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from '@tanstack/react-query'
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

type Product = {id: string; name: string; description: string; price: number; category: string; tags: string[]; use: string; minimumQuantity: number; sellingPrice: number; addedBy: string; expiresAt: string; quantityOnHand: number; reservedQuantity: number; discount: number; imageUrls: string[]; createdAt: string; updatedAt: string}


export default function Products(){

  const [page, setPage] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);


  const fetchProducts = async (page: number) => {
    const { data } = await axios.get(`https://test-api.nova-techs.com/products`, {
        params: { page },
    });
    return data;
};
    const { isPending, error, data } = useQuery({
        queryKey: ['products', page],
        queryFn: () => fetchProducts(page),
            enabled: true,
        })

      if (isPending) {
        const skeletons = Array.from({ length: 6 }, (_, index) => ( 
          <Skeleton visible={!isPending} key={index}> 
            <Skeleton height={230} width={340} mt={20} radius="xl"/> 
            <Skeleton height={25} width={150} mt={15} ml={5} radius="xl"/> 
            <Skeleton height={15} width={100} mt={10} ml={5} radius="xl"/> 
            <Skeleton height={20} width={120} mt={10} ml={5} radius="xl"/>
          </Skeleton> ));
          return (
              <SimpleGrid
                cols={{ base: 1, sm: 2, lg: 3 }}
                spacing={{ base: 10, sm: 'xl' }}
                verticalSpacing={{ base: 'md', sm: 'xl' }}
              >
              {skeletons}
              </SimpleGrid>
            )}
      
        console.log(data)
      
        if (error) return 'An error has occurred: ' + error.message
    
    return(
        <>
        <Button onClick={open} variant='outline' leftSection={<IconSquareRoundedPlus size={18} />}>
            Add Product
        </Button>
        <AddProductForm opened={opened} onClose={close}/>

        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
          {data.data.map((product: Product) => (
            <Link className='no-underline' to={`/details/${product.id}` } >
            
                <div id={product.id} className='hover:cursor-pointer hover:bg-slate-200 w-fit p-4 rounded-2xl mt-4'>
                <img className='w-80 h-52 object-cover rounded-xl transition-all duration-700 ease-in-out hover:scale-105' src={product.imageUrls[0]} alt="" />
                <h2 className='m-0 text-gray-800'>{product.name}</h2>
                <p className='m-0 text-gray-800'>{product.category}</p>
                <div className='m-0 flex gap-3'><h4 className='line-through text-red-500 m-0 '>{product.price}</h4><h4 className='m-0 text-green-500'>{product.sellingPrice}</h4></div>
                </div>
            </Link>
          ))}
          
        </SimpleGrid>
        <Center my={50}>
          <Pagination total={data.totalPages} value={data.page} onChange={setPage} />
        </Center>
        </>
    )
}
