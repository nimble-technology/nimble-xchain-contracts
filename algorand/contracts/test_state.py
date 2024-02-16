import unittest
from pyteal import compileTeal, Mode
from algosdk.v2client.algod import AlgodClient
from algosdk.future.transaction import ApplicationNoOpTxn
from algosdk import encoding

from state import * 
from testing.utils import *

ALGOD_ADDRESS = "http://localhost:4001"
ALGOD_TOKEN = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"

class TestPyTeal(unittest.TestCase):
    def setUp(self):
        self.algod_client = AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)
        self.program = compileTeal(example_program(), mode=Mode.Application, version=4)
        self.app_id = 123  
        self.sender = "test_sender"

    def test_owner_getter_setter(self):
        owner = "test_owner"
        setOwner(Bytes(owner))
        owner_got = getOwner()
        assert Bytes(owner) == owner_got

    def test_wormhole_getter_setter(self):
        wormhole = "test_wormhole"
        setWormhole(Bytes(wormhole))
        wormhole_got = getWormhole()
        assert Bytes(wormhole) == wormhole_got

    def test_token_bridge_getter_setter(self):
        token_bridge = "test_token_bridge"
        setTokenBridge(Bytes(token_bridge))
        token_bridge_got = getTokenBridge()
        assert Bytes(token_bridge) == token_bridge_got

    def test_chain_id_getter_setter(self):
        chain_id = 123
        setChainId(Int(chain_id))
        chain_id_got = getChainId()
        assert Int(chain_id) == chain_id_got

    def test_wormhole_finality_getter_setter(self):
        wormhole_finality = 123
        setWormholeFinality(Int(wormhole_finality))
        wormhole_finality_got = getWormholeFinality()
        assert Int(wormhole_finality) == wormhole_finality_got
    
    def test_fee_precision_getter_setter(self):
        fee_precision = 18
        setFeePrecision(Int(fee_precision))
        fee_precision_got = getFeePrecision()
        assert Int(fee_precision) == fee_precision_got
    
    def test_relayer_fee_percentage_getter_setter(self):
        relayer_fee_percentage = 123
        setRelayerFeePercentage(Int(relayer_fee_percentage))
        relayer_fee_percentage_got = getRelayerFeePercentage()
        assert Int(relayer_fee_percentage) == relayer_fee_percentage_got

if __name__ == '__main__':
    unittest.main()
