const express = require("express");
const env= require("dotenv");
const userRoutes = require('./routes/userRoutes');
const connectDB = require('./config/db')

const PORT = process.env.PORT || 5000;

env.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

connectDB(process.env.MONGO_URI);      // connecting mongo db here

app.use('/app/users', userRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));