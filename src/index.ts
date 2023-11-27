import { config } from "dotenv";
config();
import app from "./server";
import { runScheduledTasks } from "./ScheduledTasks/ScheduledTask";
const port = parseInt(process.env.PORT as string) || 3000;



app.listen(port, () => {
  // runScheduledTasks()
  console.log(`Listening on port ${port}`);
});