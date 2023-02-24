import "./loadEnviroment.js";
import morgan from "morgan";
import createDebug from "debug";
import chalk from "chalk";
import startServer from "./server/startServer.js";
import { app } from "./server/index.js";

export const debug = createDebug("feisbuk:");

const port = process.env.PORT ?? 4321;

app.use(morgan("dev"));

try {
  await startServer(+port);
  debug(chalk.green(`Server listening on port ${chalk.yellowBright(port)}`));
} catch (error: unknown) {
  debug((error as Error).message);
}
