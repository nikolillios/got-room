const express = require('express');
const app = express();
const path = require('path');
const { consoleTestResultsHandler } = require('tslint/lib/test');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname + '/dist/got-room'));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/got-room/index.html'));
})

server.listen(process.env.PORT || 4200, () => {
  console.log('listening');
})

var state = {
  tiles: initTiles(),
  players: [],
  gameStarted: false,
  turn: 0
}

function initTiles() {
  let res = [];
  for (let i = 0; i < 21; i++) {
    for (let j = 0; j < 16; j++) {
      if (j == 0) {
        res.push([]);
      }
      res[res.length - 1].push(tile())
    }
  }
  return res
}

function tile() {
  return {
    marked: false,
    color: 'transparent'
  }
}

io.on('connection', socket => {

})

let game = io.of('/game')

game.on('connection', socket => {
  game.emit('update', state);
  setListeners(socket);
})

function setListeners(socket) {
  //player join
  socket.on('join', (data) => {
    if (getPlayerWithId(socket.id) == null && !state.gameStarted) {
      // register new connection
      state.players.push({
        id: socket.id,
        name: data.name,
        score: 0,
        color: getColor(),
        isCurrPlayer: false,
        turns: [{ rolls: [], selection: { coords: [] } }],
      });
      socket.emit('join-success', state);
      game.emit('update', state);
      state.message = 'You have connected';
    } else {
      socket.emit('msg', 'error: you can not join');
    }
  });
  //start game
  socket.on('start-game', () => {
    startGame();
    game.emit('update', state)
  });
  //play again
  socket.on('play-again', () => {
    if (state.gameStarted) { return; }
    state.tiles = initTiles();
    resetPlayers();
    state.gameStarted = true;
    state.turn = 0;
    startGame();
  });
  //board-selection
  socket.on('board-selection', coordinate => {
    if (!isCurrPlayer(socket.id)) { return }
    let player = getPlayerWithId(socket.id);
    let currTurn = player.turns[state.turn];
    if (currTurn.rolls.length == 2) {
      if (currTurn.selection.length >= 2) { return; }
      currTurn.selection.coords.push({ x: coordinate.column, y: coordinate.row });
      if (currTurn.selection.coords.length == 2) {
        if (isValidSelection(state.tiles, player)) {
          markTiles(state.tiles, currTurn.selection, player.color);
          player.turns.push({
            rolls: [],
            selection: { coords: [] }
          });
          setNextCurrPlayer(player, state);
        } else {
          currTurn.selection.coords = [];
          socket.emit('message', 'invalid-selection');
        }
      }
    } else {
      socket.emit('message', 'roll dice before selection');
    }
    game.emit('update', state);
  });
  //dice roll
  socket.on('dice-roll', data => {
    if (!isCurrPlayer(socket.id)) { return }
    let player = getPlayerWithId(socket.id);
    let rolls = player.turns[state.turn].rolls;
    if (rolls.length < 2) {
      rolls.push(data);
      if (isGameOver(rolls)) {
        game.emit('message', 'game over');
        state.players[state.players.indexOf(player) - 1 % state.players.length].score += 1;
        state.gameStarted = false;
      }
    } else {
      socket.emit('message', 'dice already rolled');
    }
    game.emit('update', state);
  });
  // handle socket disconnect 
  socket.on('disconnect', () => {
    console.log('disconnecting');
    let player = getPlayerWithId(socket.id);
    let index = state.players.indexOf(player);
    state.players.splice(index, 1);
    if (state.players.length == 0) {
      state.tiles = initTiles();
      state.gameStarted = false;
      state.message = '';
    }
    game.emit('update', state);
  });
}

function resetPlayers() {
  for (let player of state.players) {
    player.turns = [{ rolls: [], selection: { coords: [] } }];
    player.isCurrPlayer = false;
  }
}

function startGame() {
  if (state.players.length < 1) { return; }
  let player = state.players[0];
  player.isCurrPlayer = true;
  state.gameStarted = true;
  game.emit('update', state);
}

function product(arr) {
  let prod = 1;
  for (let elem of arr) {
    prod = prod * elem;
  }
  return prod;
}

function isGameOver(rolls) {
  let prod = product(rolls);
  let facts = rolls.length == 1 ? [1] : factorsOf(prod);
  let tiles = state.tiles;
  for (let fact of facts) {
    let otherFact = prod / fact;
    for (let i = 0; i < tiles.length; i++) {
      for (let j = 0; j < tiles[0].length; j++) {
        if (!tiles[i][j].marked) {
          let k = 0;
          let m = 0;
          let isBlocked = false;
          while (k < fact && !isBlocked) {
            if (i + k >= tiles.length) { isBlocked = true; }
            while (m < otherFact && !isBlocked) {
              if (j + m >= tiles[0].length || tiles[i + k][j + m].marked) { isBlocked = true; }
              m++;
            }
            k++;
            if (k == fact && m == otherFact) { return false; }
            m = 0;
          }
        }
      }
    }
  }
  return true;
}

function factorsOf(number) {
  return Array.from(Array(number + 1), (_, i) => i).filter(i => number % i === 0)
}

function markTiles(tiles, selection, color) {
  let minX = Math.min(selection.coords[0].x, selection.coords[1].x);
  let maxX = Math.max(selection.coords[0].x, selection.coords[1].x);
  let minY = Math.min(selection.coords[0].y, selection.coords[1].y);
  let maxY = Math.max(selection.coords[0].y, selection.coords[1].y);
  for (let i = minY; i <= maxY; i++) {
    for (let j = minX; j <= maxX; j++) {
      tiles[i][j].marked = true;
      tiles[i][j].color = color;
    }
  }
}

function setNextCurrPlayer(currPlayer, state) {
  let players = state.players;
  let currIndex = players.indexOf(currPlayer);
  let nextIndex = (currIndex + 1) % players.length;
  players[currIndex].isCurrPlayer = false;
  players[nextIndex].isCurrPlayer = true;
  if (nextIndex == 0) { state.turn++; }
}

function isValidSelection(tiles, player) {
  let turn = player.turns[state.turn];
  let selection = turn.selection;
  if (selection.coords.length < 2) { return false; }
  if (product(turn.rolls) == areaOf(selection) && !overlapsPrevSelection(tiles, selection)) {
    return true;
  }
  return false;
}

function overlapsPrevSelection(tiles, selection) {
  let minX = Math.min(selection.coords[0].x, selection.coords[1].x);
  let maxX = Math.max(selection.coords[0].x, selection.coords[1].x);
  let minY = Math.min(selection.coords[0].y, selection.coords[1].y);
  let maxY = Math.max(selection.coords[0].y, selection.coords[1].y);
  for (let i = minY; i < maxY; i++) {
    for (let j = minX; j < maxX; j++) {
      if (tiles[i][j].marked) { return true; }
    }
  }
  return false;
}

function areaOf(selection) {
  if (selection.coords.length != 2) { return; }
  let coord1 = selection.coords[0];
  let coord2 = selection.coords[1];
  let width = Math.abs(coord1.x - coord2.x) + 1;
  let height = Math.abs(coord1.y - coord2.y) + 1;
  return height * width
}

function isCurrPlayer(id) {
  return getPlayerWithId(id) ? getPlayerWithId(id).isCurrPlayer : false;
}

function getPlayerWithId(id) {
  for (let i = 0; i < state.players.length; i++) {
    if (state.players[i].id == id) {
      return state.players[i];
    }
  }
  return undefined;
}

let colors = ['red', 'yellow', 'green', 'purple'];
let colorInd = -1;
function getColor() {
  colorInd++;
  return colors[colorInd % 4];
}

