/*
Bomberman:
  Autor: Korel Öztekin
  date: 15.03.2024
  version: 1.1.0 (web port with p5.js, online mode for up to 4 players)
*/

let menuSong;
let hit1;
let hit2;
let click;
let bombPut;
let ambient;
let quake;
let winP1;
let winP2;
let explosionSound;
let itemCollected;
let spawn;
let slice;


//setup
let block = 50;
let gamemode = 0;
let pixel;
let heart;
let heart0;
let wall0;
let wall1;
let wall2;
let bombPic;
let items;
let explosionPic;
let playerPic1;
let playerPic2;
let playerPic3;
let playerPic4;
let skater0;
let skater;
let fire;
let banner;
let logo;
let setting;
let settingPage;
let close;
let kill;
let blood;
let bird;
let tutorial;

//player variables
let keyCodeOne = [87, 83, 65, 68]; //playerOne -> w,s,a,d and SPACE
let keyCodeTwo = [38, 40, 37, 39]; //playerTwo -> Arrowkeys and ALTGR
let keyBombOne = 32;
let keyBombTwo = 18;
let players = [];
let playerPics = [];
let winPics = [];
let hitSounds = [];
const PLAYER_NAMES = ["PLAYER ONE", "PLAYER TWO", "PLAYER THREE", "PLAYER FOUR"];

//map
let karte;
let rng = Math.random;

//HUD
let hud;

//animation
let ani;

//game
let startTimer = false;
let hitFrameMain = 0;
let animationCounter = 0;
let winner = -1;

//bomb (one list and one explosion counter per player)
let bombs = [];
let explosionCount = [];

//online: "local" = everyone on this keyboard, "host" / "client" = online lobby (see net.js)
let netMode = "local";
let myIndex = 0;


//MENU
let bomberman;
let bomberman2;
let menubox;
let movement = { x: 0, y: 0 };
let animation = 0;
let addsize = 1;
let geospeed;
let colorR = 255;
let colorG = 255;
let colorB = 255;
let volume = 1;

let keyChangeOne = false;
let keyChangeTwo = false;
let cursorHand = false;
let soundChange = false;
let endSound = false;

//TIMING: the game logic counts frames, so it runs at a fixed 60 steps per second
//        no matter how fast the monitor refreshes (60Hz, 144Hz, ...)
const STEP = 1000 / 60;
let frame = 0;
let accumulator = 0;
let lastTime = 0;


function preload() {
  heart = loadImage("sprites/heart.png");
  heart0 = loadImage("sprites/heart0.png");
  wall0 = loadImage("sprites/wall0.png");
  wall1 = loadImage("sprites/wall1.png");
  wall2 = loadImage("sprites/wall2.png");
  bombPic = loadImage("sprites/bombs.png");
  items = loadImage("sprites/items.png");
  explosionPic = loadImage("sprites/explosion.png");
  playerPic1 = loadImage("sprites/player1.png");
  playerPic2 = loadImage("sprites/player2.png");
  playerPic3 = loadImage("sprites/player3.png");
  playerPic4 = loadImage("sprites/player4.png");
  skater0 = loadImage("sprites/skater0.png");
  skater = loadImage("sprites/skater.png");
  banner = loadImage("sprites/banner.png");
  fire = loadImage("sprites/fire.png");
  bomberman = loadImage("sprites/bomberman.png");
  logo = loadImage("sprites/logo.png");
  menubox = loadImage("sprites/Menu.png");
  bomberman2 = loadImage("sprites/bomberman2.png");
  winPics = [bomberman, bomberman2, loadImage("sprites/bomberman3.png"), loadImage("sprites/bomberman4.png")];
  setting = loadImage("sprites/setting.png");
  close = loadImage("sprites/close.png");
  kill = loadImage("sprites/kill.png");
  blood = loadImage("sprites/Blood.png");
  bird = loadImage("sprites/bird.png");
  tutorial = loadImage("sprites/tutorial.png");

  settingPage = loadImage("sprites/settingpage.png");
  geospeed = loadFont("font/geospeed.ttf");
  pixel = loadFont("font/pixel.ttf");
}


