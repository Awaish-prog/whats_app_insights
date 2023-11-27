import { config } from "dotenv";
config();
import app from "./server"
import { srcapWhatsAppData } from "./ScheduledTasks/ScheduledTask";
const port = parseInt(process.env.PORT as string) || 3000;



app.listen(port, () => {
  // srcapWhatsAppData()
  console.log(`Listening on port ${port}`);
});