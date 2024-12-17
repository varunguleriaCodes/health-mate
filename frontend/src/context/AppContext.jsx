import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify'
import axios from 'axios'

export const AppContext = createContext();

const AppContextProvider = (props) => {

  const currencySymbol = '$'
  const backendUrl = process.env.REACT_APP_BACKEND_URL

  const [doctors, setDoctors] = useState([])
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)
  const [userData, setUserData] = useState(false)
  const [numberOfDoctors,setNumberOfDoctors]=useState(0);
  const getDoctorsData = async () => {

    try {

      const { data } = await axios.get(backendUrl + '/api/doctor/list?page=1&limit=10')
      if (data.success) {
        setDoctors(data.doctors)
        setNumberOfDoctors(data.numberOfDoctors);
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  }

  const loadUserProfileData = async () => {

    try {

      const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })

      if (data.success) {
        setUserData(data.userData)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  }

  const value = {
    doctors, getDoctorsData,
    currencySymbol,
    token, setToken,
    backendUrl,
    userData, setUserData,
    loadUserProfileData,
    numberOfDoctors
  }

  useEffect(() => {
    getDoctorsData()
  }, [])

  useEffect(() => {
    if (token) {
      loadUserProfileData()
    } else {
      setUserData(false)
    }
  }, [token])

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )

}

export default AppContextProvider