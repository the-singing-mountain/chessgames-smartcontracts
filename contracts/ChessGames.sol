// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract ChessGames {
	uint public gamesCount = 0;

	//Structure of all tasks
	struct Game {
		uint id;
		string whitePlayer;
        string blackPlayer;
		uint whiteElo;
        uint blackElo;
        string platform;
        string result;
	}

	mapping(uint => Game) public games;

	//Event signalling task created
	event GameAdded(
		uint id,
		string whitePlayer,
		string blackPlayer,
        uint whiteElo,
        uint blackElo,
        string platform,
        string result
	);

	constructor() public {
		addGame("Magnus Carlsen", "Ian Nepomniachtchi", 2855, 2782, "FIDE World Championship 2021", "1 - 0");	
	}

	//Function to create Tasks in the smart contract
	function addGame(string memory _whitePlayer, string memory _blackPlayer, uint _whiteElo, uint _blackElo, string memory _platform, string memory _result) public {
		gamesCount++;
		games[gamesCount] = Game(gamesCount, _whitePlayer, _blackPlayer, _whiteElo, _blackElo, _platform, _result);
		emit GameAdded(gamesCount, _whitePlayer, _blackPlayer, _whiteElo, _blackElo, _platform, _result);
	}
}