# state
from pyteal import *

owner_key = Bytes("owner")
wormhole_key = Bytes("wormhole")
token_bridge_key = Bytes("tokenBridge")
chain_id_key = Bytes("chainId")
wormhole_finality_key = Bytes("wormholeFinality")
fee_precision_key = Bytes("feePrecision")
relayer_fee_percentage_key = Bytes("relayerFeePercentage")

@Subroutine(TealType.none)
def setOwner(owner: bytes):
    return App.globalPut(owner_key, owner)

@Subroutine(TealType.none)
def setWormhole(wormhole: bytes):
    return App.globalPut(wormhole_key, wormhole)

@Subroutine(TealType.none)
def setTokenBridge(tokenBridge: bytes):
    return App.globalPut(token_bridge_key, tokenBridge)

@Subroutine(TealType.none)
def setChainId(chainId: int):
    return App.globalPut(chain_id_key, chainId)

@Subroutine(TealType.none)
def setWormholeFinality(wormholeFinality: int):
    return App.globalPut(wormhole_finality_key, wormholeFinality)

@Subroutine(TealType.none)
def setFeePrecision(feePrecision: int):
    return App.globalPut(fee_precision_key, feePrecision)

@Subroutine(TealType.none)
def setRelayerFeePercentage(relayerFeePercentage: int):
    return App.globalPut(relayer_fee_percentage_key, relayerFeePercentage)

@Subroutine(TealType.bytes)
def getOwner():
    return App.globalGet(owner_key)

@Subroutine(TealType.bytes)
def getWormhole():
    return App.globalGet(wormhole_key)

@Subroutine(TealType.bytes)
def getTokenBridge():
    return App.globalGet(token_bridge_key)

@Subroutine(TealType.uint64)
def getChainId():
    return App.globalGet(chain_id_key)

@Subroutine(TealType.uint64)
def getWormholeFinality():
    return App.globalGet(wormhole_finality_key)

@Subroutine(TealType.uint64)
def getFeePrecision():
    return App.globalGet(fee_precision_key)

@Subroutine(TealType.uint64)
def getRelayerFeePercentage():
    return App.globalGet(relayer_fee_percentage_key)
