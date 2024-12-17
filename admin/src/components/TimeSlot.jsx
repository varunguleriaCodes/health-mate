import React from 'react';
import AppointmentCard from './AppointmentCard';

const TimeSlotSection = ({ slotTime, appointments }) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold">{new Date(slotTime).toLocaleTimeString()}</h3>
      <div className="mt-4">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <AppointmentCard key={appointment.bookingId} booking={appointment} />
          ))
        ) : (
          <p className="text-sm text-gray-500">No appointments for this slot.</p>
        )}
      </div>
    </div>
  );
};

export default TimeSlotSection;
