import { sendOrderConfirmationEmail } from './services/emailService.js';

const testOrder = {
  orderId: 'TEST123',
  items: [
    { name: 'Test Product', quantity: 2 }
  ],
  amount: 999,
  address: {
    firstName: 'John',
    lastName: 'Doe',
    street: '123 Test St',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipcode: '400001',
    country: 'India',
    phone: '9876543210'
  }
};

sendOrderConfirmationEmail('mdkaif8100@gmail.com', testOrder)
  .then(() => console.log('Test email sent!'))
  .catch(err => console.error('Test failed:', err));