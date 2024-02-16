// SPDX-License-Identifier: Apache 2

pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestERC20 is ERC20 {
    uint8 decimals_;

    constructor(
        address addressToBeMinted,
        uint8 toeknDecimals,
        uint256 supply
    ) ERC20("testERC20", "TERC20"){
        decimals_ = toeknDecimals;
        _mint(addressToBeMinted, supply*10**decimals_);
    }

    function decimals() public view override returns (uint8) {
        return decimals_;
    }
}
