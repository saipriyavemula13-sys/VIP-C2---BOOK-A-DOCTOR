
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Book a Doctor API is running' });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const ensureAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@bookadoctor.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234';

  const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await User.create({
      name: 'System Admin',
      email: adminEmail.toLowerCase(),
      password: hashedPassword,
      phone: '0000000000',
      role: 'admin',
    });
    console.log(`Seeded admin account: ${adminEmail}`);
  }
};

const startServer = async () => {
  await connectDB();
  await ensureAdminUser();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
