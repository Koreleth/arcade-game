/*
HUD class
  this class prints points, live and other variables you can see
  Autor: Korel Öztekin
  date: 15.03.2024
*/

class HUD {

  render(liveP1, speedP1, bombsP1, liveP2, speedP2, bombsP2, radiusP1, radiusP2) {
    imageMode(CENTER);


    //DRAW: Live P1
    if (liveP1 == 3) {
      pic(heart, 70, 25, 25, 25);
      pic(heart, 100, 25, 25, 25);
      pic(heart, 130, 25, 25, 25);
    }
    else if (liveP1 == 2) {
      pic(heart, 70, 25, 25, 25);
      pic(heart, 100, 25, 25, 25);
      pic(heart0, 130, 25, 25, 25);
    }
    else if (liveP1 == 1) {
      pic(heart, 70, 25, 25, 25);
      pic(heart0, 100, 25, 25, 25);
      pic(heart0, 130, 25, 25, 25);
    }

    //DRAW: Speed P1
    fill(100, 100, 255);
    rect(205, 25, 50, 20);
    pic(skater, 180, 25, 100, 100);
    fill(255);
    text(" x " + (speedP1 - 1), 210, 32);

    //DRAW: Bombinv P1
    fill(100, 100, 100);
    rect(295, 25, 50, 20);
    sprite(bombPic, 32, 0, 16, 16, 270, 27, 25, 25);
    fill(255);
    text(" x " + bombsP1, 298, 32);

    //DRAW: Explosionradius P1
    fill(200, 100, 0);
    rect(390, 25, 50, 20);
    pic(fire, 365, 25, 100, 100);
    fill(255);
    text(" x " + radiusP1, 395, 32);

    //DRAW: Image in corner
    sprite(playerPic1, 2, 36, 20, 20, 25, 25, 50, 50);


    //DRAW: Live P2
    if (liveP2 == 3) {
      imageMode(CENTER);
      pic(heart, 680, 725, 25, 25);
      pic(heart, 650, 725, 25, 25);
      pic(heart, 620, 725, 25, 25);
    }
    else if (liveP2 == 2) {
      pic(heart, 680, 725, 25, 25);
      pic(heart, 650, 725, 25, 25);
      pic(heart0, 620, 725, 25, 25);
    }
    else if (liveP2 == 1) {
      pic(heart, 680, 725, 25, 25);
      pic(heart0, 650, 725, 25, 25);
      pic(heart0, 620, 725, 25, 25);
    }

    //DRAW: Speed P2
    fill(100, 100, 255);
    rect(555, 725, 50, 20);
    pic(skater, 580, 725, 100, 100);
    fill(255);
    text(speedP2 - 1 + " x ", 550, 732);

    //DRAW: BombInv P2
    fill(100, 100, 100);
    rect(460, 725, 50, 20);
    sprite(bombPic, 32, 0, 16, 16, 490, 727, 25, 25);
    fill(255);
    text(bombsP2 + " x ", 453, 732);

    //DRAW: Explosioradius P2
    fill(200, 100, 0);
    rect(370, 725, 50, 20);
    pic(fire, 395, 725, 100, 100);
    fill(255);
    text(radiusP2 + " x ", 365, 732);

    //DRAW: Image corner
    sprite(playerPic2, 2, 36, 20, 20, 725, 725, 50, 50);


    //DRAW: Enviroment
    //birds
    const birdFrame = 20 * (idiv(frame, 10) % 4);
    sprite(bird, birdFrame, 0, 20, 16, 800 - (frame % 800), 590, 40, 32);
    sprite(bird, birdFrame, 0, 20, 16, 800 - ((frame - 170) % 800), 7400, 40, 32);
    sprite(bird, birdFrame, 0, 20, 16, 800 - ((idiv(frame, 3) - 200) % 800), 45);
    scale(-1, 1);
    sprite(bird, birdFrame, 0, 20, 16, -((frame - 70) % 800), 320, 40, 32);
    sprite(bird, birdFrame, 0, 20, 16, -(idiv(frame - 70, 2) % 800), 75, 30, 24);
    sprite(bird, birdFrame, 0, 20, 16, -(100 + idiv(frame, 3) % 800), 630);
    scale(-1, 1);

    imageMode(CORNER);
  }


  settingButton() {

    //ANIMATION: Hover over button
    if (mouseX < 70 && mouseX > 10 && mouseY < 70 && mouseY > 10) {
      cursor(HAND);
      if (mouseIsPressed) {
        if (!click.isPlaying()) {
          click.play(1, 0.05 * volume);
        }
        //game start
        gamemode = 1;
      }
    }
  }

  quitButton() {
    //ANIMATION: Hover over button
    if (mouseX < 740 && mouseX > 680 && mouseY < 60 && mouseY > 10) {
      cursor(HAND);
      if (mouseIsPressed) {
        menuSong.pause();
        gamemode = 4;
      }
    }
  }

