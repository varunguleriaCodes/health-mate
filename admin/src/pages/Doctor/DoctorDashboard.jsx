import React, { useState, useEffect } from 'react';
import DoctorOverview from '../../../admin/src/components/DoctorOverview';
import TimeSlotSection from '../components/TimeSlot';

const DoctorDashboard = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  
  useEffect(() => {
    // Fetch doctor info and appointments from an API or static data
    const fetchData = async () => {
      const doctor = {
        name: 'Dr. John Doe',
        specialization: 'Cardiologist',
        profileDescription: 'Experienced Cardiologist with 10 years of practice.',
      };
      const appointmentData = [
        { bookingId: '123', userName: 'Alice', userEmail: 'alice@example.com', slotTime: '2024-12-17T09:00:00' },
        { bookingId: '124', userName: 'Bob', userEmail: 'bob@example.com', slotTime: '2024-12-17T09:00:00' },
        { bookingId: '125', userName: 'Charlie', userEmail: 'charlie@example.com', slotTime: '2024-12-17T10:00:00' },
      ];
      setDoctorData(doctor);
      setAppointments(appointmentData);
    };

    fetchData();
  }, []);

  const timeSlots = ['2024-12-17T09:00:00', '2024-12-17T10:00:00', '2024-12-17T11:00:00']; // Sample Time Slots

  const getAppointmentsBySlot = (slotTime) => {
    return appointments.filter((appointment) => appointment.slotTime === slotTime);
  };

  return (
    <div className="container mx-auto p-6">
      {doctorData && <DoctorOverview doctor={doctorData} />}
      
      <div className="mt-8">
        {timeSlots.map((slot) => (
          <TimeSlotSection key={slot} slotTime={slot} appointments={getAppointmentsBySlot(slot)} />
        ))}
      </div>
    </div>
  );
};

export default DoctorDashboard;
