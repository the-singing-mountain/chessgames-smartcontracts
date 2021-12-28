App = {
    loading: false,
    contracts: {},
  
    load: async () => {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.render()
    },
  
    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async () => {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
      } else {
        window.alert("Please connect to Metamask.")
      }
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
        } catch (error) {
          console.log(error.message)
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },

    loadAccount: async () => {
        App.account = web3.eth.accounts[0]
    },

    loadContract: async () => {
        const chessGames = await $.getJSON('ChessGames.json')
        App.contracts.ChessGames = TruffleContract(chessGames)
        App.contracts.ChessGames.setProvider(App.web3Provider)
        App.chessGames = await App.contracts.ChessGames.deployed()
    },

    addGame: async() => {
        App.setLoading(true)
        const whitePlayer = $('#whitePlayer').val()
        const blackPlayer = $('#blackPlayer').val()
        const whiteElo = $('#whiteElo').val()
        const blackElo = $('#blackElo').val()
        const platform = $('#platform').val()
        const result = $('#result').val()
        await App.chessGames.addGame(whitePlayer, blackPlayer, whiteElo, blackElo, platform, result)
        window.location.reload()
    },

    render: async () => {
        if (App.loading) {
            return
        }

        App.setLoading(true)

        $('#account').html("Account ID: " + App.account)

        await App.renderTasks()

        App.setLoading(false)        
    },

    renderTasks: async() => {
        const gameCount = await App.chessGames.gamesCount()

        const $gameTemplate = $('.gameTemplate')

        for (var i = 1; i <= gameCount; i++) {
            const game = await App.chessGames.games(i)
            const gameId = game[0].toNumber()
            const whitePlayer = game[1]
            const blackPlayer = game[2]
            const whiteElo = game[3].toNumber()
            const blackElo = game[4].toNumber()
            const platform = game[5]
            const result = game[6]

            const $newGameTemplate = $gameTemplate.clone()
            $newGameTemplate.find('.content').html(gameId + ":" + whitePlayer + "  (" + whiteElo + ") " + " - " + blackPlayer + "  (" + blackElo + ") " + " [" + platform + "] " + "\n" + "Result: " + result)
            $('#gamesList').append($newGameTemplate)
            $newGameTemplate.show()
        }
    },

    setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        if (boolean) {
          loader.show()
          content.hide()
        } else {
          loader.hide()
          content.show()
        }    
    }
}

$(() => {
    $(window).load(() => {
        App.load()
    })
})
