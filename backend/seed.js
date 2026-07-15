const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("./model/User");
const Product = require("./model/Product");
const Order = require("./model/Order");

dotenv.config();

const connectDB = async () => {
    try {
        const dns = require("dns");
        dns.setServers(["8.8.8.8", "8.8.4.4"]);
        await mongoose.connect(process.env.MONGO_URI, {
            dbName:"shopnest-mern"
        });
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};





const seedDatabase = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
        console.log("✓ Cleared existing data");

        // Create dummy users
        const hashedPassword = await bcryptjs.hash("password123", 10);
        const users = await User.insertMany([
            {
                name: "Admin User",
                email: "admin@shopnest.com",
                password: hashedPassword,
                role: "admin",
                verified: true
            },
            {
                name: "John Doe",
                email: "john@shopnest.com",
                password: hashedPassword,
                role: "user",
                verified: true
            },
            {
                name: "Jane Smith",
                email: "jane@shopnest.com",
                password: hashedPassword,
                role: "user",
                verified: true
            },
            {
                name: "Mike Johnson",
                email: "mike@shopnest.com",
                password: hashedPassword,
                role: "user",
                verified: false
            }
        ]);
        console.log(`✓ Created ${users.length} users`);

        // Create dummy products
        const products = await Product.insertMany([
            {
                name: "Wireless Headphones",
                description: "High-quality wireless headphones with noise cancellation",
                price: 79.99,
                category: "Electronics",
                stock: 50,
                imageUrl: "https://via.placeholder.com/300x300?text=Wireless+Headphones",
                rating: 4.5,
                numReviews: 120
            },
            {
                name: "USB-C Cable",
                description: "Durable 2-meter USB-C charging and data cable",
                price: 12.99,
                category: "Accessories",
                stock: 200,
                imageUrl: "https://via.placeholder.com/300x300?text=USB-C+Cable",
                rating: 4.2,
                numReviews: 85
            },
            {
                name: "Portable Power Bank",
                description: "10000mAh portable battery pack with fast charging",
                price: 34.99,
                category: "Electronics",
                stock: 75,
                imageUrl: "https://via.placeholder.com/300x300?text=Power+Bank",
                rating: 4.7,
                numReviews: 200
            },
            {
                name: "Phone Screen Protector",
                description: "Tempered glass screen protector for smartphones",
                price: 9.99,
                category: "Accessories",
                stock: 150,
                imageUrl: "https://via.placeholder.com/300x300?text=Screen+Protector",
                rating: 4.3,
                numReviews: 95
            },
            {
                name: "Mechanical Keyboard",
                description: "RGB mechanical keyboard with Cherry MX switches",
                price: 129.99,
                category: "Electronics",
                stock: 30,
                imageUrl: "https://via.placeholder.com/300x300?text=Mechanical+Keyboard",
                rating: 4.8,
                numReviews: 250
            },
            {
                name: "Wireless Mouse",
                description: "Ergonomic wireless mouse with precision tracking",
                price: 49.99,
                category: "Electronics",
                stock: 60,
                imageUrl: "https://via.placeholder.com/300x300?text=Wireless+Mouse",
                rating: 4.4,
                numReviews: 110
            },
            {
                name: "Phone Case",
                description: "Protective phone case with shock absorption",
                price: 19.99,
                category: "Accessories",
                stock: 180,
                imageUrl: "https://via.placeholder.com/300x300?text=Phone+Case",
                rating: 4.1,
                numReviews: 75
            },
            {
                name: "Webcam",
                description: "1080p HD webcam with auto-focus for video calls",
                price: 59.99,
                category: "Electronics",
                stock: 40,
                imageUrl: "https://via.placeholder.com/300x300?text=Webcam",
                rating: 4.6,
                numReviews: 140
            },
            {
                name: "USB Hub",
                description: "7-port USB 3.0 hub with fast data transfer",
                price: 39.99,
                category: "Accessories",
                stock: 55,
                imageUrl: "https://via.placeholder.com/300x300?text=USB+Hub",
                rating: 4.2,
                numReviews: 65
            },
            {
                name: "Laptop Stand",
                description: "Adjustable aluminum laptop stand for better ergonomics",
                price: 44.99,
                category: "Accessories",
                stock: 45,
                imageUrl: "https://via.placeholder.com/300x300?text=Laptop+Stand",
                rating: 4.5,
                numReviews: 105
            }
        ]);
        console.log(`✓ Created ${products.length} products`);

        // Create dummy orders
        const orders = await Order.insertMany([
            {
                user: users[1]._id,
                items: [
                    {
                        product: products[0]._id,
                        qty: 1,
                        price: products[0].price
                    },
                    {
                        product: products[1]._id,
                        qty: 2,
                        price: products[1].price
                    }
                ],
                totalAmount: products[0].price + (products[1].price * 2),
                address: {
                    fullName: "John Doe",
                    street: "123 Main St",
                    city: "New York",
                    postalCode: "10001",
                    country: "USA"
                },
                paymentID: "PAY_123456",
                status: "delivered"
            },
            {
                user: users[2]._id,
                items: [
                    {
                        product: products[4]._id,
                        qty: 1,
                        price: products[4].price
                    }
                ],
                totalAmount: products[4].price,
                address: {
                    fullName: "Jane Smith",
                    street: "456 Oak Ave",
                    city: "Los Angeles",
                    postalCode: "90001",
                    country: "USA"
                },
                paymentID: "PAY_123457",
                status: "shipped"
            },
            {
                user: users[1]._id,
                items: [
                    {
                        product: products[2]._id,
                        qty: 1,
                        price: products[2].price
                    },
                    {
                        product: products[5]._id,
                        qty: 1,
                        price: products[5].price
                    }
                ],
                totalAmount: products[2].price + products[5].price,
                address: {
                    fullName: "John Doe",
                    street: "123 Main St",
                    city: "New York",
                    postalCode: "10001",
                    country: "USA"
                },
                paymentID: "PAY_123458",
                status: "pending"
            },
            {
                user: users[2]._id,
                items: [
                    {
                        product: products[6]._id,
                        qty: 3,
                        price: products[6].price
                    }
                ],
                totalAmount: products[6].price * 3,
                address: {
                    fullName: "Jane Smith",
                    street: "456 Oak Ave",
                    city: "Los Angeles",
                    postalCode: "90001",
                    country: "USA"
                },
                paymentID: "PAY_123459",
                status: "delivered"
            }
        ]);
        console.log(`✓ Created ${orders.length} orders`);

        console.log("\n✅ Database seeded successfully!");
        console.log(`\nSummary:`);
        console.log(`- Users: ${users.length}`);
        console.log(`- Products: ${products.length}`);
        console.log(`- Orders: ${orders.length}`);
        console.log(`\nTest credentials:`);
        console.log(`- Admin Email: admin@shopnest.com`);
        console.log(`- User Email: john@shopnest.com`);
        console.log(`- Password: password123`);

    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("\n✓ Database connection closed");
        process.exit(0);
    }
};

connectDB().then(() => seedDatabase());
