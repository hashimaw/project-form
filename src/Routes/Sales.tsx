import { Button } from "@mantine/core"
import AddProductForm from "../Components/AddProductForm"
import { useDisclosure } from "@mantine/hooks";
export default function Sales(){
      const [opened, { open, close }] = useDisclosure(false);
    return(
        <>
       <Button onClick={open} variant='outline'  >
            Add Product
        </Button>
        <AddProductForm opened={opened} onClose={close}/>
        </>
    )
}
