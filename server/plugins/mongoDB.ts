import mongoose from 'mongoose'

export default async () => {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(useRuntimeConfig().MONGO_URI)
        // eslint-disable-next-line no-console
        console.log('Successfully connected to DB.')
    } catch (error: unknown) {
        console.log(error)
    }
}