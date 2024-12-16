import React, { useState } from "react";

const PaymentGateway = ({ isOpen, onClose, onPaymentSuccess }) => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };
  
  const validateForm = () => {
    const newErrors = {};
    const cardNumberRegex = /^\d{16}$/;
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvvRegex = /^\d{3}$/;

    if (!cardNumberRegex.test(cardDetails.cardNumber)) {
      newErrors.cardNumber = "Card number must be 16 digits.";
    }
    if (!cardDetails.cardHolder.trim()) {
      newErrors.cardHolder = "Card holder name is required.";
    }
    if (!expiryDateRegex.test(cardDetails.expiryDate)) {
      newErrors.expiryDate = "Expiry date must be in MM/YY format.";
    }
    if (!cvvRegex.test(cardDetails.cvv)) {
      newErrors.cvv = "CVV must be 3 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Payment successful with:", cardDetails);
      onPaymentSuccess(true); // Notify parent of success
    }
  };

  if (!isOpen) return null; // Prevent rendering if not open

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-800 bg-opacity-50"
      onClick={onClose} // Close modal on backdrop click
    >
      <div
        className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">
          Payment Gateway
        </h2>
        <p className="text-gray-500 mb-4">This is a dummy payment gateway.</p>
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <input
              type="text"
              name="cardNumber"
              value={cardDetails.cardNumber}
              onChange={handleInputChange}
              className={`mt-1 block w-full border rounded px-3 py-2 ${
                errors.cardNumber ? "border-red-500" : ""
              }`}
              placeholder="1234 5678 9012 3456"
              maxLength={16}
              required
            />
            {errors.cardNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Card Holder
            </label>
            <input
              type="text"
              name="cardHolder"
              value={cardDetails.cardHolder}
              onChange={handleInputChange}
              className={`mt-1 block w-full border rounded px-3 py-2 ${
                errors.cardHolder ? "border-red-500" : ""
              }`}
              placeholder="John Doe"
              required
            />
            {errors.cardHolder && (
              <p className="text-red-500 text-sm mt-1">{errors.cardHolder}</p>
            )}
          </div>

          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="text"
                name="expiryDate"
                value={cardDetails.expiryDate}
                onChange={handleInputChange}
                className={`mt-1 block w-full border rounded px-3 py-2 ${
                  errors.expiryDate ? "border-red-500" : ""
                }`}
                placeholder="MM/YY"
                required
              />
              {errors.expiryDate && (
                <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                CVV
              </label>
              <input
                type="password"
                name="cvv"
                value={cardDetails.cvv}
                onChange={handleInputChange}
                className={`mt-1 block w-full border rounded px-3 py-2 ${
                  errors.cvv ? "border-red-500" : ""
                }`}
                placeholder="123"
                maxLength={3}
                required
              />
              {errors.cvv && (
                <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded mt-4 hover:bg-primary-dark"
          >
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentGateway;
