import mongoose from "mongoose";

const profileChangeRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  requestedChanges: {
    type: Object,
    required: true
    /*
      Example:
      {
        department: { old: "Engineering", new: "HR" },
        reportingManager: { old: "Vandita Yadav", new: "Ayushman Singh" }
      }
    */
  },

  reason: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING"
  },

  requestedAt: {
    type: Date,
    default: Date.now
  },

  reviewedAt: Date,
  reviewedBy: String // manager name or id
});

export default mongoose.model(
  "ProfileChangeRequest",
  profileChangeRequestSchema
);
