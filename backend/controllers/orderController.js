const Order = require('../models/Order');

const sendEmail = require('../utils/sendEmail');


const createOrder = async (req, res) => {
    try {
        console.log("req.user =", req.user);
        const { items, totalAmount, address, paymentId } = req.body;
        if (!items || items.length === 0 || !totalAmount || !address) {
            return res.status(400).json({ message: 'Invalid order data' });
        }
        else {
            const order = new Order({
                user: req.user._id,
                items,
                totalAmount,
                address,
                paymentId
            });
            await order.save();
            const message = `Dear ${req.user.name},\n\nThank you for your order! your order! Your order has been successfully created with the following details:\n\nOrder Id: ${order._id}\nTotal Amount: $${totalAmount}\nShipping Address: ${address}\n\nWe will notify you once your order is shipped.\n\nBest regards,\nShopNest Team`;




            await sendEmail(req.user.email, 'Order Created', message);
            res.status(201).json({ message: 'Order created successfully', order });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('items.product', 'name price');
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'id name');
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

const updateOrderstatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = status;
            await order.save();
            res.json({ message: 'Order status updated ', order });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
};

module.exports = {
    createOrder,
    myOrders,
    getOrders,
    updateOrderstatus
}