import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const MyAppointments = () => {

  const { backendUrl, token, getDoctorsData } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + ' ' + months[Number(dateArray[1])] + ' ' + dateArray[2]
  }

  const getUserAppointments = async () => {
    try {

      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })

      if (data.success) {
        setAppointments(data.appointments.reverse())
        console.log(data.appointments)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  }

  const cancelAppointment = async (appointmentId) => {

    try {

      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })

      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  } 
  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 w-full flex justify-center">My Appointments</h1>
      <div className="space-y-4">
        {appointments.map((item,index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg flex items-center p-4"
          >
             <div>
              <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
             </div>
            <div className="ml-4 flex-1">
              <h2 className="text-lg font-bold mb-1">{item.docData.name} | {item.docData.speciality}</h2>
              <p className="text-sm text-gray-600"> Date: {slotDateFormat(item.slotDate)}</p>
              <p className="text-sm text-gray-600"> Time Slot: {item.slotTime}</p>
              <p className="text-sm text-gray-600">Address: {item.docData.address.line1}, {item.docData.address.line2}</p>
            </div>
            {!item.cancelled && <button onClick={() => cancelAppointment(item._id)} className='text-sm text-stone-500 sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel Appointment</button>}
            {item.cancelled && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment Cancelled</button>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments