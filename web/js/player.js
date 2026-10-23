/*
Player class
  creates player one and player two, creating variables, and checking collisions with #Karte
  Autor: Korel Öztekin
  date: 15.03.2024
*/


class Player {

  //CONSTRUCTOR
  constructor(x, y) {
    //ITEM variables
    this.speed = 2;
    this.invBomb = 1;
    this.explosionRadius = 1;

    //player variables
    this.live = 3;
    this.hit = true;
    this.cooldown = false;
    this.respawntimer = true;

    //playerposition
    this.pos = { x: x, y: y };
    this.spawnPos = { x: x, y: y };
    //playersize
    this.pWidth = 18;
    this.pHeight = 24;
    this.imageFactor = 2.3;
    this.correcture = 12;
    this.playerMapX = 0;
    this.playerMapY = 0;

    this.hitframe = 0;
    this.keys = [false, false, false, false];
    this.playerInBomb = false;
    this.lastDirection = 0;
  }

  render(playerPic) {
    rectMode(CENTER);

    //ANIMATION: Hit by explosion
    if (this.cooldown) {
      imageMode(CENTER);
      pic(blood, width / 2, height / 2);
      pic(kill, width / 2 + frame % 5, height / 2 + frame % 10);
      this.drawFrame(playerPic, 24 * (idiv(frame, 5) % 6), 32 * 5, false);
      imageMode(CORNER);
    }
  }

  //DRAW: one 24x32 frame of the spritesheet at the player position (flip = looking left)
  drawFrame(playerPic, sx, sy, flip) {
    imageMode(CENTER);
    const w = this.imageFactor * this.pWidth;
    const h = this.imageFactor * this.pHeight;
    if (flip) {
      scale(-1, 1);
      sprite(playerPic, sx, sy, 24, 32, -this.pos.x, this.pos.y - this.correcture, w, h);
      scale(-1, 1);
    } else {
      sprite(playerPic, sx, sy, 24, 32, this.pos.x, this.pos.y - this.correcture, w, h);
    }
  }


  move(map, playerPic) {
    const pos = this.pos;
    const speed = this.speed;
    const halfW = this.pWidth / 2;
    const halfH = this.pHeight / 2;
    const walkFrame = 24 + (24 * (idiv(frame, 10) % 2));

    this.playerMapY = toInt(pos.y / block);
    this.playerMapX = toInt(pos.x / block);
    if (this.respawntimer && !this.cooldown) {
      if (idiv(frame, 10) % 2 == 0)
        drawingContext.globalAlpha = 0.5;
    } else {
      drawingContext.globalAlpha = 1;
    }

    //COLISION: with Bomb, destroyable wall, hard wall
    if (this.keys[0] || this.keys[1] || this.keys[2] || this.keys[3]) {

      //WALK: Up
      if (this.keys[0]) {
        if (map[toInt(((pos.y - speed) - halfH) / block)][toInt((pos.x + halfW) / block)] == 1 &&
          map[toInt(((pos.y - speed) - halfH) / block)][toInt((pos.x - halfW) / block)] == 1) {
          pos.y -= speed;
        }
        this.drawFrame(playerPic, walkFrame, 64, false);
        this.lastDirection = 2;
      }

      //WALK: Down
      if (this.keys[1]) {
        if (map[toInt(((pos.y + speed) + halfH) / block)][toInt((pos.x + halfW) / block)] == 1 &&
          map[toInt(((pos.y + speed) + halfH) / block)][toInt((pos.x - halfW) / block)] == 1) {
          pos.y += speed;
        }
        this.drawFrame(playerPic, walkFrame, 32, false);
        this.lastDirection = 1;
      }

      //WALK: Left
      if (this.keys[2]) {
        if (map[toInt((pos.y - halfH) / block)][toInt(((pos.x - speed) - halfW) / block)] == 1 &&
          map[toInt((pos.y + halfH) / block)][toInt(((pos.x - speed) - halfW) / block)] == 1) {
          pos.x -= speed;
        }
        this.drawFrame(playerPic, walkFrame, 0, true);
        this.lastDirection = 3;
      }

      //WALK: Right
      if (this.keys[3]) {
        if (map[toInt((pos.y - halfH) / block)][toInt(((pos.x + speed) + halfW) / block)] == 1 &&
          map[toInt((pos.y + halfH) / block)][toInt(((pos.x + speed) + halfW) / block)] == 1) {
          pos.x += speed;
        }
        this.drawFrame(playerPic, walkFrame, 0, false);
        this.lastDirection = 0;
      }

    //ANIMATION: while not walkin
    } else if (!this.cooldown) {
      if (this.lastDirection != 3) {
        this.drawFrame(playerPic, 0, 32 * this.lastDirection, false);
      } else {
        this.drawFrame(playerPic, 0, 0, true);
      }
    }
    drawingContext.globalAlpha = 1;
  }


