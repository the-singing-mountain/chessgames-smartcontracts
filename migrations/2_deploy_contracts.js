const ChessGames = artifacts.require("ChessGames");

module.exports = function(deployer) {
  deployer.deploy(ChessGames);
};