import '@mantine/core/styles.css';
import PageRouter from './PageRouter';
import Navbar from './Navbar';
import '@mantine/carousel/styles.css';
import '@mantine/dates/styles.css';

function App() {

  return (
    <>
    <div className='mx-auto max-w-screen-2xl px-5 xs:px-10 sm:px-12 md:px-12 xl:px-24'>
      <Navbar/>
      <PageRouter/>
    </div>
    </>
  )
}

export default App