  drawButtons() {
    //DRAW: Buttons
    pic(close, width - 30, 30, 40, 40);
    pic(menubox, 200, 500, 340 * addsize, 175 * addsize);
    fill(colorR, colorG, colorB);
    textFont(geospeed);
    textSize(50 * addsize);
    text("PLAY", 230, 540);
    textFont(pixel);
    textSize(20);
    fill(255);
    text("1.0.0", 70, 730);
    text("Bomberman", 70, 710);
  }

  drawMenu() {
    //DRAW: Menubackground
    fill(82, 115, 181);
    rect(width / 2, height / 2, width, height);
    pic(logo, 240, 120, 500, 500);
    pic(bomberman, width - 100 + movement.x, height / 2 + movement.y);
    pic(setting, 40, 40, 80, 80);
    hitFrameMain = frame;
  }

  drawSetting() {
    //DRAW: Settingbackground
    fill(82, 115, 181);
    pic(settingPage, width / 2, height / 2);
    fill(255);
  }

  drawTutorial() {
    //DRAW: Tutorial at beginning of game
    pic(tutorial, 0, 0);
    this.bombkeyDraw(275, 235, 470, 695, geospeed);
  }

  volumeDraw() {
    //DRAW: Volumebar
    rectMode(CORNER);
    noStroke();
    text("GAIN", width / 2, 40);
    fill(255, 70);
    rect(275, 55, 200, 10);
    fill(255, 255);
    rect(275, 55, 50 * volume, 10);
    rectMode(CENTER);
    // "-" sign
    rect(250, 60, 10, 5);
    // "+" sign
    rect(500, 60, 10, 5);
    rect(500, 60, 5, 10);
  }

  bombkeyDraw(xkey1, ykey1, xkey2, ykey2, thisFont) {
    //DRAW: Bombkey
    fill(255);
    textFont(thisFont);
    textSize(32);
    text(keyName(keyBombOne), xkey1, ykey1);
    text(keyName(keyBombTwo), xkey2, ykey2);
  }

  functionButtons() {
    //USE: Button back
    if (mouseX < 100 && mouseX > 10 && mouseY < 740 && mouseY > 680) {
      cursor(HAND);
      cursorHand = true;
      if (mouseIsPressed) {
        if (!click.isPlaying()) {
          click.play(1, 0.05 * volume);
        }
        gamemode = 0;
      }
    //CURSORDESIGN: Back to arrow
    } else if (!(mouseX < 300 && mouseX > 50 && mouseY < 580 && mouseY > 500) && !(mouseX < 670 && mouseX > 430 && mouseY < 580 && mouseY > 500)
      && !(mouseX < 510 && mouseX > 490 && mouseY < 70 && mouseY > 50) && !(mouseX < 260 && mouseX > 240 && mouseY < 70 && mouseY > 50)) {
      cursor(ARROW);
      cursorHand = false;
    }

    //USE: Change bombkey P1
    if (mouseX < 300 && mouseX > 50 && mouseY < 580 && mouseY > 500 && !keyChangeTwo) {
      cursor(HAND);
      cursorHand = true;
      if (mouseIsPressed) {
        keyChangeOne = true;
        if (!click.isPlaying()) {
          click.play(1, 0.05 * volume);
        }
      }
    }
    if (keyChangeOne) {
      textSize(18);
      text("changing KEYBIND of player one", width / 2, 690);
      text("Press KEY", width / 2, 720);
      if (keyIsPressed) {
        keyBombOne = keyCode;
        keyChangeOne = false;
      }
    }
    //USE: Change bombkey P2
    if (mouseX < 670 && mouseX > 430 && mouseY < 580 && mouseY > 500 && !keyChangeOne) {
      cursor(HAND);
      cursorHand = true;
      if (mouseIsPressed) {
        if (!click.isPlaying()) {
          click.play(1, 0.05 * volume);
        }
        keyChangeTwo = true;
      }
    }
    if (keyChangeTwo) {
      textSize(18);
      text("changing KEYBIND of player two", width / 2, 690);
      text("Press KEY", width / 2, 720);
      if (keyIsPressed) {
        keyBombTwo = keyCode;
        keyChangeTwo = false;
      }
    }

    //USE: sound volume -
    if (mouseX < 260 && mouseX > 240 && mouseY < 70 && mouseY > 50) {
      cursor(HAND);
      if (soundChange && mouseIsPressed) {
        if (volume > 0) {
          volume--;
        }
        if (!click.isPlaying()) {
          click.play(1, 0.05 * volume);
        }
        soundChange = false;
      }
    }
    //USE: sound volume +
    if (mouseX < 510 && mouseX > 490 && mouseY < 70 && mouseY > 50) {
      cursor(HAND);
      if (soundChange && mouseIsPressed) {
        if (volume < 4) {
          volume++;
        }
        if (!click.isPlaying()) {
          click.play(1, 0.05 * volume);
        }
        soundChange = false;
      }
    }
  }
}
