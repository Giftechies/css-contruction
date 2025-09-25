import mongoose, { Schema } from "mongoose";

const sizeSchema = new Schema({
  size: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Category
    ref: "Category",
    required: true,
  },
});

const Size = mongoose.models.Size || mongoose.model("Size", sizeSchema);

export default Size;
