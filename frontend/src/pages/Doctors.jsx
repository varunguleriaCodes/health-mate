import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
console.log("backendUrl", import.meta.env);
const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  const { numberOfDoctors } = useContext(AppContext);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isDisabled, setIsDisabled] = useState(false);
  const [currentCat, setCurrentCat] = useState();

  const applyFilter = async (category_speciality = '', newPage = 1) => {
    setCurrentCat(category_speciality);

    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/list?speciality=${category_speciality}&page=${newPage}&limit=${limit}`
      );

      if (data.success) {
        // Append new data on pagination
        setFilterDoc(newPage === 1 ? data.doctors : [...filterDoc, ...data.doctors]);

        // Check if there are more doctors to fetch
        const isLastPage = data.numberOfDoctors <= newPage * limit;
        setIsDisabled(isLastPage);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if(numberOfDoctors<= page * limit) setIsDisabled(true);
    console.log("doctors.numberOfDoctors",doctors);
    console.log("page",page);
    console.log("limit",limit);
    console.log("isDisabled",isDisabled);
    if (speciality) {
      applyFilter(speciality, page);
    }
    if (doctors && !speciality) {
      setFilterDoc(doctors);
    }
  }, [doctors, speciality]);

  return (
    <div className="md:mx-20 mt-12">
      <h2 className="text-black-600 text-4xl text-center font-bold py-6">Browse Doctors</h2>

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? 'bg-primary text-white' : ''
          }`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filters
        </button>

        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          {['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist'].map(
            (category) => (
              <p
                key={category}
                onClick={() => {
                  const isSameSpeciality = speciality === category;
                  navigate(isSameSpeciality ? '/doctors' : `/doctors/${category}`);
                  setPage(1); // Reset page on category change
                  setLimit(10);
                  applyFilter(category, 1);
                }}
                className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                  speciality === category ? 'bg-indigo-100 text-black' : ''
                }`}
              >
                {category}
              </p>
            )
          )}
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
  {filterDoc.length > 0 ? (
    filterDoc.map((item, index) => (
      <div
        onClick={() => navigate(`/appointment/${item._id}`)}
        className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
        key={index}
      >
        <img className="bg-blue-50" src={item.image} alt="" />
        <div className="p-4">
          <div className="flex items-center gap-2 text-sm text-center text-green-500">
            <p className="w-2 h-2 bg-green-500 rounded-full"></p>
            <p>Available</p>
          </div>
          <p className="text-gray-900 text-lg font-medium">{item.name}</p>
          <p className="text-gray-600 text-sm">{item.speciality}</p>
        </div>
      </div>
    ))
  ) : (
    <div className="col-span-3 flex justify-center items-center p-6">
      <p className="text-center text-lg text-gray-600">
        We are adding more doctors, please check back later.
      </p>
    </div>
  )}
</div>



      </div>

      <div className="flex justify-center p-6">
  {filterDoc.length > 0 && (
    <button
      className="bg-primary hover:bg-primary text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-primary rounded"
      disabled={isDisabled}
      onClick={() => {
        const nextPage = page + 1;
        setPage(nextPage);
        applyFilter(currentCat, nextPage);
      }}
      style={{ opacity: isDisabled ? 0.6 : 1 }}
    >
      See More
    </button>
  )}
</div>

    </div>
  );
};

export default Doctors;
