import { populate } from "dotenv";
import ChannelMessages from "../Models/ChannelMessages.model.js";

class MessagesRepository{
    async create(member_id, content, channel_id){
        const msg = await ChannelMessages.create({
            fk_workspace_member_id: member_id,
            message: content,
            fk_workspace_channel_id: channel_id
        })
        return msg
    }
    async getAllByChannelId(channel_id){
        /* traigo todos los msj con populate */
        const allMessages = await ChannelMessages.find({fk_workspace_channel_id: channel_id})
            .populate({
                path: 'fk_workspace_member_id',
                select: 'role fk_id_user',
                populate: {
                    path: 'fk_id_user',
                    select: 'username email'
                }
            });

        const messages = allMessages.filter(msg => 
            msg.fk_workspace_member_id !== null && 
            msg.fk_workspace_member_id.fk_id_user !== null
        );
        return messages
    }

    /* extra */
    async getById(message_id) {
        return ChannelMessages.findById(message_id)
    }

    async deleteById(message_id) {
        return ChannelMessages.findByIdAndDelete(message_id)
    }
}

const messagesRepository = new MessagesRepository()
export default messagesRepository
