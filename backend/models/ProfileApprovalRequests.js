import mongoose from 'mongoose';

const profileApprovalRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    approverManagerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    fullName: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    },
    designation: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING'
    },
    requestedAt: {
      type: Date,
      default: Date.now
    },
    approvedAt: {
      type: Date
    },
    rejectionReason: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model('ProfileApprovalRequest', profileApprovalRequestSchema);