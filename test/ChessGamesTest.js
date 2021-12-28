const { assert } = require("chai")

const TodoList = artifacts.require('./ChessGames.sol')

contract('ChessGames', (accounts) => {
    before(async () => {
        this.chessGames = await TodoList.deployed()
    })

    //To check if the smart contract has been deployed successfully
    it('deploys successfully', async () => {
        const address = await this.chessGames.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })

    //To check if the games are properly formatted
    it('lists games', async () => {
        const gamesCount = await this.chessGames.gamesCount()
        const game = await this.chessGames.games(gamesCount)
        assert.equal(game.id.toNumber(), gamesCount.toNumber())
        assert.equal(game.whitePlayer, "Magnus Carlsen")
        assert.equal(game.blackPlayer, "Ian Nepomniachtchi")
        assert.equal(game.whiteElo, 2855)
        assert.equal(game.blackElo, 2782)
        assert.equal(game.platform, "FIDE World Championship 2021")
        assert.equal(game.result, "1 - 0")
    })

    //To check the working of the create game function
    it('adds games', async () => {
        const result = await this.chessGames.addGame('Ian Nepomniachtchi', 'Magnus Carlsen', 2782, 2855, 'FIDE World Championship 2021', '0.5-0.5')
        console.log(result)
        const gamesCount = await this.chessGames.gamesCount()
        assert.equal(gamesCount, 2)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), 2)
        assert.equal(event.whitePlayer, 'Ian Nepomniachtchi')
        assert.equal(event.blackPlayer, 'Magnus Carlsen')
        assert.equal(event.whiteElo, 2782)
        assert.equal(event.blackElo, 2855)
        assert.equal(event.platform, 'FIDE World Championship 2021')
        assert.equal(event.result, '0.5-0.5')
    })

})