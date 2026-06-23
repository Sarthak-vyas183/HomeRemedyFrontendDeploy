import './App.css'
import Nav from './components/layout/nav'
import Router from './components/Router/router'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className='overflow-x-hidden min-h-screen bg-[#fafff5]'>
      <ToastContainer
        autoClose={2500}
        position="top-right"
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        toastClassName="!rounded-xl !shadow-card"
      />
      <Nav />
      <Router />
    </div>
  )
}

export default App
