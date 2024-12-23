import { Route, Routes } from 'react-router-dom';
import Products from './Routes/Products';
import Sales from './Routes/Sales';
export default function PagesRouter(){

    return(
        <>
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/sales" element={<Sales/>} />
        </Routes>
        </>
    )
}