  checkHit(explosionMap, hitSound) {

    //COLISION: Player hit with bomb
    if (explosionMap[toInt((this.pos.y + this.pHeight - 15) / block)][this.playerMapX] == 3 || explosionMap[toInt((this.pos.y - this.pHeight + 30) / block)][this.playerMapX] == 3
      || explosionMap[this.playerMapY][toInt((this.pos.x + this.pWidth - 20) / block)] == 3 || explosionMap[this.playerMapY][toInt((this.pos.x - this.pWidth + 20) / block)] == 3) {
      this.hit = true;

      //START: Cooldown
      if (this.hit && !this.respawntimer) {
        this.live = this.live - 1;
        hitSound.play(1, 0.1 * volume);
        this.respawntimer = true;
        slice.play(1, 0.1 * volume);
        this.cooldown = true;
        // to mainclass
        this.hitframe = frame;
      }
    }
  }


  checkBomb(bombPos, bombActive) {
    const pos = this.pos;
    const speed = this.speed;

    //COLISION: Player with bomb
    if (((pos.x) > (bombPos.x - 40) && (pos.x) < (bombPos.x + 40)) && ((pos.y) > (bombPos.y - 40) && (pos.y) < (bombPos.y + 40))) {
      this.playerInBomb = true;
    } else {
      this.playerInBomb = false;
    }
    if ((((pos.x + speed) >= bombPos.x - 40 && !(pos.x >= bombPos.x + 40)) && (pos.y <= bombPos.y + 40 && pos.y >= bombPos.y - 40)) && !this.playerInBomb && bombActive) {
      this.keys[3] = false;
    }
    if ((((pos.x - speed) <= bombPos.x + 40 && !(pos.x <= bombPos.x - 40)) && (pos.y <= bombPos.y + 40 && pos.y >= bombPos.y - 40)) && !this.playerInBomb && bombActive) {
      this.keys[2] = false;
    }
    if ((((pos.y + speed) >= bombPos.y - 40 && !(pos.y >= bombPos.y + 40)) && (pos.x <= bombPos.x + 40 && pos.x >= bombPos.x - 40)) && !this.playerInBomb && bombActive) {
      this.keys[1] = false;
    }
    if ((((pos.y - speed) <= bombPos.y + 40 && !(pos.y <= bombPos.y - 40)) && (pos.x <= bombPos.x + 40 && pos.x >= bombPos.x - 40)) && !this.playerInBomb && bombActive) {
      this.keys[0] = false;
    }
  }

  itemCollected(itemMap) {
    //COLISION: Player with Item
    if (itemMap[this.playerMapY][this.playerMapX] == 1) {
      this.invBomb++;
      itemMap[this.playerMapY][this.playerMapX] = 0;
      itemCollected.play(1, 0.05 * volume);
    } else if (itemMap[this.playerMapY][this.playerMapX] == 2) {
      this.explosionRadius++;
      itemMap[this.playerMapY][this.playerMapX] = 0;
      itemCollected.play(1, 0.05 * volume);
    } else if (itemMap[this.playerMapY][this.playerMapX] == 3) {
      this.speed++;
      itemMap[this.playerMapY][this.playerMapX] = 0;
      itemCollected.play(1, 0.05 * volume);
    }
  }

  respawn() {
    this.pos.x = this.spawnPos.x;
    this.pos.y = this.spawnPos.y;
  }


  //for movement (direction: 0 = up, 1 = down, 2 = left, 3 = right)

  pressDirection(direction) {
    this.keys[direction] = true;
    //up / down stops left / right and the other way around
    if (direction < 2) {
      this.keys[2] = false;
      this.keys[3] = false;
    } else {
      this.keys[0] = false;
      this.keys[1] = false;
    }
  }

  releaseDirection(direction) {
    this.keys[direction] = false;
  }
}
