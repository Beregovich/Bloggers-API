const {MongoMemoryServer} = require("mongodb-memory-server");

module.exports = async () => {
    //This code will be called first before any test cases run
    export const mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    await mongoose.connect(mongoUri)
};