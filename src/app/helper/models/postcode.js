import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
  postcode: {
    type: String,
    required: true,
    unique: true,
  },
});

const Postcode = mongoose.models.Postcode || mongoose.model("Postcode", postSchema);

export default Postcode;
