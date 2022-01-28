// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

contract Keyboards {

  enum KeyboardLayout {
    Pct60,
    Pct75,
    Pct80,
    Iso105
  }
  struct Keyboard {
    KeyboardLayout layout;
    bool isPbt;
    string filter;
    address owner;
  }

  event KeyboardCreated (
    Keyboard keyboard
  );
  event TipSent (
    address recipient,
    uint256 amount
  );

  Keyboard[] public createdKeyboards;

  function getKeyboards() view public returns(Keyboard[] memory) {
    return createdKeyboards;
  }

  function create(
    KeyboardLayout _layout,
    bool _isPbt,
    string calldata _filter
    ) external {
    Keyboard memory newKb = Keyboard({
      layout: _layout,
      isPbt: _isPbt,
      filter: _filter,
      owner: msg.sender
    });
    createdKeyboards.push(newKb);
    emit KeyboardCreated(newKb);
  }

  function tip(uint256 _ix) external payable {
    address payable owner = payable(createdKeyboards[_ix].owner);
    owner.transfer(msg.value);
    emit TipSent(owner, msg.value);
  }
}