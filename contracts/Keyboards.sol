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
  }

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
      filter: _filter
    });
    createdKeyboards.push(newKb);
  }

  // function create(Keyboard calldata _kb) external {
  //   createdKeyboards.push(_kb);
  // }
}