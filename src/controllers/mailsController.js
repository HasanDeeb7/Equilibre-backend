import nodemailer from 'nodemailer'
import Order from '../models/orderModel.js'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSW,
    },
});

const sendingOrderBYMail = async (userEmail, orderId) => {
    try {
        const order = await Order.findById(orderId).populate('products.product').populate('products.size');

        const mailOptions = {
            from: {
                name: 'Equilibre',
                address: process.env.EMAIL,
            },
            to: userEmail,
            subject: 'Confirmed order',
            html: `
                <html>
                    <body>
                        <div class="email-container">
                            <h1>Your Order Confirmation</h1>
                            <p>Dear Customer,</p>
                            <p>Thank you for your order! Your items are on the way.</p>
                            <p>Order Details:</p>
                            <ul>
                                ${order.products.map(product => {
                                    const size = product.size;
                                    const productTotal = product.quantity * size.price;
                                    return `
                                        <li>
                                            ${product.product.name}-${size.capacity} ${size.unit}: ${product.quantity} x $${size.price.toFixed(2)} (Total: $${productTotal.toFixed(2)})
                                        </li>
                                    `;
                                }).join('')}
                            </ul>
                            <p class="total">Order Total: $${orderTotal(order)}</p>
                            <p>Your order is confirmed, and it will be shipped to the following address:</p>
                            <p class="address">${order.country}-${order.city}, ${order.shippingAddress}</p>
                            <p>If you have any questions or concerns, please contact us.</p>
                            <p class="footer">Thank you for shopping with us!<br />Best regards, The Equilibre Team</p>
                        </div>
                    </body>
                </html>
            `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent successfully:', info.response);
            }
        });
    } catch (error) {
        console.error('Error fetching order information:', error);
    }
};

const orderTotal = (order) => {
    return order.products.reduce((total, product) => {
        const size = product.size;
        const productTotal = product.quantity * size.price;
        return total + productTotal;
    }, 0).toFixed(2);
};

export { sendingOrderBYMail };