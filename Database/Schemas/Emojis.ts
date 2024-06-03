import { Schema } from "mongoose";

export const emojiSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    full: { type: String, required: true },
    link: { type: String, reuqired: true }
});

export interface EmojiDocument extends Document {
    id: string;
    name: string;
    full: string;
    link: string;
}