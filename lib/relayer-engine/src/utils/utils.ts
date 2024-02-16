import { parseVaa, SignedVaa } from "@certusone/wormhole-sdk";
import { ParsedVaaWithBytes } from "relayer-plugin-interface";

export class EngineError extends Error {
  constructor(msg: string, public args?: Record<any, any>) {
    super(msg);
  }
}

export function nnull<T>(x: T | undefined | null, errMsg?: string): T {
  if (x === undefined || x === null) {
    throw new Error("Found unexpected undefined or null. " + errMsg);
  }
  return x;
}

export function assertInt(x: any, fieldName?: string): number {
  if (!Number.isInteger(Number(x))) {
    throw new EngineError(`Expected field to be integer, found ${x}`, {
      fieldName,
    }) as any;
  }
  return x as number;
}

export function assertArray<T>(
  x: any,
  name: string,
  elemsPred?: (x: any) => boolean,
): T[] {
  if (!Array.isArray(x) || (elemsPred && !x.every(elemsPred))) {
    throw new EngineError(`Expected value to be array, found ${x}`, {
      name,
    }) as any;
  }
  return x as T[];
}

export function sleep(ms: number) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms));
}

export function assertBool(x: any, fieldName?: string): boolean {
  if (x !== false && x !== true) {
    throw new EngineError(`Expected field to be boolean, found ${x}`, {
      fieldName,
    }) as any;
  }
  return x as boolean;
}

export function parseVaaWithBytes(vaa: SignedVaa): ParsedVaaWithBytes {
  const parsedVaa = parseVaa(vaa) as ParsedVaaWithBytes;
  parsedVaa.bytes = Buffer.from(vaa);
  return parsedVaa;
}

import {
  CHAIN_ID_ACALA,
  CHAIN_ID_ALGORAND,
  CHAIN_ID_APTOS,
  CHAIN_ID_ARBITRUM,
  CHAIN_ID_AURORA,
  CHAIN_ID_AVAX,
  CHAIN_ID_BSC,
  CHAIN_ID_BTC,
  CHAIN_ID_CELO, CHAIN_ID_ETH, CHAIN_ID_FANTOM, CHAIN_ID_GNOSIS,
  CHAIN_ID_INJECTIVE, CHAIN_ID_KARURA, CHAIN_ID_KLAYTN,
  CHAIN_ID_MOONBEAM,
  CHAIN_ID_NEAR,
  CHAIN_ID_NEON,
  CHAIN_ID_OASIS,
  CHAIN_ID_OPTIMISM, CHAIN_ID_OSMOSIS,
  CHAIN_ID_POLYGON,
  CHAIN_ID_PYTHNET,
  CHAIN_ID_SOLANA,
  CHAIN_ID_SUI,
  CHAIN_ID_TERRA, CHAIN_ID_TERRA2,
  CHAIN_ID_UNSET, CHAIN_ID_WORMCHAIN, CHAIN_ID_XPLA,
  ChainId,
} from "@certusone/wormhole-sdk";

const chainIdMap = new Map<number, ChainId>([
  [0, CHAIN_ID_UNSET],
  [1, CHAIN_ID_SOLANA],
  [2, CHAIN_ID_ETH],
  [3, CHAIN_ID_TERRA],
  [4, CHAIN_ID_BSC],
  [5, CHAIN_ID_POLYGON],
  [6, CHAIN_ID_AVAX],
  [7, CHAIN_ID_OASIS],
  [8, CHAIN_ID_ALGORAND],
  [9, CHAIN_ID_AURORA],
  [10, CHAIN_ID_FANTOM],
  [11, CHAIN_ID_KARURA],
  [12, CHAIN_ID_ACALA],
  [13, CHAIN_ID_KLAYTN],
  [14, CHAIN_ID_CELO],
  [15, CHAIN_ID_NEAR],
  [16, CHAIN_ID_MOONBEAM],
  [17, CHAIN_ID_NEON],
  [18, CHAIN_ID_TERRA2],
  [19, CHAIN_ID_INJECTIVE],
  [20, CHAIN_ID_OSMOSIS],
  [21, CHAIN_ID_SUI],
  [22, CHAIN_ID_APTOS],
  [23, CHAIN_ID_ARBITRUM],
  [24, CHAIN_ID_OPTIMISM],
  [25, CHAIN_ID_GNOSIS],
  [26, CHAIN_ID_PYTHNET],
  [28, CHAIN_ID_XPLA],
  [29, CHAIN_ID_BTC],
  [3104, CHAIN_ID_WORMCHAIN],
]);

export function numberToChainID(chain_num: number): ChainId | undefined {
  if (!chainIdMap.has(chain_num))
    return CHAIN_ID_UNSET;
  return chainIdMap.get(chain_num);
}
