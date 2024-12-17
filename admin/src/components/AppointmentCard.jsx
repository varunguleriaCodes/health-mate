import React from 'react';

const AppointmentCard = ({ booking }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <p className="font-semibold text-lg">{booking.userName}</p>
      <p className="text-sm text-gray-500">{booking.userEmail}</p>
      <p className="text-sm mt-1">Booking ID: {booking.bookingId}</p>
      <p className="text-sm mt-1">Time: {new Date(booking.slotTime).toLocaleTimeString()}</p>
    </div>
  );
};

export default AppointmentCard;
