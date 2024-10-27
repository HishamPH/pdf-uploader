import mongoose, { Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

import User from "../../entity/user";

const pdfSchema = new Schema({
  originalName: {
    type: String,
    required: true, // You can decide if this should be required
  },
  name: {
    type: String,
    required: true, // You can decide if this should be required
  },
  url: {
    type: String,
    required: true, // You can decide if this should be required
  },
});

const userSchema: Schema<User> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  pdfs: {
    type: [pdfSchema],
    default: [],
  },
});

userSchema.pre<User>("save", async function (next) {
  if (this.password) this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.index({ name: "text" });
const userModel: Model<User> = mongoose.model("User", userSchema);
export default userModel;
