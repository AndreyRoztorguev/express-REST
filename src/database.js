import mongoose from "mongoose";
import { checkPasswordStrength } from "./utils.js";
import bcrypt from "bcrypt";
import validator from "validator";

mongoose.set("toJSON", {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id;
    delete converted.__v;
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: [true, "Username is required"],
    minlength: [3, "Username must be at least 3 characters long"],
    maxlength: [20, "Username must be at most 20 characters long"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
    validate: {
      validator: checkPasswordStrength,
    },
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    select: false,
    required: [true, "Email is required"],
    validate: {
      validator: validator.isEmail,
      message: "Email is not valid",
    },
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const user = this;
  return await bcrypt.compare(candidatePassword, user.password);
};

const whisperSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: String,
  updatedDate: {
    type: Date,
    default: Date.now,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
const Whisper = mongoose.model("Whisper", whisperSchema);

export { Whisper, User };
