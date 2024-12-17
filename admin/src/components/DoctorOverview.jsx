import React from 'react';

const DoctorOverview = ({ doctor }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold">{doctor.name}</h2>
      <p className="text-lg text-gray-600">{doctor.specialization}</p>
      <p className="text-sm text-gray-500 mt-2">{doctor.profileDescription}</p>
    </div>
  );
};

export default DoctorOverview;
