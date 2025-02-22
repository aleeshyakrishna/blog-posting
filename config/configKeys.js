import { config } from "dotenv";
config();

const configKeys = {
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI,
}

export default configKeys;