import mongoose from "mongoose";

const hrPolicySchema = new mongoose.Schema({
  companyId: {
    type: String,
    default: "default",
    unique: true
  },
  policyText: {
    type: String,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model("HRPolicy", hrPolicySchema);