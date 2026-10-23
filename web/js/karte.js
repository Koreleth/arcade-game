/*
Karte class
  this class creates the map and checks if map changing.
  Autor: Korel Öztekin
  date: 15.03.2024
*/


class Karte {

  //0 = hard wall
  //1 = no wall
  //2 = destroyable wall
  //3 = no wall -> item spawn random

  constructor() {
    //SAVE: Map
    this.startMap = [
      [0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0],
      [0,1,1,1,2,  2,1,2,1,2,  2,1,1,1,0],
      [0,1,0,1,0,  2,0,2,0,2,  0,1,0,1,0],
      [0,1,1,1,2,  2,1,2,1,2,  2,1,1,1,0],
      [0,2,0,2,0,  2,0,2,0,2,  0,2,0,2,0],

      [0,2,2,2,2,  2,1,2,1,2,  2,2,2,2,0],
      [0,1,0,1,0,  1,0,2,0,1,  0,1,0,1,0],
      [0,2,2,2,2,  2,2,2,2,2,  2,2,2,2,0],
      [0,1,0,1,0,  1,0,2,0,1,  0,1,0,1,0],
      [0,2,2,2,2,  2,1,2,1,2,  2,2,2,2,0],

      [0,2,0,2,0,  2,0,2,0,2,  0,2,0,2,0],
      [0,1,1,1,2,  2,1,2,1,2,  2,1,1,1,0],
      [0,1,0,1,0,  2,0,2,0,2,  0,1,0,1,0],
      [0,1,1,1,2,  2,1,2,1,2,  2,1,1,1,0],
      [0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0]
    ];
    this.map = this.startMap.map((row) => row.slice());

    //0 = No Item
    //1 = BombInv Item
    //2 = Explosionradius Item
    //3 = Speed Item
    this.itemMap = grid();
  }

  render() {
    fill(255, 0, 0);

    // Draw map
    imageMode(CORNER);

    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[i].length; j++) {
        if (this.map[i][j] == 0) {
          pic(wall0, j * block, i * block, block, block);
        } else if (this.map[i][j] == 1) {
          pic(wall1, j * block, i * block, block, block);
        } else if (this.map[i][j] == 2) {
          pic(wall2, j * block, i * block, block, block);
        } else if (this.map[i][j] == 3) {
          pic(wall1, j * block, i * block, block, block);
        }
      }
    }

    //DRAW: Items
    imageMode(CENTER);
    for (let i = 0; i < this.itemMap.length; i++) {
      for (let j = 0; j < this.itemMap[i].length; j++) {
        if (this.itemMap[i][j] == 1) {
          sprite(items, 2 * 17, 0, 16, 16, j * block + (block / 2), i * block + (block / 2), 30, 30);
        } else if (this.itemMap[i][j] == 2) {
          sprite(items, 1 * 17, 0, 16, 16, j * block + (block / 2), i * block + (block / 2), 30, 30);
        } else if (this.itemMap[i][j] == 3) {
          sprite(items, 3 * 17, 0, 16, 16, j * block + (block / 2), i * block + (block / 2), 30, 30);
        }
      }
    }
    imageMode(CORNER);
    fill(155, 155, 155);
  }


  //COLISION: Explsoion with Map
  change(explosionMap, explosionActive, bombActive) {
    for (let i = 0; i < explosionMap.length; i++) {
      for (let j = 0; j < explosionMap[i].length; j++) {
        if (explosionMap[i][j] == 3 && this.map[i][j] == 2) {

          if (explosionActive && bombActive) {
            this.map[i][j] = 1;

            const item = toInt(1 + rng() * 49); // random (1,50)

            // 1: Bomb+ Item | 2: Radius+ Item | 3: Speed+ Item
            if (item >= 1 && item <= 8) {
              this.itemMap[i][j] = 1;
            } else if (item > 12 && item <= 20) {
              this.itemMap[i][j] = 2;
            } else if (item > 20 && item <= 23) {
              this.itemMap[i][j] = 3;
            }
          }
        }
      }
    }
  }


  resetMap() {
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[i].length; j++) {
        this.map[i][j] = this.startMap[i][j];
        this.itemMap[i][j] = 0;
      }
    }
  }
}
