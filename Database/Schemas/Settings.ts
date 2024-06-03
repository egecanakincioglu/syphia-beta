import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    volume: { type: Number, default: 50 }, 
    autoplay: { type: Boolean, default: false }
  });

export const Settings = mongoose.model('Settings', SettingsSchema);