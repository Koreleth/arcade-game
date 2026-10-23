/*
Animations class
  menu hover, countdown before the game, respawn timers and the end screen
  Autor: Korel Öztekin
  date: 15.03.2024
*/


class Animations {

  playButton() {
    if (mouseX < 370 && mouseX > 30 && mouseY < 560 && mouseY > 480) {
      this.hover();
      cursor(HAND);
      if (mouseIsPressed) {
        //gamestart sound
        if (!click.isPlaying()) {
          click.play(1, 0.05 * volume);
        }
        gamemode = 2;
      }
    } else if (!(mouseX < 70 && mouseX > 10 && mouseY < 70 && mouseY > 10) &&
      !(mouseX < 740 && mouseX > 680 && mouseY < 60 && mouseY > 10)) {
      this.resetHover();
    }
  }


  hover() {
    addsize = 1.02;
    colorR = 235;
    colorG = 140;
    colorB = 70;
    cursor(HAND);
  }

  //RESET: Cursor and color
  resetHover() {
    addsize = 1;
    colorR = 255;
    colorG = 255;
    colorB = 255;
    cursor(ARROW);
  }

  variable() {
    //ANIMATION: Counter for menu character
    if (frame % 2 == 0) {
      switch (animation) {
        case 0:
          movement.x++;
          if (movement.x > 60) {
            animation = 1;
          }
          break;
        case 1:
          movement.x--;
          if (movement.x < 0) {
            animation = 0;
          }
          break;
      }
    }
  }

  beforeGame() {

    //COUNTER: int ++ and int--
    if (animationCounter >= 350 && animationCounter < 395) {
      animationCounter++;
    } else {
      animationCounter = animationCounter + 50;
    }
    if (animationCounter > 750) {
      animationCounter = 0;
    }

    textSize(100);

    const seconds = idiv(frame - hitFrameMain, 60);

    //TIMER: 0 -> DRAW: "Fight"
    if (seconds % 4 == 3) {
      fill(82, 115, 181);
      rect(width / 2, height / 2, 750, 100);
      sprite(bomberman, 0, 200, 750, 100, 300, 325);
      fill(255);
      text("FIGHT", width / 2, 410);

    //TIMER: 3-1 -> DRAW: "number"
    } else if (3 - seconds >= 0) {
      if (!quake.isPlaying()) {
        quake.play(1, 0.05 * volume);
      }
      fill(82, 115, 181);
      rect(width / 2, height / 2, 750, 100);
      sprite(bomberman, 0, 200, 750, 100, 300, 325);
      fill(255);
      text(3 - seconds, animationCounter, 410);
    }

    //RESET: hitframe for cooldown
    if (seconds % 5 == 4) {
      playerOne.hitframe = frame;
      playerTwo.hitframe = frame;
      startTimer = true;
      if (!ambient.isPlaying()) {
        ambient.loop(1, 0.1 * volume);
      }
    }
  }

  coolDownTimer() {
    //cooldown Timer
    if (playerOne.cooldown && (frame - playerOne.hitframe) % 120 == 0) {
      playerOne.respawn();
      spawn.play(1, 0.05 * volume);
      playerOne.cooldown = false;
    }
    if (playerTwo.cooldown && (frame - playerTwo.hitframe) % 120 == 0) {
      playerTwo.respawn();
      spawn.play(1, 0.05 * volume);
      playerTwo.cooldown = false;
    }
    if (playerOne.respawntimer && (frame - playerOne.hitframe) % 300 == 0) {
      playerOne.respawntimer = false;
    }
    if (playerTwo.respawntimer && (frame - playerTwo.hitframe) % 240 == 0) {
      playerTwo.respawntimer = false;
    }
    //cooldown Timer end
  }


  endAnimation() {

    const bannerWidth = Math.min(50 * (frame - hitFrameMain), banner.width);
    if (bannerWidth > 0) {
      sprite(banner, 0, 0, bannerWidth, 750, 0, 0);
    }

    //Show WinnerTIE
    if ((playerOne.live == 0 && !playerOne.cooldown) && (playerTwo.live == 0 && !playerTwo.cooldown)) {
      textFont(geospeed);
      textSize(128);
      fill(255);
      text("TIE", animationCounter, height / 2 + 40);

    } else {
      //SHOW Winner P2
      if (playerOne.live == 0) {

        textFont(geospeed);
        textSize(48);
        fill(255);
        text("PLAYER TWO", animationCounter - 130, (height / 2) + 20);
        text("WINS", animationCounter - 130, (height / 2) + 60);
        pic(bomberman2, animationCounter - 80, 0);

        if (!endSound) {
          winP2.play(1, 0.1 * volume);
          endSound = true;
        }

      //SHOW WIinner P1
      } else if (playerTwo.live == 0) {
        textFont(geospeed);
        textSize(48);
        fill(255);
        text("PLAYER ONE", animationCounter + 150, (height / 2));
        text("WINS", animationCounter + 150, (height / 2) + 40);
        scale(-1, 1);
        pic(bomberman, -1 * animationCounter - 200, 0);
        scale(-1, 1);
        if (!endSound) {
          winP1.play(1, 0.1 * volume);
          endSound = true;
        }
      }
    }
    //ANIMATION draw
    if (animationCounter >= 350) {
      textSize(40);
      fill(255, 150 + ((5 * frame) % 205));
      text("PRESS ANY KEY", width / 2, 700);
    }
  }
}
