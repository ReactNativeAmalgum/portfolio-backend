import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser'; // Middleware to parse incoming request bodies
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to parse JSON and URL-encoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define default port
const PORT = process.env.PORT || 5000;

// Define an API endpoint for sending an email
app.post('/api/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    // Debugging: Check the received values from the request
    console.log(`Received message: ${message}, from: ${name}, email: ${email}`);

    try {
        // Configure Nodemailer transporter using Gmail service
        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can use Gmail or another service here
            auth: {
                user: process.env.EMAIL_USER,  // Email from .env (sender email)
                pass: process.env.EMAIL_PASS,  // Password from .env (either app password or Gmail password)
            }
        });

        // Set up the email options
        const mailOptions = {
            from: email, // Sender's email
            to: process.env.RECIPIENT_EMAIL, // Recipient's email
            subject: `New message from ${name}`, // Subject line
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <title>Mukund Sharma</title>
                  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                  <meta name="viewport" content="width=device-width,initial-scale=1">
                  <meta http-equiv="X-UA-Compatible" content="IE=edge">
                </head>
                <body style="margin:0!important;padding:0!important;background-color:#eee" bgcolor="#eeeeee">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#fff">
                    <tr>
                      <td align="center">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px">
                          <tr>
                            <td align="center" valign="top" style="padding:10px" bgcolor="#FFD44C">
                              <a href="tel:+91 986745454" style="text-decoration:none;color:#000;font-size:16px">
                                Lead generated for just Mukund Sharma
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" valign="top" style="padding:15px" bgcolor="#fff">
                              <img style="width:100%;height:120px" src="image_url" alt="">
                            </td>
                          </tr>
                          <tr>
                            <td align="center" valign="top" bgcolor="#FFD44C">
                              <h1>Client Enquiry Details</h1>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" valign="top" style="padding:0 35px 35px 35px;">
                              <table width="100%" align="center">
                                <tr>
                                  <td align="left" valign="top">
                                    <p>Customer First Name: ${name}</p>
                                    <p>Customer Email: ${email}</p>
                                    <p>Customer Message: ${message}</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" bgcolor="#FFD44C" style="padding:10px 0">
                              <p style="color:#000;font-weight:500;font-size:1rem;padding:0;margin:0">Mukund Sharma</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
              </html>
            `
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        res.status(200).send('Message sent successfully');
    } catch (error) {
        // If there's an error, log it and send a response back to client
        console.error('Error sending message:', error);
        res.status(500).send('Error sending message');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
