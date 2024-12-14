import React from 'react'
import { assets } from '../assets/assets_frontend/assets'
import { FaArrowRight } from "react-icons/fa";
const Header = () => {
  return (
    <div className='flex flex-col md:flex-row flex-wrap rounded-lg px-6 md:px-10 lg:px-20' style={{marginTop:"-80px"}}>
      {/* ---------- Left Side ---------- */}
      <div className='md:w-2/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[30px]'>
        <p className='text-3xl md:text-4xl lg:text-5xl text-black font-semibold leading-tight md:leading-tight lg:leading-tight'>Book Appointments <br /> With Trusted Doctors</p>
        <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light'>
          <img className='w-28' src={assets.group_profiles} alt="" />
          <p className='text-black'>Browse through extensive list of doctors, <br className='hidden sm:block' /> schedule your appointment hassle-free.</p>
        </div>
        <a 
          className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full text-sm m-auto md:m-2 hover:bg-gray-800 hover:scale-105 transition-all duration-300" 
          href="#speciality"
          >
          Book Appointment
          <FaArrowRight />
          </a>

      </div>

      {/* ----------Right Side ---------- */}
      <div className='md:w-1/2 relative'>
        <img className='w-full md:absolute bottom-0 h-auto rounded-lg' src={assets.header_img} alt="" />
      </div>

    </div>
  )
}

export default Header