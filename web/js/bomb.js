/*
Bomb class
  if keypressed, this class will be created. After explosion it will be dealeted
  Autor: Korel Öztekin
  date: 15.03.2024
*/


class Bomb {

  constructor(playerPos, explosionRadius) {
    //BOMB: Planting Center of player position
    this.bombPos = {
      x: toInt(playerPos.x / block) * block + (block / 2),
      y: toInt(playerPos.y / block) * block + (block / 2)
    };
    //ITEM Variable
    this.bombMultipliyer = explosionRadius;

    this.bombActive = true;
    this.explosionActive = false;
    this.explode = false;
    this.explosionMap = grid();

    this.hitframe = frame;
  }

  bombPlanted(map) {
    imageMode(CENTER);
    const animFrame = 16 * (idiv(frame, 15) % 4);

    //DRAW: Bomb
    if (this.bombActive) {
      sprite(bombPic, animFrame, 0, 16, 16, this.bombPos.x, this.bombPos.y, 40, 40);

      //TIMER: Bomb -> Explode
      if ((frame - this.hitframe) % 150 == 0) {
        this.explosionActive = true;
        this.bombActive = false;
        this.hitframe = frame;
        this.explode = true;
        explosionSound.play(1, 0.2 * volume);
      }
      imageMode(CORNER);


    //______________explosion_______________________


    } if (this.explosionActive) {
      imageMode(CENTER);

      //DRAW: explosioncenter
      sprite(explosionPic, 96, animFrame, 16, 16, this.bombPos.x, this.bombPos.y, block, block);
      this.explosionMap[toInt(this.bombPos.y / block)][toInt(this.bombPos.x / block)] = 3;

      //DRAW: explosion in x+, x-, y+ and y- direction (spritesheet x of the end piece, spritesheet x of the middle piece)
      this.explosionRay(map, 1, 0, 48, 80, animFrame);
      this.explosionRay(map, -1, 0, 32, 80, animFrame);
      this.explosionRay(map, 0, 1, 16, 64, animFrame);
      this.explosionRay(map, 0, -1, 0, 64, animFrame);

      //TIMER: Explosion -> Ending
      if ((frame - this.hitframe + 1) % 60 == 0) {
        this.explosionActive = false;
      }
    }
  }
  //_____________end Explosion_____________________

  explosionRay(map, dirX, dirY, endPiece, middlePiece, animFrame) {
    for (let i = 1; i <= this.bombMultipliyer; i++) {
      const x = this.bombPos.x + (block * i * dirX);
      const y = this.bombPos.y + (block * i * dirY);
      const row = toInt(y / block);
      const col = toInt(x / block);

      //COLISION: if there is a hard wall
      if (map[row][col] == 0) {
        break;
      }
      if (i == this.bombMultipliyer || map[row][col] == 2) {
        sprite(explosionPic, endPiece, animFrame, 16, 16, x, y, block, block);
      } else {
        sprite(explosionPic, middlePiece, animFrame, 16, 16, x, y, block, block);
      }
      //CREATE: int [][] variables
      this.explosionMap[row][col] = 3;
      //COLISION: if there is a destroyable wall
      if (map[row][col] == 2) {
        break;
      }
    }
  }
}