function setup() {
  const canvas = createCanvas(750, 750);
  canvas.parent("game");
  frameRate(60);

  block = width / 15;

  rectMode(CENTER);
  textAlign(CENTER);
  imageMode(CENTER);
  textSize(20);

  playerPics = [playerPic1, playerPic2, playerPic3, playerPic4];
  hud = new HUD();
  ani = new Animations();
  loadSettings();

  menuSong = new SoundFile("sounds/thats-it-for-today-loop.wav"); //ViRiX Dreamcore, see credits
  hit1 = new SoundFile("sounds/hit1.wav");
  hit2 = new SoundFile("sounds/hit2.wav");
  bombPut = new SoundFile("sounds/plopp.wav");
  click = new SoundFile("sounds/setting.wav");
  quake = new SoundFile("sounds/321.mp3");
  ambient = new SoundFile("sounds/ambient1.wav");
  winP1 = new SoundFile("sounds/p1win.wav");
  winP2 = new SoundFile("sounds/p2win.wav");
  explosionSound = new SoundFile("sounds/explosion1.wav");
  slice = new SoundFile("sounds/slice.mp3");
  itemCollected = new SoundFile("sounds/itemcollect.wav");
  spawn = new SoundFile("sounds/spawn.wav");
  hitSounds = [hit1, hit2, hit1, hit2];

  initPanels();

  //DRAW: first frame behind the start overlay, then wait for the click
  frame++;
  menuRender();
  noLoop();

  const overlay = document.getElementById("start-overlay");
  document.getElementById("start-button").addEventListener("click", () => {
    audioCtx.resume();
    overlay.hidden = true;
    lastTime = performance.now();
    loop();
    //BACKGROUND: browsers pause draw() in hidden tabs, keep the game (and the online host) running
    setInterval(() => {
      if (document.hidden) {
        step();
      }
    }, STEP);
  });

  //RESET: keys when the tab loses focus, otherwise players keep walking
  window.addEventListener("blur", releaseAllKeys);
}


function draw() {
  step();
}


function step() {
  const now = performance.now();
  //the online host may catch up to one second, everybody else at most 4 frames
  const maxBehind = (netMode == "host" && gamemode == 2) ? 60 : 4;
  accumulator = Math.min(accumulator + now - lastTime, STEP * maxBehind);
  lastTime = now;

  //ONLINE CLIENT: the host decides when the next game frame happens
  if (netMode == "client" && gamemode == 2) {
    clientFrames();
    return;
  }

  //UPDATE: one game frame per 1/60 s (1 ms tolerance against timer jitter)
  const outgoing = [];
  while (accumulator >= STEP - 1) {
    accumulator -= STEP;
    if (netMode == "host" && gamemode == 2) {
      //ONLINE HOST: every frame gets the inputs that arrived since the last one
      const events = pendingEvents;
      pendingEvents = [];
      outgoing.push([frame + 1, events]);
      runFrame(events);
    } else {
      runFrame([]);
    }
  }
  if (outgoing.length > 0) {
    sendFrames(outgoing);
  }
}


function runFrame(events) {
  for (const event of events) {
    applyEvent(event);
  }
  frame++;
  resetMatrix();
  gameFrame();
}


function gameFrame() {
  switch (gamemode) {
    case 0:
      menuRender();
      break;

    case 1:
      settings();
      break;

    case 2:
      gamestart();
      break;

    case 3:
      endScreen();
      break;

    case 4:
      quitScreen();
      break;

    case 5:
    case 6:
      panelBackground();
      break;
  }
}


//SWITCH: game state + show the matching HTML panel (5 = local / online, 6 = lobby)
function showScreen(mode) {
  gamemode = mode;
  document.getElementById("panel-mode").hidden = mode != 5;
  document.getElementById("panel-lobby").hidden = mode != 6;
}


//START: a new round for count players, online every browser uses the same seed
function startMatch(count, seed) {
  const spawns = [
    [block + (block / 2), block + (block / 2)], //top left
    [700 - 25, 700 - 25],                       //bottom right
    [700 - 25, block + (block / 2)],            //top right
    [block + (block / 2), 700 - 25]             //bottom left
  ];
  players = [];
  bombs = [];
  explosionCount = [];
  for (let i = 0; i < count; i++) {
    players.push(new Player(spawns[i][0], spawns[i][1])); //new Player (x,y);
    bombs.push([]);
    explosionCount.push(0);
  }
  karte = new Karte();
  rng = seed === undefined ? Math.random : seededRandom(seed);

  frame = 0;
  hitFrameMain = 0;
  startTimer = false;
  animationCounter = 0;
  endSound = false;
  winner = -1;
  showScreen(2);
}



//case 0:
function menuRender() {
  imageMode(CENTER);
  if (!menuSong.isPlaying()) {
    menuSong.loop(1, 0.02 * volume);
  }
  //DRAW Menu
  hud.drawMenu();

  //animationcounter
  ani.variable();

  // BUTTON: Play
  ani.playButton();

  // BUTTON: Settings
  hud.settingButton();

  // BUTTON: Quit
  hud.quitButton();

  //DRAW: Buttons
  hud.drawButtons();
}
//__________________________________________________________________________________________
// __________________________________________________________________________________________


