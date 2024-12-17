import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const changeAvailablity = async (req, res) => {

  try {

    const { docId } = req.body
    const docData = await doctorModel.findById(docId)
    await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
    res.json({ success: true, message: 'Availablity Changed ' })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }

}

const doctorList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const speciality = req.query.speciality; 
    let query={};
    if(speciality){
      query.speciality=speciality;
    }
    console.log("22", req.query);
    const totalCount = await doctorModel.countDocuments(query);
    const doctors = await doctorModel.find(query).select(['-password', '-email']).skip(skip).limit(limit);
    res.json({ success: true, doctors, numberOfDoctors:totalCount })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }

}

const doctorLogin=async(req,res)=>{
  try {
    const { email, password } = req.body
    const doctor = await doctorModel.findOne({ email })
    if (!doctor) {
      return res.json({ success: false, message: 'Doctor does not exist' })
    }

    const isMatch = await bcrypt.compare(password, doctor.password)
    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
      res.json({ success: true, token })
    } else {
      res.json({ success: false, message: 'Invalid Credentials' })
    }

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}
export { changeAvailablity, doctorList, doctorLogin }