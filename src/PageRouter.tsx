import { Route, Routes } from 'react-router-dom';
import Products from './Routes/Products';
import Sales from './Routes/Sales';
import Merhcants from './Routes/Merchants';
import { ProductDetails } from './Routes/ProductDetails';
export default function PagesRouter(){

    return(
        <>
        <Routes>
          <Route path="/" element = {<Products />} />
          <Route path="/sales" element = {<Sales/>} />
          <Route path='/details/:id' element = { <ProductDetails/>} />
          <Route path='/merchants' element = {<Merhcants/>} />
        </Routes>
        </>
    )
}