//case 1:
function settings() {
  imageMode(CENTER);
  //DRAW: Setting background
  hud.drawSetting();

  //USE: Button
  hud.functionButtons();

  //DRAW: Volume
  hud.volumeDraw();

  //DRAW: Bombkey (xPos of KEYCODE P1, yPos of KEYCODE P1, xPos of KEYCODE P2, yPos of KEYCODE P2, FONT);
  hud.bombkeyDraw(185, 545, 555, 545, pixel);
}

//___________________________________________________________________
//___________________________________________________________________



//case 2:
function gamestart() {
  //gamemode
  cursor(ARROW);
  textFont(pixel);
  textSize(18);
  karte.render();

  if (menuSong.isPlaying()) {
    menuSong.pause();
  }

  //TIMER: 3,2,1,.. Counter + ANIMATION: Numbers
  if (!startTimer) {
    ani.beforeGame();
    hud.drawTutorial();
  }


  else {
    //TIMER: cooldown
    ani.coolDownTimer();

    //DRAW: BombList
    bombPlant();

    for (const player of players) {
      if (player.live > 0) {
        player.itemCollected(karte.itemMap);
      }
    }

    players.forEach((player, i) => player.render(playerPics[i]));

    players.forEach((player, i) => {
      if (!player.cooldown && player.live > 0) {
        player.move(karte.map, playerPics[i]);
      }
    });

    //DRAW: marker above the own character in online games
    if (netMode != "local" && players[myIndex] && players[myIndex].live > 0 && !players[myIndex].cooldown) {
      const me = players[myIndex];
      push();
      fill(255);
      stroke(0);
      strokeWeight(2);
      triangle(me.pos.x - 7, me.pos.y - 48, me.pos.x + 7, me.pos.y - 48, me.pos.x, me.pos.y - 39);
      pop();
    }

    //CHANGE: state if only one player is left (after the death animation)
    const alive = players.filter((player) => player.live > 0);
    const dying = players.some((player) => player.live == 0 && player.cooldown);
    if (alive.length <= 1 && !dying) {
      winner = alive.length == 1 ? players.indexOf(alive[0]) : -1;
      hitFrameMain = frame;
      animationCounter = 0;
      gamemode = 3;
    }

    //DRAW: live, speed, bombcount, explosionradius, killtext
    if (players.length == 2) {
      const [playerOne, playerTwo] = players;
      hud.render(playerOne.live, playerOne.speed, playerOne.invBomb, playerTwo.live, playerTwo.speed, playerTwo.invBomb, playerOne.explosionRadius, playerTwo.explosionRadius);
    } else {
      players.forEach((player, i) => hud.renderCompact(player, i));
      hud.drawBirds();
    }
  }
}

function bombPlant() {

  //REPEAT: for the bombs of every player
  for (let owner = 0; owner < players.length; owner++) {
    const list = bombs[owner];
    for (let i = 0; i < list.length; i++) {
      list[i].bombPlanted(karte.map);

      //COLISION: Explosion with player & Bomb with player
      players.forEach((player, p) => {
        if (player.live > 0) {
          player.checkHit(list[i].explosionMap, hitSounds[p]);
        }
      });
      for (const player of players) {
        if (player.live > 0) {
          player.checkBomb(list[i].bombPos, list[i].bombActive);
        }
      }

      //COLISION: Explosion with map
      karte.change(list[i].explosionMap, !list[i].explosionActive, !list[i].bombActive);

      //COUNTER: How many explosions
      if (list[i].explode) {
        explosionCount[owner]++;
        list[i].explode = false;
      }
      //REMOVE: delete bomb after explosion
      if (!list[i].bombActive && !list[i].explosionActive) {
        list.splice(i, 1);
        explosionCount[owner]--;
      }
    }
  }
}

function placeBomb(p) {
  if (players[p].invBomb > bombs[p].length - explosionCount[p]) {
    //create new Bomb
    bombs[p].push(new Bomb(players[p].pos, players[p].explosionRadius));
    bombPut.play(1, 0.04 * volume);
  }
}
//___________________________________________________________________________________________________
//___________________________________________________________________________________________________

//case 3:
function endScreen() {
  ambient.stop();
  karte.render();

  //ANIMATION: Counter
  if (animationCounter >= 300 && animationCounter < 350) {
    animationCounter++;
  } else if (animationCounter < 300) {
    animationCounter = animationCounter + 25;

  //BUTTON: Back to menu (online: back to the lobby)
  } else if (keyIsPressed) {
    animationCounter = 0;
    if (netMode == "local") {
      showScreen(0);
    } else {
      backToLobby();
    }
    return;
  }

  //DRAW Background banner
  ani.endAnimation();
}

