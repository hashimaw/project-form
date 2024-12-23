import { Link } from "react-router-dom"
export default function Navbar(){
    return(
        <>
        <div className="flex gap-10 place-self-center bg-orange-400 text-white p-5 font-semibold text-2xl ">
            <Link to='/'><div>Products</div></Link>
            <Link to='/sales'><div>Sales</div></Link>
        </div>
        </>
    )
}