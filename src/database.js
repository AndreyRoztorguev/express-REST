import mongoose, { Types } from "mongoose";

mongoose.set("toJSON", {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id;
    delete converted.__v;
  },
});

const whisperSchema = new mongoose.Schema({ message: String });

const Whisper = mongoose.model("Whisper", whisperSchema);

const getAll = () => Whisper.find();

const getById = async (id) => {
  if (!Types.ObjectId.isValid(id)) {
    console.log("Invalid ID format");
    return null;
  }
  return Whisper.findById({ _id: id });
};

const create = async (message) => {
  const whisper = new Whisper({ message });
  await whisper.save();
  return whisper;
};

const updateById = async (id, message) =>
  Whisper.findOneAndUpdate(
    {
      _id: id,
    },
    { message },
    { new: false }
  );

const deleteById = async (id) => Whisper.deleteOne({ _id: id });

export { Whisper, create, deleteById, getAll, getById, updateById };
