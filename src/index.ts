import "./loadEnviroment.js";
import createDebug from "debug";
import chalk from "chalk";
import startServer from "./server/startServer.js";
import connectDatabase from "./database/connectDatabase.js";

export const debug = createDebug("feisbuk:");

const port = process.env.PORT ?? 4321;
const mongoDbUrl = process.env.MONGODB_CONNECTION_URL!;

try {
  await connectDatabase(mongoDbUrl);
  debug(chalk.cyanBright("Connected to database"));

  await startServer(+port);
  debug(chalk.green(`Server listening on port ${chalk.yellowBright(port)}`));
} catch (error: unknown) {
  debug((error as Error).message);
}
