import mongoose from 'mongoose'
import User, { UserRole } from './src/models/User'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

async function createTestUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI!)

    // Create manager
    const managerExists = await User.findOne({ email: 'manager@gmail.com' })
    if (!managerExists) {
      const hashedPassword = await bcrypt.hash('Manager@123', 10)
      await User.create({
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'manager@gmail.com',
        password: hashedPassword,
        role: UserRole.MANAGER,
        isVerified: true,
      })
      console.log('Manager created: manager@gmail.com / Manager@123')
    } else {
      if (!managerExists.isVerified) {
        managerExists.isVerified = true
        await managerExists.save()
      }
      console.log('Manager already exists')
    }

    // Create employee
    const employeeExists = await User.findOne({ email: 'employee@gmail.com' })
    if (!employeeExists) {
      const hashedPassword = await bcrypt.hash('Employee@123', 10)
      await User.create({
        firstName: 'Rohan',
        lastName: 'Mehta',
        email: 'employee@gmail.com',
        password: hashedPassword,
        role: UserRole.EMPLOYEE,
        isVerified: true,
      })
      console.log('Employee created: employee@gmail.com / Employee@123')
    } else {
      if (!employeeExists.isVerified) {
        employeeExists.isVerified = true
        await employeeExists.save()
      }
      console.log('Employee already exists')
    }

    await mongoose.disconnect()
  } catch (error) {
    console.error('Error:', error)
  }
}

createTestUsers()
