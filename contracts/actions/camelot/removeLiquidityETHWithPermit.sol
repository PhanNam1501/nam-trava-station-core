// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../ActionBase.sol";
import "../../utils/TokenUtils.sol";
import "../../utils/SafeBEP20.sol";
import "../../interfaces/camelot/core/interfaces/IUniswapV2ERC20.sol";
import "../../interfaces/camelot/router/interfaces/ICamelotRouter.sol";
import "../../interfaces/camelot/core/interfaces/ICamelotPair.sol";

contract removeLiquidityETHWithPermit is ActionBase {
    using TokenUtils for address;

    struct Params {
        address router;
        address token;
        address tokenpair;
        uint256 liquidity;
        uint256 amountTokenmin;
        uint256 amountETHmin;
        uint256 deadline;
        address from;
        bool approveMax;
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory params = parseInputs(_callData);

        params.router = _parseParamAddr(
            params.router,
            _paramMapping[0],
            _subData,
            _returnValues
        );

        params.token = _parseParamAddr(
            params.token,
            _paramMapping[1],
            _subData,
            _returnValues
        );

        params.tokenpair = _parseParamAddr(
            params.tokenpair,
            _paramMapping[2],
            _subData,
            _returnValues
        );

        params.liquidity = _parseParamUint(
            params.liquidity,
            _paramMapping[3],
            _subData,
            _returnValues
        );
        params.amountTokenmin = _parseParamUint(
            params.amountTokenmin,
            _paramMapping[4],
            _subData,
            _returnValues
        );
        params.amountETHmin = _parseParamUint(
            params.amountETHmin,
            _paramMapping[5],
            _subData,
            _returnValues
        );
        params.deadline = _parseParamUint(
            params.deadline,
            _paramMapping[6],
            _subData,
            _returnValues
        );
        params.from = _parseParamAddr(
            params.from,
            _paramMapping[7],
            _subData,
            _returnValues
        );

        uint256 result = _removeLiquidity(params);
        emit ActionEvent("removeLiquidity", abi.encode(result));
        return bytes32(result);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        uint256 ethAmount = _removeLiquidity(params);
        logger.logActionDirectEvent(
            "removeLiquidityETHWithPermit",
            abi.encode(ethAmount)
        );
    }

    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    function _removeLiquidity(
        Params memory params
    ) internal returns (uint256) {
        address pair = params.tokenpair;
        if (params.liquidity == type(uint256).max) {
            params.liquidity = IUniswapV2ERC20(params.tokenpair).balanceOf(params.from);
        }
        uint value = params.approveMax ? type(uint256).max : params.liquidity;
        IUniswapV2ERC20(pair).approve(params.router, params.liquidity);
        
        ICamelotPair(pair).permit(
            msg.sender,
            address(this),
            value,
            params.deadline,
            params.v,
            params.r,
            params.s
        );

        IUniswapV2ERC20(pair).transferFrom(params.from,address(this), params.liquidity);
        uint256 amountA;
        uint256 amountB;
        (amountA, amountB) = ICamelotRouter(params.router).removeLiquidityETH(
            params.token,
            params.liquidity,
            params.amountTokenmin,
            params.amountETHmin,
            params.from,
            params.deadline
        );

        return amountA;
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
