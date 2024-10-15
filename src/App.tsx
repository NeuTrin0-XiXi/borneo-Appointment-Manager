import React, { useState } from 'react'
import './App.css'
import AppointmentCalendar from './pages/calendar';
import { ToastContainer, toast } from 'react-toastify';
import LoginPage from './pages/loginPage';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  const [user, setUser] = useState<{ email: string, name: string }>()

  const loginUser = (email: string, name: string) => {
    setUser({ email, name })
    toast(`Welcome ${name}`, {
      position: "top-center"
    })
  }

  return (
    <div>
      {/* Non-navigating page switch */}
      {
        user ?
          <AppointmentCalendar user={user} />
          : <LoginPage loginUser={loginUser} />
      }

      {/*Container for notification effects  */}
      <ToastContainer
        position='top-center'
        autoClose={3000}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default App;
