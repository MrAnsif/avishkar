import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true 
    },

    description: { 
      type: String 
    },

    // department / common
    eventCategory: { 
      type: String, 
      enum: ["department", "common"], 
      required: true 
    },

    // store department name directly
    department: { 
      type: String, 
      required: true, 
    },

    // single / team
    type: { 
      type: String, 
      enum: ["individual", "team"], 
      required: true 
    },

    teamSize: { 
      type: Number, 
      default: 1 
    },

    // 💳 Payment
    upiId: { 
      type: String, 
      required: true 
    },

    amount: { 
      type: Number, 
      required: true 
    },

    // 📜 Rules (ARRAY)
    rules: {
      type: [String],
      required: true,
      default: [],
    },

    // 🖼 Image
    imageUrl: { 
      type: String, 
      required: true 
    },

    // ⏰ Timings
    startTime: { 
      type: Date, 
      required: true 
    },

    endTime: { 
      type: Date, 
      required: true 
    },

    registrationDeadline: { 
      type: Date, 
      required: true 
    },

    // 🔁 Status
    isActive: { 
      type: Boolean, 
      default: true 
    },
  },
  { timestamps: true }
);

const Event =
  mongoose.models.Event || mongoose.model("Event", EventSchema);

export default Event;