//___________________________________________________________________________________________________
//___________________________________________________________________________________________________

//case 4: a browser tab can not be closed by the game, so QUIT shows this screen with the credits
function quitScreen() {
  cursor(ARROW);
  fill(0);
  rect(width / 2, height / 2, width, height);
  fill(255);
  textFont(geospeed);
  textSize(48);
  text("THANKS FOR", width / 2, 250);
  text("PLAYING", width / 2, 310);

  //CREDITS
  textFont(pixel);
  textSize(22);
  text("CREDITS", width / 2, 430);
  textSize(16);
  text("Game by Korel Öztekin", width / 2, 470);
  text("Some of the songs and/or sound effects in this project", width / 2, 520);
  text("were created by ViRiX Dreamcore (David Mckee).", width / 2, 545);
  text("www.virixcore.net for more information", width / 2, 570);

  textSize(20);
  text("CLICK TO GO BACK", width / 2, 700);
}

//case 5 + 6: background behind the HTML panels (local / online, lobby)
function panelBackground() {
  imageMode(CENTER);
  cursor(ARROW);
  if (!menuSong.isPlaying()) {
    menuSong.loop(1, 0.02 * volume);
  }
  fill(82, 115, 181);
  rect(width / 2, height / 2, width, height);
  ani.variable();
  pic(bomberman, width - 100 + movement.x, height / 2 + movement.y);
}

//___________________________________________________________________________________________________
//___________________________________________________________________________________________________


//INPUT: events are [player, type, direction], type 0 = press, 1 = release, 2 = bomb, 3 = left the game
function applyEvent([p, type, direction]) {
  const player = players[p];
  if (!player) {
    return;
  }
  if (type == 0) {
    if (!player.cooldown && player.live > 0 && gamemode == 2) {
      player.pressDirection(direction);
    }
  } else if (type == 1) {
    player.releaseDirection(direction);
  } else if (type == 2) {
    if (!player.cooldown && player.live > 0 && gamemode == 2) {
      placeBomb(p);
    }
  } else if (type == 3) {
    player.live = 0;
    player.cooldown = false;
    player.keys.fill(false);
  }
}

//INPUT: online both key sets control the own character
function ownInput(type, direction) {
  if (netMode == "host") {
    pendingEvents.push([myIndex, type, direction]);
  } else {
    sendInput(type, direction);
  }
}

function keyPressed() {
  if (gamemode == 2) {
    if (netMode == "local") {
      //walk P1 + P2
      [keyCodeOne, keyCodeTwo].forEach((keySet, p) => {
        const direction = keySet.indexOf(keyCode);
        if (direction >= 0) {
          applyEvent([p, 0, direction]);
        }
      });
      //bombkey P1 + P2
      if (keyCode == keyBombOne) {
        applyEvent([0, 2, 0]);
      }
      if (keyCode == keyBombTwo) {
        applyEvent([1, 2, 0]);
      }
    } else {
      const direction = Math.max(keyCodeOne.indexOf(keyCode), keyCodeTwo.indexOf(keyCode));
      if (direction >= 0) {
        ownInput(0, direction);
      }
      if (keyCode == keyBombOne || keyCode == keyBombTwo) {
        ownInput(2, 0);
      }
    }
  }

  //BROWSER: stop arrow keys / space from scrolling and ALT from opening the menu bar
  if (document.activeElement.tagName != "INPUT" && [18, 32, 37, 38, 39, 40, keyBombOne, keyBombTwo].includes(keyCode)) {
    return false;
  }
}

function keyReleased() {
  if (netMode == "local") {
    [keyCodeOne, keyCodeTwo].forEach((keySet, p) => {
      const direction = keySet.indexOf(keyCode);
      if (direction >= 0) {
        applyEvent([p, 1, direction]);
      }
    });
  } else if (gamemode == 2) {
    const direction = Math.max(keyCodeOne.indexOf(keyCode), keyCodeTwo.indexOf(keyCode));
    if (direction >= 0) {
      ownInput(1, direction);
    }
  }
  if (keyCode == 18) {
    return false;
  }
}

function releaseAllKeys() {
  if (netMode == "local") {
    for (const player of players) {
      player.keys.fill(false);
    }
  } else if (gamemode == 2) {
    for (let direction = 0; direction < 4; direction++) {
      ownInput(1, direction);
    }
  }
}

function mouseReleased() {
  soundChange = true;
  if (gamemode == 4) {
    gamemode = 0;
  }
}
