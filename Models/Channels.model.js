import mongoose from "mongoose";

const channelsSchema = new mongoose.Schema(
    {
        fk_id_workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true
        },
        name: {
            type: String,
            required: [true , "El nombre del canal es obligatorio"],
            maxlength: [20, "El nombre del canal no puede exceder los 20 caracteres"]
        },
        created_at: {
            type: Date,
            default: Date.now
        },
        active: {
            type: Boolean,
            default: true
        },
    }
)
/* Evita canales duplicados en MONGO */
channelsSchema.index(
    { fk_id_workspace: 1, name: 1 },
    { unique: true }
)

const Channel = mongoose.model('Channel', channelsSchema)
export default Channel