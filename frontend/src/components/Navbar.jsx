import React, { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets_frontend/assets'
import { AppContext } from '../context/AppContext';
import GitHubIcon from './github';
const Navbar = () => {

  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext)
  const [showMenu, setShowMenu] = useState(false);

  const logout = () => {
    setToken(false)
    localStorage.removeItem('token')
  }

  return (
    <>
    <div className="sticky top-0 z-50">
      <div className="flex h-14 w-full mx-auto items-center justify-center bg-white/75 backdrop-blur-lg">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between self-center px-4 md:px-8">
          <div className="flex items-center space-x-10">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold tracking-tighter text-black">
                <img
                  onClick={() => navigate("/")}
                  className="w-44 cursor-pointer"
                  src={assets.logo}
                  alt="Healthmate"
                />
              </span>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <a
                className="group inline-flex h-10 w-max items-center justify-center rounded-md px-2.5 py-1 font-medium transition-colors hover:bg-accent hover:!text-black focus:bg-accent focus:!text-black focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer"
                href="/"
              >
                <span className="relative z-[2] flex items-center gap-1">
                  <span>HOME</span>
                </span>
              </a>
              <a
                className="group inline-flex h-10 w-max items-center justify-center rounded-md px-2.5 py-1 font-medium transition-colors hover:bg-accent hover:!text-black focus:bg-accent focus:!text-black focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer"
                onClick={() => navigate('/doctors')}
              >
                <span className="relative z-[2] flex items-center gap-1">
                  <span>DOCTORS</span>
                </span>
              </a>
              <a
                className="group inline-flex h-10 w-max items-center justify-center rounded-md px-2.5 py-1 font-medium transition-colors hover:bg-accent hover:!text-black focus:bg-accent focus:!text-black focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer"
                onClick={() => navigate('/about')}
              >
                <span className="relative z-[2] flex items-center gap-1">
                  <span>ABOUT</span>
                </span>
              </a>
              <a
                className="group inline-flex h-10 w-max items-center justify-center rounded-md px-2.5 py-1 font-medium transition-colors hover:bg-accent hover:!text-black focus:bg-accent focus:!text-black focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer"
                onClick={() => navigate('/contact')}
              >
                <span className="relative z-[2] flex items-center gap-1">
                  <span>CONTACT</span>
                </span>
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2 justify-self-end">
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-10 w-max items-center justify-center rounded-md px-2.5 py-1 font-medium transition-colors hover:bg-accent hover:!text-black focus:bg-accent focus:!text-black focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50" style={{background:"#eaeaea"}}
              href="https://github.com/varunguleriaCodes/health-mate"
            >
              <GitHubIcon className="mr-2 h-6 w-6 group-hover:text-black" />1
            </a>
            <a
              className="group inline-flex h-10 w-max items-center justify-center rounded-md px-2.5 py-1 font-medium transition-colors hover:bg-accent hover:!text-black focus:bg-accent focus:!text-black focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
              href="/login"
            >
              <span className="relative z-[2] flex items-center gap-1">
              {
           token && userData
             ? <div className='flex items-center gap-2 cursor-pointer group relative'>
               <img className='w-8 rounded-full' src={userData.image} alt="" />
               <img className='w-2.5' src={assets.dropdown_icon} alt="" />
               <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                 <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                   <p onClick={(event) => {event.preventDefault();navigate('/my-profile')}} className='hover:text-black cursor-pointer'>My Profile</p>
                   <p onClick={(event) => {event.preventDefault();navigate('/my-appointments')}} className='hover:text-black cursor-pointer'>My Appointments</p>
                   <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                 </div>
               </div>
             </div>
             : <button onClick={() => navigate('/login')} className='text-white px-8 py-3 font-light hidden md:block rounded' style={{background:"#332D2D"}}>Create Account</button>
         }

              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </>
  )
}

export default Navbar