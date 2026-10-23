/*
Bomberman:
  Autor: Korel Öztekin
  date: 15.03.2024
  version: 1.0.0 (web port with p5.js)
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
let playerOne;
let playerTwo;
let keyBombOne = 32;
let keyBombTwo = 18;

//map
let karte;

//HUD
let hud;

//animation
let ani;

//game
let startTimer = false;
let hitFrameMain = 0;
let animationCounter = 0;

//bomb
let bombP1 = [];
let bombP2 = [];
let explosionCountP1 = 0;
let explosionCountP2 = 0;


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
  skater0 = loadImage("sprites/skater0.png");
  skater = loadImage("sprites/skater.png");
  banner = loadImage("sprites/banner.png");
  fire = loadImage("sprites/fire.png");
  bomberman = loadImage("sprites/bomberman.png");
  logo = loadImage("sprites/logo.png");
  menubox = loadImage("sprites/Menu.png");
  bomberman2 = loadImage("sprites/bomberman2.png");
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

  playerOne = new Player(block + (block / 2), block + (block / 2)); //new Player (x,y);
  playerTwo = new Player(700 - 25, 700 - 25);
  karte = new Karte();
  hud = new HUD();
  ani = new Animations();

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
  });

  //RESET: keys when the tab loses focus, otherwise players keep walking
  window.addEventListener("blur", () => {
    playerOne.keys.fill(false);
    playerTwo.keys.fill(false);
  });
}


function draw() {
  const now = performance.now();
  accumulator = Math.min(accumulator + now - lastTime, STEP * 4);
  lastTime = now;

  //UPDATE: one game frame per 1/60 s (1 ms tolerance against timer jitter)
  while (accumulator >= STEP - 1) {
    accumulator -= STEP;
    frame++;
    resetMatrix();
    gameFrame();
  }
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
  }
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

    playerOne.itemCollected(karte.itemMap);
    playerTwo.itemCollected(karte.itemMap);

    playerOne.render(playerPic1);
    playerTwo.render(playerPic2);

    if (!playerOne.cooldown) {
      playerOne.move(karte.map, playerPic1);
    }
    if (!playerTwo.cooldown) {
      playerTwo.move(karte.map, playerPic2);
    }

    //CHANGE: state if player 0 live
    if ((playerOne.live == 0 && !playerOne.cooldown) || (playerTwo.live == 0 && !playerTwo.cooldown)) {
      hitFrameMain = frame;
      animationCounter = 0;
      gamemode = 3;
    }

    //DRAW: live, speed, bombcount, explosionradius, killtext
    hud.render(playerOne.live, playerOne.speed, playerOne.invBomb, playerTwo.live, playerTwo.speed, playerTwo.invBomb, playerOne.explosionRadius, playerTwo.explosionRadius);
  }
}

function bombPlant() {

  //COLISION: Explosion with player & Bomb with player
  for (let i = 0; i < bombP1.length; i++) {
    bombP1[i].bombPlanted(karte.map);
    playerOne.checkHit(bombP1[i].explosionMap, hit1);
    playerTwo.checkHit(bombP1[i].explosionMap, hit2);
    playerOne.checkBomb(bombP1[i].bombPos, bombP1[i].bombActive);
    playerTwo.checkBomb(bombP1[i].bombPos, bombP1[i].bombActive);

    //COLISION: Explosion with map
    karte.change(bombP1[i].explosionMap, !bombP1[i].explosionActive, !bombP1[i].bombActive);

    //COUNTER: How many explosions
    if (bombP1[i].explode) {
      explosionCountP1++;
      bombP1[i].explode = false;
    }
    //REMOVE: delete bomb after explosion
    if (!bombP1[i].bombActive && !bombP1[i].explosionActive) {
      bombP1.splice(i, 1);
      explosionCountP1--;
    }
  }

  //REPEAT: for player two
  for (let i = 0; i < bombP2.length; i++) {
    bombP2[i].bombPlanted(karte.map);
    playerOne.checkHit(bombP2[i].explosionMap, hit1);
    playerTwo.checkHit(bombP2[i].explosionMap, hit2);
    playerOne.checkBomb(bombP2[i].bombPos, bombP2[i].bombActive);
    playerTwo.checkBomb(bombP2[i].bombPos, bombP2[i].bombActive);

    //animation and change map after Explosion
    karte.change(bombP2[i].explosionMap, !bombP2[i].explosionActive, !bombP2[i].bombActive);

    if (bombP2[i].explode) {
      explosionCountP2++;
      bombP2[i].explode = false;
    }
    if (!bombP2[i].bombActive && !bombP2[i].explosionActive) {
      //delete Bomb
      bombP2.splice(i, 1);
      explosionCountP2--;
    }
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

  //BUTTON: Back to menu
  } else if (keyIsPressed) {
    playerOne.reset();
    playerTwo.reset();
    explosionCountP1 = 0;
    explosionCountP2 = 0;
    startTimer = false;
    animationCounter = 0;
    karte.resetMap();

    bombP1 = [];
    bombP2 = [];
    gamemode = 0;
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

//___________________________________________________________________________________________________
//___________________________________________________________________________________________________



function keyPressed() {
  //walk P1
  if (!playerOne.cooldown && gamemode == 2) {
    playerOne.keyPressed(keyCodeOne);
  }
  //walk P2
  if (!playerTwo.cooldown && gamemode == 2) {
    playerTwo.keyPressed(keyCodeTwo);
  }

  //bombkey P1
  if (keyBombOne == keyCode && !playerOne.cooldown && gamemode == 2) {
    if (playerOne.invBomb > bombP1.length - explosionCountP1) {
      //create new Bomb
      bombP1.push(new Bomb(playerOne.pos, playerOne.explosionRadius));
      bombPut.play(1, 0.04 * volume);
    }
  }

  //bombKey p2
  if (keyBombTwo == keyCode && !playerTwo.cooldown && gamemode == 2) {
    if (playerTwo.invBomb > bombP2.length - explosionCountP2) {
      //create new Bomb
      bombP2.push(new Bomb(playerTwo.pos, playerTwo.explosionRadius));
      bombPut.play(1, 0.04 * volume);
    }
  }

  //BROWSER: stop arrow keys / space from scrolling and ALT from opening the menu bar
  if ([18, 32, 37, 38, 39, 40, keyBombOne, keyBombTwo].includes(keyCode)) {
    return false;
  }
}

function keyReleased() {
  playerOne.keyReleased(keyCodeOne);
  playerTwo.keyReleased(keyCodeTwo);
  if (keyCode == 18) {
    return false;
  }
}

function mouseReleased() {
  soundChange = true;
  if (gamemode == 4) {
    gamemode = 0;
  }
}
