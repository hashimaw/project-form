import { Button } from "@mantine/core"
import { Link } from "react-router-dom"
export default function Navbar(){
    return(
        <>
        <div className="flex mt-2 gap-5 place-self-center border-2 border-gray-300 rounded-xl text-white p-2 font-semibold text-2xl ">
            <Link to='/'><Button>Products</Button></Link>
            <Link to='/sales'><Button>Sales</Button></Link>
            <Link to='/merchants'><Button>Merchant</Button></Link>
        </div>
        </>
    )
}