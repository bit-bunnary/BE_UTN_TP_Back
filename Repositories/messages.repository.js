import ChannelMessages from "../Models/ChannelMessages.model.js";

class MessagesRepository{
    async create(member_id, content, channel_id){
        await ChannelMessages.create({
            fk_workspace_member_id: member_id,
            message: content,
            fk_workspace_channel_id: channel_id
        })
    } 
}

const messagesRepository = new MessagesRepository()
export default messagesRepository
