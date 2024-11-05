import { Types } from "mongoose";
import { Whisper } from "../database.js";

const getAll = async () => Whisper.find().populate("author", "username");

const getById = async (id) => {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }
  return Whisper.findById({ _id: id }).populate("author", "username");
};

const create = async (message, authorId) => {
  const whisper = new Whisper({ message, author: authorId });
  await whisper.save();
  return whisper;
};

const updateById = async (id, message) =>
  Whisper.findOneAndUpdate({ _id: id }, { message }, { new: false });

const deleteById = async (id) => Whisper.deleteOne({ _id: id });

export { getAll, getById, create, updateById, deleteById };
