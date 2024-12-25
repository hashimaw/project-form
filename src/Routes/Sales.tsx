import { Button, Center } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";
import SellProductsForm from "../Components/SellproductForm";

export default function Sales(){
      const [opened, { open, close }] = useDisclosure(false);
    return(
        <>
       <Button onClick={open} variant='outline'  >
            sell Product
        </Button>
        <SellProductsForm opened={opened} onClose={close}/>
        </>
    )
}
