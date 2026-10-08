require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

const orderSchema = new mongoose.Schema({
    orderId: String,
    customerName: String,
    productName: String,
    price: Number,
    orderStatus: String
});

const Order = mongoose.model("Order", orderSchema);


// CREATE ORDER
app.post("/orders", async (req, res) => {
    try {
        const order = new Order(req.body);
        const savedOrder = await order.save();

        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// FIND ALL ORDERS
app.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find();

        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// FIND ORDER USING orderId
app.get("/orders/:orderId", async (req, res) => {
    try {
        const order = await Order.findOne({
            orderId: req.params.orderId
        });

        if (!order) {
            return res.status(404).send("Order not found");
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// UPDATE ORDER STATUS USING orderId
app.put("/orders/:orderId", async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate(
            { orderId: req.params.orderId },
            { orderStatus: req.body.orderStatus },
            { new: true }
        );

        if (!order) {
            return res.status(404).send("Order not found");
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// DELETE ORDER
app.delete("/orders/:orderId", async (req, res) => {
    try {
        const order = await Order.findOneAndDelete({
            orderId: req.params.orderId
        });

        if (!order) {
            return res.status(404).send("Order not found");
        }

        res.send("Order deleted successfully");
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// CONNECT TO MONGODB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");

        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:");
        console.log(error.message);
    });