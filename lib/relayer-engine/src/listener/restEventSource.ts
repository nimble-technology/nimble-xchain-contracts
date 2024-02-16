import {SpyRPCServiceClient} from "@certusone/wormhole-spydk/lib/cjs/proto/spy/v1/spy";
import * as cors from "cors";
import * as express from "express";
import * as bodyParser from "body-parser";
import {Plugin, Providers} from "relayer-plugin-interface";
import {Storage} from "../storage";
import {getScopedLogger, ScopedLogger} from "../helpers/logHelper";
import {checkShouldRelay, relay, nimbleRelay, getVersion} from "../relay/main";

const PORT = process.env.PORT || 3112;

export interface RestConfig {
  restPort: number;
}


let _logger: ScopedLogger;
const logger = () => {
  if (!_logger) {
    _logger = getScopedLogger(["restEventSource"]);
  }
  return _logger;
};

//used for both rest & spy relayer for now
export async function runRestListener(
  plugin: Plugin[],
  storage: Storage,
  providers: Providers,
  numGuardians: number,
) {
  const app = express();

  app.use(cors());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());


  app.post("/relay", relay);
  app.post("/nimbleRelay", nimbleRelay);
  app.get("/shouldRelay", checkShouldRelay);
  app.get("/version", getVersion);


  app.listen(PORT, () => {
    console.log(`
      ----------------------------------------------------------------
      ⚡               relayer running on port ${PORT}               ⚡
      ----------------------------------------------------------------
      BSC_ETH_RPC_URL           : ${process.env.BSC_ETH_RPC_URL}
      POLYGON_ETH_RPC_URL       : ${process.env.POLYGON_ETH_RPC_URL}
      TESTNET_MODE              : ${process.env.TESTNET_MODE}
      ----------------------------------------------------------------
    `);
  });
}
