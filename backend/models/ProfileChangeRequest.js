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
        fullName: "John Doe",
        department: "Engineering",
        designation: "Senior Developer",
        reportingManager: "manager_id"
      }
    */
  },

  reportingManagerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  reportingManagerName: {
    type: String,
    required: true
  },

  reason: {
    type: String,
    default: "Initial profile submission"
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
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  rejectionReason: String
});

export default mongoose.model(
  "ProfileChangeRequest",
  profileChangeRequestSchema
);
