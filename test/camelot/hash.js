//import { INIT_CODE_HASH } from '../src/constants'

const { bytecode } = require('../../artifacts/contracts/interfaces/camelot/core/CamelotPair.sol/CamelotPair.json')
const { keccak256 } = require('@ethersproject/solidity')

const COMPUTED_INIT_CODE_HASH = keccak256(['bytes'], [`${bytecode}`]);
console.log(COMPUTED_INIT_CODE_HASH);