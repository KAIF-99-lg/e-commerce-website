import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
  try {
    const { orderId, items, amount, address } = orderDetails;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Order Confirmation - #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Order Confirmation</h2>
          <p>Thank you for your order! Here are the details:</p>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Order #${orderId}</h3>
            <p><strong>Total Amount:</strong> ₹${amount}</p>
            
            <h4>Items Ordered:</h4>
            <ul>
              ${items.map(item => `<li>${item.name} - Quantity: ${item.quantity}</li>`).join('')}
            </ul>
            
            <h4>Delivery Address:</h4>
            <p>
              ${address.firstName} ${address.lastName}<br>
              ${address.street}<br>
              ${address.city}, ${address.state} ${address.zipcode}<br>
              ${address.country}<br>
              Phone: ${address.phone}
            </p>
          </div>
          
          <p>We'll send you another email when your order ships.</p>
          <p>Thank you for shopping with us!</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent to:', userEmail);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
};

export { sendOrderConfirmationEmail };