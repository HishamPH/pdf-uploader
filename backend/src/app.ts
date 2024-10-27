//import http from "http";
import createServer from "./framework/config/server";
import { connectDB } from "./framework/config/connectDB";
import { config } from "dotenv";
config();
const port = process.env.PORT;

const startServer = async () => {
  try {
    await connectDB();
    const app = await createServer();
    //const server = http.createServer(app);
    app?.listen(port, async () => {
      console.log(`server is running at port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
startServer();
