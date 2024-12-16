import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets_frontend/assets';
import { toast } from 'react-toastify';
import axios from 'axios';

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();

      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address));
      formData.append('gender', userData.gender);
      formData.append('dob', userData.dob);

      image && formData.append('image', image);

      const { data } = await axios.post(
        backendUrl + '/api/user/update-profile',
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen py-12">
      {userData && (
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-3">
            <label
              htmlFor="image"
              className="relative group cursor-pointer transition-transform hover:scale-105"
            >
              <img
                className="w-36 h-36 rounded-full object-cover border-4 border-gray-200"
                src={image ? URL.createObjectURL(image) : userData.image}
                alt="Profile"
              />
              {isEdit && (
                <div className="absolute bottom-2 right-2 bg-gray-800 bg-opacity-75 p-2 rounded-full">
                  <img
                    src={assets.upload_icon}
                    className="w-6 h-6 text-white"
                    alt="Upload"
                  />
                </div>
              )}
              <input
                type="file"
                id="image"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
            <div>
              {isEdit ? (
                <input
                  type="text"
                  className="text-center text-2xl font-semibold border-b border-gray-300 focus:outline-none"
                  value={userData.name}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              ) : (
                <p className="text-2xl font-semibold">{userData.name}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-6">
            <p className="text-gray-500 font-semibold uppercase mb-3">
              Contact Information
            </p>
            <div className="grid grid-cols-2 gap-y-4 text-gray-700">
              <div className="font-medium">Email:</div>
              <div className="text-primary">{userData.email}</div>

              <div className="font-medium">Phone:</div>
              {isEdit ? (
                <input
                  type="text"
                  className="border border-gray-300 px-2 py-1 rounded focus:outline-none"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              ) : (
                <div>{userData.phone}</div>
              )}

              <div className="font-medium">Address:</div>
              {isEdit ? (
                <div>
                  <input
                    type="text"
                    className="border border-gray-300 px-2 py-1 rounded mb-2 w-full focus:outline-none"
                    value={userData.address.line1}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                  />
                  <input
                    type="text"
                    className="border border-gray-300 px-2 py-1 rounded w-full focus:outline-none"
                    value={userData.address.line2}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                  />
                </div>
              ) : (
                <div>
                  <p>{userData.address.line1}</p>
                  <p>{userData.address.line2}</p>
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="mt-6">
            <p className="text-gray-500 font-semibold uppercase mb-3">
              Basic Information
            </p>
            <div className="grid grid-cols-2 gap-y-4 text-gray-700">
              <div className="font-medium">Gender:</div>
              {isEdit ? (
                <select
                  className="border border-gray-300 px-2 py-1 rounded focus:outline-none"
                  value={userData.gender}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      gender: e.target.value,
                    }))
                  }
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                <div>{userData.gender}</div>
              )}

              <div className="font-medium">Birthday:</div>
              {isEdit ? (
                <input
                  type="date"
                  className="border border-gray-300 px-2 py-1 rounded focus:outline-none"
                  value={userData.dob}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      dob: e.target.value,
                    }))
                  }
                />
              ) : (
                <div>{userData.dob}</div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center mt-8">
            {isEdit ? (
              <button
                className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary transition-all duration-300"
                onClick={() => updateUserProfileData()}
              >
                Save Information
              </button>
            ) : (
              <button
                className="px-6 py-2 border border-primary text-blue-500 rounded-full hover:bg-primary hover:text-white transition-all duration-300"
                onClick={() => setIsEdit(true)}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
