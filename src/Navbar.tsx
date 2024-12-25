import { Link } from "react-router-dom"
export default function Navbar(){
    return(
        <>
        <div className="flex mt-2 gap-5 place-self-center border-2 border-gray-500 rounded-xl text-white p-2 font-semibold text-2xl ">
            <Link to='/'><div className="p-3 hover:bg-yellow-500 bg-orange-400">Products</div></Link>
            <Link to='/sales'><div className="p-3 hover:bg-yellow-500 bg-orange-400">Sales</div></Link>
        </div>
        </>
    )
}