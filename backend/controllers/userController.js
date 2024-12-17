import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import userModel from '../models/userModel.js'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import nodemailer from 'nodemailer';
// API to register user
const registerUser = async (req, res) => {

  try {

    const { name, email, password } = req.body

    if (!name || !password || !email) {
      return res.json({ success: false, message: 'Missing Details' })
    }

    // validating email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Enter a valid email' })
    }

    // validating strong password
    if (password.length < 8) {
      return res.json({ success: false, message: 'enter a strong password' })
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const userData = {
      name, email, password: hashedPassword
    }

    const newUser = new userModel(userData)
    const user = await newUser.save()

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    res.json({ success: true, token })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }

}

// API for user login
const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body
    const user = await userModel.findOne({ email })

    if (!user) {
      return res.json({ success: false, message: 'User does not exist' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
      res.json({ success: true, token })
    } else {
      res.json({ success: false, message: 'Invalid Credentials' })
    }

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }

}

// API to get user profile data
const getProfile = async (req, res) => {

  try {

    const { userId } = req.body
    const userData = await userModel.findById(userId).select('-password')

    res.json({ success: true, userData })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }

}

// API to update user profile
const updateProfile = async (req, res) => {

  try {

    const { userId, name, phone, address, dob, gender } = req.body
    const imageFile = req.file

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: 'Data Missing' })
    }

    await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

    if (imageFile) {

      // upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
      const imageURL = imageUpload.secure_url

      await userModel.findByIdAndUpdate(userId, { image: imageURL })
    }

    res.json({ success: true, message: 'Profile Updated' })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }

}

// API to book appointment
const bookAppointment = async (req, res) => {

  try {

    const { userId, docId, slotDate, slotTime } = req.body

    const docData = await doctorModel.findById(docId).select('-password')

    if (!docData.available) {
      return res.json({ success: false, message: 'Doctor not available' })
    }

    let slots_booked = docData.slots_booked

    // checking for slot availablity
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: 'Slot not available' })
      } else {
        slots_booked[slotDate].push(slotTime)
      }
    } else {
      slots_booked[slotDate] = []
      slots_booked[slotDate].push(slotTime)
    }

    const userData = await userModel.findById(userId).select('-password')

    delete docData.slots_booked

    const appointmentData = {
      userId, docId,
      userData, docData,
      amount: docData.fees,
      slotTime, slotDate,
      date: Date.now()
    }

    const newAppointment = new appointmentModel(appointmentData)
    await newAppointment.save()

    // save new slots data in docData
    await doctorModel.findByIdAndUpdate(docId, { slots_booked })
    await sendAppointment(docData.email,slotTime,slotDate,userId).catch();
    res.json({ success: true, message: 'Appointment Booked' })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }

}

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {

  try {

    const { userId } = req.body
    const appointments = await appointmentModel.find({ userId })

    res.json({ success: true, appointments })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }

}

// API to cancel appointment
const cancelAppointment = async (req, res) => {

  try {

    const { userId, appointmentId } = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)

    // verify appointment user
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: 'Unauthorized action' })
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

    // releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData
    const doctorData = await doctorModel.findById(docId)
    let slots_booked = doctorData.slots_booked

    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

    await doctorModel.findByIdAndUpdate(docId, { slots_booked })
    await cancelAppointmentMail(doctorData.email, slotTime, slotDate, userId).catch();
    res.json({ success: true, message: 'Appointment Cancelled' })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }

}
const sendAppointment = async (doctorEmail, slotTime, slotDate, uniqueId) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.Email, // Your Gmail email address
        pass: process.env.password, // Your Gmail app password
      },
    });

    // Compose the email
    const info = await transporter.sendMail({
      from: process.env.Email, // sender address
      to: doctorEmail, // dynamically set doctor email
      subject: "Appointment Confirmation", // Subject line
      text: `Hello, 
      
      You have a new appointment scheduled.

      Details:
      - Slot Time: ${slotTime}
      - Slot Date: ${slotDate}
      - Unique ID: ${uniqueId}

      Thank you,
      Healthmate Team`, // plain text body
            html: `<p>Hello,</p>
      <p>You have a new appointment scheduled.</p>
      <p><strong>Details:</strong></p>
      <ul>
        <li><strong>Slot Time:</strong> ${slotTime}</li>
        <li><strong>Slot Date:</strong> ${slotDate}</li>
        <li><strong>Unique ID:</strong> ${uniqueId}</li>
      </ul>
      <p>Thank you,</p>
      <p><strong>Healthmate Team</strong></p>`, // HTML body
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
const cancelAppointmentMail = async (doctorEmail, slotTime, slotDate, uniqueId) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.Email, // Your Gmail email address
        pass: process.env.password, // Your Gmail app password
      },
    });

    // Compose the email
    const info = await transporter.sendMail({
      from: process.env.Email, // sender address
      to: doctorEmail, // dynamically set doctor email
      subject: "Appointment Cancelled", // Subject line
      text: `Hello, 
      
      The following appointment is canceled.

      Details:
      - Slot Time: ${slotTime}
      - Slot Date: ${slotDate}
      - Unique ID: ${uniqueId}

      Thank you,
      Healthmate Team`, // plain text body
            html: `<p>Hello,</p>
      <p>The following appointment is canceled.</p>
      <p><strong>Details:</strong></p>
      <ul>
        <li><strong>Slot Time:</strong> ${slotTime}</li>
        <li><strong>Slot Date:</strong> ${slotDate}</li>
        <li><strong>Unique ID:</strong> ${uniqueId}</li>
      </ul>
      <p>Thank you,</p>
      <p><strong>Healthmate Team</strong></p>`, // HTML body
    });

  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment }