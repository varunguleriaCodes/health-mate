import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets_frontend/assets'
import RelatedDoctor from '../components/RelatedDoctor'
import { toast } from 'react-toastify'
import axios from 'axios'
import PaymentGateway from '../components/Payment'
const Appointment = () => {

  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const navigate = useNavigate()
  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // Tracks success value

  const handlePaymentSuccess = (status) => {
    setPaymentStatus(status);
    setIsModalOpen(false); // Close the modal after payment
    bookAppointment();
  };
  const getAvailableSlots = async () => {
    setDocSlots([])

    // getting current date
    let today = new Date()
    for (let i = 0; i < 7; i++) {
      // getting date with index
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      // setting end time of the date with index
      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)

      // setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots = []

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()

        const slotDate = day + '_' + month + '_' + year
        const slotTime = formattedTime

        const isSlotAvailable = docInfo?.slots_booked[slotDate] && docInfo?.slots_booked[slotDate]?.includes(slotTime) ? false : true

        if (isSlotAvailable) {
          // add slot to array
          timeSlots.push({ datetime: new Date(currentDate), time: formattedTime })
        }

        // Increment current time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      setDocSlots(prev => ([...prev, timeSlots]))
    }
  }

  const bookAppointment = async () => {

    if (!token) {
      toast.warn('Login to book appointment')
      return navigate('/login')
    }

    try {

      const date = docSlots[slotIndex][0].datetime

      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()

      const slotDate = day + '_' + month + '_' + year

      const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } })

      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchDocInfo(docInfo)
  }, [doctors, docId])

  useEffect(() => {
    getAvailableSlots()
  }, [docInfo])

  useEffect(() => {
    console.log(docSlots)
    if(docSlots.length > 0){
    const now = new Date(); // Current date and time
    const eveningTime = new Date();
    eveningTime.setHours(20, 30, 0, 0); // 8:30 PM (20:30:00)
    if(now > eveningTime) setSlotIndex(1);}
  }, [docSlots])
  const scrollLeft=()=> {
    const container = document.getElementById('scrollable-container');
    container.scrollBy({ left: -150, behavior: 'smooth' }); // Adjust scroll amount as needed
  }
  
  const scrollRight=()=> {
    const container = document.getElementById('scrollable-container');
    container.scrollBy({ left: 150, behavior: 'smooth' }); // Adjust scroll amount as needed
  }
  
  return docInfo && (
    <div className="md:mx-20 mt-12">
      {/* ---------- Doctor Details ---------- */}
      <div className="flex justify-center mb-6">
       <span className="text-3xl md:text-4xl lg:text-5xl text-black font-semibold leading-tight md:leading-tight lg:leading-tight">Book Appointment</span>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
        </div>

        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          {/* ---------- Doc Info : name, degree, experience ---------- */}
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">{docInfo.name} <img className='w-5' src={assets.verified_icon} alt="" /></p>

          <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>

          {/* ---------- Doctor About ---------- */}
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">About <img src={assets.info_icon} alt="" /></p>
            <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p>
          </div>

          <p className="text-gray-500 font-medium mt-4">Appointment fee: <span className='text-gray-600 font-bold'>{currencySymbol}{docInfo.fees}</span></p>
        </div>
      </div>

      {/* ---------- Booking Slots ---------- */}
      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
        <p>Booking slots</p>

        <div className="flex gap-3 items-center w-3/4 overflow-x-scroll mt-4">
          {
            docSlots.length && docSlots.map((item, index) => (
              item.length>0 &&
              <div onClick={() => setSlotIndex(index)} className={`text-center py-2 px-2 min-w-16 rounded cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`} key={index}>
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}, {item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))
          }
        </div>

  <div className="flex items-center gap-3 w-3/4 overflow-x-scroll mt-8">
  {/* Scrollable Container */}
    <div id="scrollable-container" className="flex items-center gap-3 overflow-x-scroll scroll-smooth">
      {
        docSlots.length && docSlots[slotIndex].map((item, index) => (
          <p 
            onClick={() => setSlotTime(item.time)} 
            className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`} 
            key={index}
          >
            {item.time.toLowerCase()}
          </p>
        ))
      }
    </div>
  </div>

  <div className='flex justify-center mt-4' style={{marginLeft:"-50vh"}}>
  <button 
    onClick={() => scrollLeft()} 
    className="bg-primary hover:bg-primary text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-primary rounded"
  >
    ←
  </button>
  <button 
    onClick={() => scrollRight()} 
    className="bg-primary hover:bg-primary text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-primary rounded ml-2"
  >
    →
  </button>
  </div>
  <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-primary hover:bg-primary text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-primary rounded ml-2"
      >
       Pay Now
      </button>

      {/* <p className="mt-4">Payment Status: {paymentStatus ? "Success" : "Pending"}</p> */}

      {isModalOpen && (
        <PaymentGateway
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
       {/* <PaymentGateway/> */}
        {/* <button onClick={bookAppointment} className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6">Book an appointment</button> */}
      </div>

      {/* Listing Related Doctors */}
      <RelatedDoctor docId={docId} speciality={docInfo.speciality} />

    </div>
  )
}

export default Appointment