const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

const getAdminStatus = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({role: 'user'});
        const totalOrders = await Order.countDocuments({});
        const totalProducts = await Product.countDocuments({});

        const orders = await Order.find({});
        const totalRevenueDate = orders.reduce((acc, order) => acc + order.totalAmount, 0);

        res.json({
            totalUsers,
            totalOrders,
            totalProducts,
            totalRevenue: totalRevenueDate
        });



    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAdminStatus };