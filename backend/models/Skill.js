// =====================================================
// Skill model
// =====================================================

import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Frontend", "Backend", "Salesforce", "Tools"],
      required: true,
    },
    icon: {
      // Cloudinary URL of the uploaded skill icon. No default —
      // stays empty until the admin uploads a real icon image.
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
    isPublished: {
      // Draft/publish system: only published skills appear on the
      // public site. Defaults to false (draft) so nothing goes live
      // until the admin explicitly publishes it.
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Skill", skillSchema);
