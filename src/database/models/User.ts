import { model, Schema } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  email: {
    type: String,
    required: true,
  },
  friends: Schema.Types.ObjectId,
  enemies: Schema.Types.ObjectId,
  avatar: String,
});

const User = model("user", userSchema, "users");

export default User;
