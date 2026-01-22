import mongoose, { now } from "mongoose";

const workspaceSchema = new mongoose.Schema(
    {
        fk_id_owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', /* acá se marca la relación */
            required: true
        },
        title:{
            type: String,
            required: true
        },
        description:{
            type: String,
            required: false
        },
        image:{
            type: String,
            required: false
        },
        created_at:{
            type: Date,
            default: Date.now
        },
        active:{
            type: Boolean,
            default: true
        }
    }
)

const Workspace = mongoose.model('Workspace', workspaceSchema)
export default Workspace