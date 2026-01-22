import User from "../Models/user.model.js"

class UserRepository {
    async crear({ username, email, password }) {
        await User.create({ username, email, password })
    }


    async buscarUnoPorEmail(email){
        const user = await User.findOne({email})
        return user
    }

    async eliminarPorId(user_id){
        await User.findByIdAndDelete(user_id)
    }

    async desactivarPorId(){
        const usuario = await User.findByIdAndUpdate(
            user_id, {
                active: false
            },
            {
                new: true /* Devuelve el registro actualizado */
            }
        )
        console.log(usuario)
        return usuario
    }

    async actualizarPorid(user_id, nuevosDatos){
        await User.findByIdAndUpdate(
            user_id,
            nuevosDatos,
            {
                new: true
            }
        )
    }

    async obtenerTodos(){
        const usuarios = await User.find()
    }

    async obtenerUnoPorId(){
        const usuario = await User.findById
    }
}

const userRepository = new UserRepository()
export default userRepository