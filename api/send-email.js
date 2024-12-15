



import nodemailer from 'nodemailer';
import Cors from 'cors';

// Initialize CORS middleware
const cors = Cors({
  methods: ['POST'], // Only allow POST requests
  origin: '*',       // Replace '*' with your frontend URL for better security // * use for Allow requests from any origin
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  // Run the CORS middleware
  await runMiddleware(req, res, cors);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

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

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Error sending email' });
  }
}
