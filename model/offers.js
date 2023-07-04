const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  priceType: {
    type: String,
    enum: ['flat', 'percentage'],
    default: 'flat'
  },
  minSpent: {
    type: Number,
    required: true
  },
  usageLimit: {
    type: Number,
    required: true
  },
  voucherCode: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  status: Boolean
});

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
