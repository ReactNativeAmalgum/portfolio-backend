import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// app.use('/api/send-email', SendEmail); //remove because vercel has its own /api

app.post('/api/send-email', (req, res) => {
  const { name, email, message } = req.body;
  console.log('Email data:', { name, email, message });
  res.status(200).json({ success: true, message: 'Email sent!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

