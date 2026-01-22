import mongoose from "mongoose";

const memberWorkspaceSchema = new mongoose.Schema(
    {
        fk_id_owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        fk_id_workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WorkSpace",
            required: true
        },
        created_at: {
            type: Date,
            default: Date.now
        },
        role: {
            type: String,
            enum: ["Owner", "Admin", "User"],
            default: "User",
            required: true
        }
    }
)

const MemberWorkspace = mongoose.model('MemberWorkspace', memberWorkspaceSchema)
export default MemberWorkspace