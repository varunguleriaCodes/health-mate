import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import DarkMode from '../components/darkMode'
import Testimonials from '../components/Testimonials'
import Faq from '../components/Faq'
const Home = () => {
  return (
    <div>
      <Header />
      <SpecialityMenu />
      <TopDoctors />
      <Testimonials />
      <Faq />
      <Banner />
    </div>
  )
}

export default Home