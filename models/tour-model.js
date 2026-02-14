const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Tour must have a name."]
  },
  rating: {
    type: Number,
    default: 4.0
  },
  price: {
    type: Number,
    required: [true, "Tour must have a price."]
  }
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
