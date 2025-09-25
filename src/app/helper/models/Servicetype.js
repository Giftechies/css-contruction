// models/ServiceType.js
import mongoose, { Schema } from "mongoose";

// Sub-schema for postcode-specific price overrides
const PostcodeOverrideSchema = new Schema({
  postcode: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

// Sub-schema for each load size
const LoadSizeSchema = new Schema({
  name: { type: String, required: true }, // e.g., "1 Yard"
  defaultPrice: { type: Number, required: true },
  postcodeOverrides: [PostcodeOverrideSchema], // optional overrides
});

const ServiceTypeSchema = new Schema(
  {
    name: { type: String, required: true }, // e.g., "Skip Delivery"
    loadSizes: [LoadSizeSchema],
  },
  { timestamps: true }
);

const ServiceType =
  mongoose.models.ServiceType ||
  mongoose.model("ServiceType", ServiceTypeSchema);

export default ServiceType;
