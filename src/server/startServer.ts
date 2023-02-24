import createDebug from "debug";
import { app } from ".";

const debug = createDebug("robots:");

const startServer = async (port: number) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      resolve(server);
    });
  });
