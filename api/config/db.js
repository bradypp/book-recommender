const mongoose = require('mongoose');

// DB Config
// const DB = process.env.MONGO_URI.replace('<password>', process.env.DB_PASSWORD).replace(
//   '<dbname>',
//   process.env.DB_NAME,
// );
const DB = process.env.DATABASE_LOCAL;

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    // eslint-disable-next-line no-console
    console.log('MongoDB connection successful!');
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
