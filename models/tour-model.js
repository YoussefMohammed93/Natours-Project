const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "Tour must have a name"]
  },
  duration: {
    type: Number,
    required: [true, "Tour must have a duration"]
  },
  maxGroupSize: {
    type: Number,
    required: [true, "Tour must have a group size"]
  },
  difficulty: {
    type: String,
    required: [true, "Tour must have a difficulty"]
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, "Tour must have a price"]
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    required: [true, "Tour must have a description"]
  },
  coverImage: {
    type: String,
    required: "Tour must have a cover image"
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  startDates: [Date]
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
