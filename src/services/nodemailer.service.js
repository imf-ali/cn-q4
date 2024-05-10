import nodemailer from 'nodemailer';

const nodemailerHelper = async (recipient, message) => {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'codingninjas2k16@gmail.com', 
        pass: 'slwvvlczduktvhdj', 
      },
    });
  
    await transporter.sendMail({
      from: 'codingninjas2k16@gmail.com', 
      to: recipient, 
      subject: 'Coding Ninjas', 
      html: message,
    });
    console.log('Message sent successfully!');
  } catch (err) {
    console.log(err.message);
  }
};

export default nodemailerHelper;