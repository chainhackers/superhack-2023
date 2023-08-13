// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IGameRegistry.sol";
import "./interfaces/IGrid.sol";
import "./interfaces/IGame.sol";

import "./lib/Utils.sol";

import "../lib/openzeppelin-contracts-upgradeable/contracts/access/OwnableUpgradeable.sol";
import "../lib/openzeppelin-contracts-upgradeable/contracts/proxy/utils/UUPSUpgradeable.sol";
import "../lib/openzeppelin-contracts-upgradeable/contracts/token/ERC1155/ERC1155Upgradeable.sol";

contract GameRegistry is IGameRegistry, IGrid, UUPSUpgradeable, OwnableUpgradeable, ERC1155Upgradeable {
    uint256 public constant MOVE_TIMEOUT = 1 hours;
    uint256 public constant MAX_TIMEOUT_FAULTS = 1;

    // @dev incrementing ID for moves
    uint256 public nextMoveId;

    // @dev mapping of move IDs to moves
    mapping(uint256 => Move) public moves;

    // @dev mapping of game IDs to game entries
    mapping(uint256 => RegisteredGameEntry) public gameEntries;

    // @dev move timestamps
    // @dev consider adding the ts field to Move struct, that breaks upgrades
    mapping(uint256 => uint256) public moveTimestamps;

    // @dev faults accumulated per game
    // @dev consider adding the faults field to RegisteredGameEntry struct, that breaks upgrades
    mapping(uint256 => uint256) public moveTimeoutFaults;

    // @dev initializer function for upgradeable contracts
    function initialize(string calldata _uri) public initializer {
        __UUPSUpgradeable_init();
        __Ownable_init();
        __ERC1155_init(_uri);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    /**
     * @notice Register a new game contract to the grid.
     * @notice Mints a new ERC-1155 token for the game or transfers the existing one to the registrar.
     * @dev must check for existing game contracts at the given coordinates.
     * @param x X coordinate of the upper left cell of the game in the grid.
     * @param y Y coordinate of the upper left cell of the game in the grid.
     */
    function registerGame(address game, int256 x, int256 y) external override {
        uint256 gameId = Utils.pair(x, y);
        require(!_gameExists(gameId), "GameRegistry: a game already exists at this location");
        gameEntries[gameId] = RegisteredGameEntry(game, x, y);
        emit GameRegistered(gameId, game, msg.sender);
        _mint(msg.sender, gameId, 1, "");
    }

    /**
  * @notice Unregister a game contract from the grid.
      * @notice Burns the ERC-1155 token representing the game.
      * @notice the owner of the token can unregister a game anytime.
      * @notice the game contract can unregister itself if it is not in use.
      * @notice everyone else can unregister a game after it accumulates more timeout faults
      * @notice than the predefined threshold.

      * @param gameId Unique identifier for the game.
    */
    function unregisterGame(uint256 gameId) external {
        require(_gameExists(gameId), "GameRegistry: game not found");
        require(
            balanceOf(msg.sender, gameId) > 0 ||
            msg.sender == gameEntries[gameId].game ||
            moveTimeoutFaults[gameId] > MAX_TIMEOUT_FAULTS, "GameRegistry: not authorized");
        delete gameEntries[gameId];
        _burn(msg.sender, gameId, 1); //TODO Registry must be the operator or else override some of OZ ERC1155 functions
    }

    // @notice Called by the game contract to setup a game
    // @dev must check the call is from the registered game contract
    function setupGame(uint256 gameId, uint256 movePrice, uint256 rewardBalance, uint256 timeoutSpan, bytes32 gameStateHash) external payable {
        emit GameSetup(gameId, movePrice, rewardBalance, timeoutSpan, gameStateHash);
    }

    // @notice Called by the game contract to answer a player move
    // @dev must check the call is from the registered game contract
    // @param gameId Unique identifier for the game.
    // @param moveId Unique identifier for the move.
    // @param result Result of the move produced by the game contract, may be produced asynchronously by its backend.
    // @param rewardValue Value of the reward for the move paid to the player by the game contract.
    // @param isGameOver True if the game is over, false otherwise.
    function answerPlayerMove(uint256 gameId, uint256 moveId, MoveResult result, uint256 rewardValue, bool isGameOver) external {
        emit MoveAnswered(gameId, moveId, result, rewardValue, isGameOver);
    }

    // @notice Send a move to a game contract
    // @dev x and y are world coordinates, they must be converted to game coordinates
    // @dev after the game id is found within the gameEntries mapping
    // @dev using Cantor pairing function for two signed integers
    // @param x X coordinate of the game on the grid.
    // @param y Y coordinate of the game on the grid.
    function sendMove(int256 x, int256 y) external {
        uint256 gameId = getCellGameId(x, y);
        address game = gameEntries[gameId].game;
        require(game != address(0), "GameRegistry: game not found");
        uint8 move = uint8(uint((y % 10) * 10 + (x % 10)));
        IGame(game).move(move, gameId);
        emit MoveSent(nextMoveId, move, gameId, msg.sender);
        nextMoveId++;
    }

    /**
     * @dev Register a timeout request due to a game not processing moves in time.
     *
     * @param gameId Unique identifier for the game.
     * @param moveId Unique identifier for the unanswered move that was sent long ago.
     */
    function reportMoveTimeoutFault(uint256 gameId, uint256 moveId) external {
        //TODO check if the move is unanswered and happened more than MOVE_TIMEOUT ago
        moveTimeoutFaults[gameId]++;
    }

    // @notice Get game details by its coordinates on the grid.
    // @notice World coordinates are converted to game coordinates.
    // @dev x and y are transformed to game ID with Cantor pairing function for two signed ints
    // @return gameId Unique identifier for the game.
    function getCellGameId(int256 x, int256 y) internal view returns (uint256 gameId){
        gameId = Utils.pair(x - x % 10, y - y % 10);
    }

    /**
     * @notice Get game details by its coordinates on the grid.
     * @notice World coordinates are converted to game coordinates.
     * @dev x and y are transformed to game ID with Cantor pairing function for two signed ints
     * @return gameId Unique identifier for the game.
     * @return game Address of the game contract.
     */
    function getGameInfo(int256 x, int256 y) external view returns (uint256 gameId, address game){
        gameId = Utils.pair(x, y);
        game = gameEntries[gameId].game;
    }

    function cellDetails(int256 x, int256 y) external view returns (address game, uint8 coordinate, uint256 tokenType, uint256 tokenId, string memory url){
        game = 0x1B8E12F839BD4e73A47adDF76cF7F0097d74c14C;
        coordinate = uint8(uint256((y * 10 + x) % 100));
        tokenType = 1;
        tokenId = coordinate;
        url = "https://arweave.net/rip5RY1wf8gKBl5CxEAKQHG9tc09SqyMFwJDOYT8xX0/{id}";
    }

    function gameExists(int256 x, int256 y) external view returns (bool){
        return _gameExists(x, y);
    }

    function _gameExists(int256 x, int256 y) internal view returns (bool) {
        uint256 gameId = Utils.pair(x, y);
        return _gameExists(gameId);
    }

    function _gameExists(uint256 gameId) internal view returns (bool) {
        return gameEntries[gameId].game != address(0);
    }
}
