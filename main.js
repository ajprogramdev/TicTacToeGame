/*=====Main gameBoard=====*/
const gameBoard = (function () {
  const root = document.getElementById('root');
  const topHead = document.getElementById('top-header');
  const startBtn = document.getElementById('start-btn');
  const arrPlayers = [];
  const player1 = document.getElementById('player1');
  const player2 = document.getElementById('player2');

  //Object Player
  const player = (name, marker) => {
    let turn = true;
    let score = 0;
    return { name, marker, turn, score };
  };

  //Event Start
  startBtn.addEventListener('click', () => {
    if (player1.value !== '' && player2.value !== '') {
      start();
      startBtn.style.display = 'none';
      document.getElementById('player-form').style.display = 'none';
    } else {
      alert('Please fill both player boxes.');
    }
  });

  function start() {
    createPlayers();
    renderHeader();
    renderGrid();
    gameLogic.playerTurn();
    gridChildevent();
    renderPlayerTurn();
  }

  //Create Object Player
  function createPlayers() {
    arrPlayers.push(player(player1.value, 'o'));
    arrPlayers.push(player(player2.value, 'x'));
  }

  function renderHeader() {
    const div = document.createElement('div');
    let value = 0;
    arrPlayers.forEach((el) => {
      const h1 = document.createElement('h1');
      h1.classList = `h1${value}`;
      const span = document.createElement('span');
      span.appendChild(document.createTextNode(`Score:${el.score}`));
      const text = document.createTextNode(`${el.name} [${el.marker}]`);
      h1.appendChild(text);
      h1.appendChild(span);
      div.appendChild(h1);
      topHead.appendChild(div);
      value++;
    });
    div.classList = 'top-head-player';
  }
  function renderPlayerTurn() {
    const play1Turn = document.getElementsByClassName('h10')[0];
    const play2Turn = document.getElementsByClassName('h11')[0];

    if (arrPlayers[0].turn == true) {
      play1Turn.style.backgroundColor = '#76FF03';
      play2Turn.style.backgroundColor = '';
    } else if (arrPlayers[1].turn == true) {
      play2Turn.style.backgroundColor = '#76FF03';
      play1Turn.style.backgroundColor = '';
    }
  }
  function updatescore() {
    topHead.removeChild(topHead.lastElementChild);
    gridChildRemoveListener();
    renderHeader();
    resetGrid();
  }

  /*Builds the canvas for the game. */
  function renderGrid() {
    const div = document.createElement('div');
    div.classList = 'grid-build';
    for (let i = 0; i < 9; i++) {
      const divChilds3x3 = document.createElement('div');
      divChilds3x3.classList = 'grid-child';
      divChilds3x3.setAttribute('grid-pos', i);
      div.appendChild(divChilds3x3);
    }
    root.appendChild(div);
  }

  function gridChildCallback(e) {
    let pos = e.target.getAttribute('grid-pos');
    if (
      gameLogic.arrPositions[pos] !== arrPlayers[0].marker &&
      gameLogic.arrPositions[pos] !== arrPlayers[1].marker
    ) {
      if (arrPlayers[0].turn) {
        gameLogic.arrPositions[pos] = arrPlayers[0].marker;
        e.target.style.backgroundImage = 'url("./img/toeImg.png")';
      } else if (arrPlayers[1].turn) {
        gameLogic.arrPositions[pos] = arrPlayers[1].marker;
        e.target.style.backgroundImage = 'url("./img/ticImg.png")';
      }
      gameLogic.checkWinner();
    }
  }

  function gridChildRemoveListener() {
    const child = document.querySelectorAll('.grid-child');
    child.forEach((el) => {
      el.removeEventListener('click', gridChildCallback);
    });
  }

  /*adds event to grid-child */
  function gridChildevent() {
    const child = document.querySelectorAll('.grid-child');
    child.forEach((el) => {
      el.addEventListener('click', gridChildCallback);
    });
  }

  function resetGrid() {
    setTimeout(function () {
      root.removeChild(root.lastElementChild);
      renderGrid();
      gridChildevent();
      gameLogic.reset();
      gameLogic.playerTurn();
    }, 2000);
  }

  function renderGridWinner(winner) {
    const child = document.querySelectorAll('.grid-child');
    winner.forEach((el) => {
      child[el].style.backgroundColor = '#76FF03';
    });
  }

  return {
    gridChildevent,
    arrPlayers,
    renderGridWinner,
    updatescore,
    renderPlayerTurn,
  };
})();

/*=====GameLogic=====*/
const gameLogic = (function () {
  let count = 0;
  let arrPositions = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'];

  let arrWinningPos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [2, 4, 6],
    [0, 4, 8],
  ];

  function checkWinner() {
    let winner = false;
    let winPlayer = '';
    count++;
    arrWinningPos.forEach((arr) => {
      let str = '';
      arr.forEach((el) => {
        str += arrPositions[el];
      });

      if (str == 'xxx') {
        gameBoard.renderGridWinner(arr);
        winPlayer += 'x';
        winner = true;
      }
      if (str == 'ooo') {
        gameBoard.renderGridWinner(arr);
        winPlayer += 'o';
        winner = true;
      }
    });
    if (winner) {
      let win = gameBoard.arrPlayers[0].marker == winPlayer ? 0 : 1;
      winPlayer =
        gameBoard.arrPlayers[0].marker == winPlayer
          ? gameBoard.arrPlayers[0].name
          : gameBoard.arrPlayers[1].name;
      console.log(`The winner is ${winPlayer}`);
      score(win);
    } else if (!winner && count == 9) {
      console.log(`There was a tie`);
      score(null);
    } else {
      playerTurn();
    }
  }

  function playerTurn() {
    if (gameBoard.arrPlayers[0].turn == true) {
      gameBoard.arrPlayers[0].turn = false;
      gameBoard.arrPlayers[1].turn = true;
      gameBoard.renderPlayerTurn();
    } else if (gameBoard.arrPlayers[1].turn == true) {
      gameBoard.arrPlayers[1].turn = false;
      gameBoard.arrPlayers[0].turn = true;
      gameBoard.renderPlayerTurn();
    }
  }

  function score(win) {
    if (win == 0) {
      gameBoard.arrPlayers[0].score++;
    } else if (win == 1) {
      gameBoard.arrPlayers[1].score++;
    }
    gameBoard.updatescore();
  }

  function reset() {
    count = 0;
    for (let i = 0; i < arrPositions.length; i++) {
      arrPositions[i] = '';
    }
    console.log(arrPositions);
  }

  return { playerTurn, checkWinner, arrPositions, reset };
})();
