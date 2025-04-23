// Jasvascript code for Luftwaffe game

        var myFighter;
        var myEnemies = [];
        
        var myLevel;
        var myTheater;
        var myKills = 0;
        var myAmmo;
        var myLife;
        var myDamage = 5;
        var myScore;
        var lowFrame = 250; // Minimum frame rate for enemy firing
        var highFrame = 500; // Maximum frame rate for enemy firing
        var mySpeed = 2;
        var bullets = [];
        var eBullets = [];
        var level = 1;             
        var maxLevel = 5;         // max level of difficulty
        var enemyCount = 0;        // number of enemies generated for the level
        var killsLvl = 0;          // number of enemies killed in the level
        var kills = 0;             // number of enemies killed in the game
        var survivors = 0;         // enemy planes escaped off screen (per level)
        var spawn = true;          // Control spawning of ew enemies
        var ammo = 100;            // Limited number of shots per level
        var score = 0;             // Score for the game
        var bogies = 0;           // Number of enemy planes in the air

        // Set the # of enemies per level here
        const enemiesPerLevel = [10, 15, 20, 25, 30, 2, 2, 2, 2, 2];
        const backgrounds = ["../media/spain.jpg", "../media/poland.jpg", "../media/norway.jpg", 
        "../media/france.jpg", "../media/britain.jpg", "../media/north_sea2.jpg", "../media/north_africa.jpg",
        "../media/sicily.jpg", "../media/russia.jpg", "../media/berlin.jpg"];
        const levelNames = ["Spain 1936", "Poland 1939", "Norway 1940", 
        "France 1940", "Britain 1940", "North Sea 1941",
        "North Africa 1941", "Sicily 1943", "Russia 1944", "Berlin 1945"];
      
        // Game canvas Properties
        const canvasHeight = 400;
        const canvasWidth = 800;
        var delay = 500;

        // Game piece properties
        const pc_width = 74;
        const pc_height = 86;
        const startX = 10;
        const startY = canvasHeight/2;
        var graphic = "../media/Bf109e.png";
        const fileType = "image";


        var myGameArea = {
            canvas: document.createElement("canvas"),
            start: function () {
                this.canvas.width = canvasWidth;
                this.canvas.height = canvasHeight;
                this.context = this.canvas.getContext("2d");
                document.body.insertBefore(this.canvas, document.body.childNodes[0]);
                this.frameNo = 0;
                this.interval = setInterval(updateGameArea, 10);
            },
            clear: function () {
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            },
            stop: function () {
                clearInterval(this.interval);
            }
        }

        function component(width, height, color, x, y, type, armor, points, speed) {
            this.type = type;
            if (type == "image") {
                this.image = new Image();
                this.image.src = color;
              
            }
            this.width = width;
            this.height = height;
            this.speedX = 0;
            this.speedY = 0;
            this.x = x;
            this.y = y;
            this.hits = 0;
            this.armor = armor;
            this.points = points;
            this.speed = speed;
            this.update = function () {
                ctx = myGameArea.context;
                if (this.type == "text") {
                    ctx.font = this.width + " " + this.height;
                    ctx.fillStyle = color;
                    ctx.fillText(this.text, this.x, this.y);
                }
                else if (type == "image") {
                    ctx.drawImage(this.image,
                        this.x,
                        this.y,
                        this.width, this.height);
                }
                else {
                    ctx.fillStyle = color;
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                }
            }
            
            this.newPos = function () {
                this.x += this.speedX;
                this.y += this.speedY;
            }

            this.eFire = function () 
            {
                var timeLapse = Math.floor(Math.random() * highFrame) + lowFrame;
     
                if (myGameArea.frameNo % timeLapse == 0) { // Fire every lowFrame - highFrame frames
                    let eBullet = new component(5, 5, "fuchsia", this.x, this.y + 40);
                    eBullet.newPos();
                    eBullet.speedX = -5;
                    eBullets.push(eBullet);
                }
            }
            
            this.crashWith = function (otherobj) {
                var myleft = this.x;
                var myright = this.x + (this.width);
                var mytop = this.y + 15;
                var mybottom = this.y + (this.height) - 19;
                var otherleft = otherobj.x;
                var otherright = otherobj.x + (otherobj.width);
                var othertop = otherobj.y;
                var otherbottom = otherobj.y + (otherobj.height);
                var crash = true;
                if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
                    crash = false;
                }
                return crash;
            }
        }

        function updateGameArea() {
            var x, y;
            // Check for collision with other planes
            for (i = 0; i < myEnemies.length; i += 1) {
                if (myFighter.crashWith(myEnemies[i])) {
                    myGameArea.stop();
                    document.getElementById("title").innerHTML = "COLLSION! Game Over!"
                    document.getElementById("message").innerHTML = "Final Score = " + Number(score) + " - Kills = " + kills + "/" + bogies + " - Kill Ratio = " + getRatio() + "%";
                    return;
                }
            }

            // Check for collision with enemy bullets
            for (i = 0; i < eBullets.length; i++) {
                if (myFighter.crashWith(eBullets[i])) {
                    myDamage -= 1;                      // Update player damage
                    eBullets.splice(i, 1);              // Remove the bullet
                    if (myDamage <= 0) {
                        myGameArea.stop();
                        
                        document.getElementById("title").innerHTML = "SHOT DOWN!! Game Over!";
                        document.getElementById("message").innerHTML = "Final Score = " + Number(score) + " - Kills = " + kills + "/" + bogies + " - Kill Ratio = " + getRatio() + "%";                        return;
                    }
                }
            }

            // Check for collision with bullets
                for (i = 0; i < bullets.length; i += 1) {
                    for (j = 0; j < myEnemies.length; j += 1) {
                        if (bullets[i].crashWith(myEnemies[j])) {
                            // Update enemy plane armor and hits
                            myEnemies[j].hits += 1;
                            if (myEnemies[j].hits == myEnemies[j].armor) {
                                score += myEnemies[j].points;
                                myEnemies.splice(j, 1);
                                bullets.splice(i, 1);
                                myGameArea.frameNo += 10;
                                kills += 1;
                                killsLvl += 1;
                                msg = "";
                                if (kills == 5)
                                    msg = "You are a Luftwaffe Ace!";
                                if (kills == 10)
                                    msg = "You are a Luftwaffe DOUBLE Ace!";
                                document.getElementById("title").innerHTML = "Another kill!!";
                                document.getElementById("message").innerHTML = msg;
                               
                            }
                            else {
                                document.getElementById("title").innerHTML = "Hit!!"
                                bullets.splice(i, 1);
                                console.log("Hits = " + myEnemies[j].hits);
                            }
                        }
                    }
                }
            
            myGameArea.clear();
            myGameArea.frameNo += 1;


            //  ============== Generate new enemy planes ================
            // Check if the number of enemies is less than the number of enemies per level
    
            if (spawn){
                if (myGameArea.frameNo == 1 || everyinterval(delay)) {
                    x = myGameArea.canvas.width;
                    y = Math.floor(Math.random() * (canvasHeight - pc_height));
                    var plane = '';
                    var roll = Math.floor(Math.random() * 4);

                    switch (roll + ((level-1) * 4)) {
                        case 0:
                            plane = '../media/Vildebeest.png';
                            hits = 0;
                            armor = 1;
                            points = 10;
                            speed = 1;
                            break;
                        case 1:
                            plane = '../media/I_15.png';
                            hits = 0;
                            armor = 2;
                            points = 20;
                            speed = 1;
                            break;
                        case 2:
                            plane = '../media/I_16.png';
                            hits = 0;
                            armor = 3;
                            points = 30;
                            speed = 2;
                            break;
                        case 3:
                            plane = '../media/ANT_40.png';
                            hits = 0;
                            armor = 6;
                            points = 50;
                            speed = 1;
                            break;
                        case 4:
                            plane = '../media/PZL_P7.png';
                            hits = 0;
                            armor = 2;
                            points = 40;
                            speed = 2;
                            break;
                            break;
                        case 5:
                            plane = '../media/PZL_37.png';
                            hits = 0;
                            armor = 6;
                            points = 50;
                            speed = 2;
                            break;
                        case 6:
                            plane = '../media/PZL_23B.png';
                            hits = 0;
                            armor = 3;
                            points = 30;
                            speed = 2;         
                            break;
                        case 7:
                            plane = '../media/Po_630.png';
                            hits = 0;
                            armor = 7;
                            points = 50;
                            speed = 1;                            
                            break;
                        case 8:
                            plane = '../media/Am_354.png';
                            hits = 0;
                            armor = 8;
                            points = 30;
                            speed = 2;                            
                            break;
                        case 9:
                        case 12:
                            plane = '../media/De_520.png';
                            hits = 0;
                            armor = 5;
                            points = 65;
                            speed = 3;                           
                            break;
                        case 10: 
                        case 19:
                            plane = '../media/Swordfish.png';
                            hits = 0;
                            armor = 2;
                            points = 30;
                            speed = 1;                           
                            break;
                        case 11:
                        case 15:
                        case 16:
                            plane = '../media/Hurricane.png';
                            hits = 0;
                            armor = 4;
                            points = 60;
                            speed = 3;                
                            break;
                        case 13:
                            plane = '../media/MS_406.png';
                            hits = 0;
                            armor = 4;
                            points = 55;
                            speed = 2;
                            break;
                        case 14:
                            plane = '../media/Wellington.png';
                            hits = 0;
                            armor = 9;
                            points = 80;
                            speed = 2;
                            break;
                        case 17:
                            plane = '../media/Spitfire.png';
                            hits = 0;
                            armor = 6;
                            points = 75;
                            speed = 4;
                            break;
                        case 18:
                            plane = '../media/Sunderland.png';
                            hits = 0;
                            armor = 10;
                            points = 100;
                            speed = 1;
                            break;
                    }

                    myEnemies.push(new component(74, 86, plane, x, y, "image", armor, points, speed));
                    enemyCount += 1; // Increment the number of enemies spawned
                    bogies += 1;     // Increment the total number of enemy planes launched
                    if (enemyCount == enemiesPerLevel[level - 1])
                        spawn = false; // Stop spawning new enemies
                }
            }

            // Update enemy planes
            for (i = 0; i < myEnemies.length; i += 1) {
                myEnemies[i].speedX = -1 * myEnemies[i].speed;
                if (myEnemies[i].x < 0) {           // Enemy moves off left side of screen
                    myEnemies.splice(i, 1);         // Remove the enemy plane
                    survivors += 1;                 // Count the number of enemy planes that escaped
                }
                if (myEnemies.length > 0) {
                    myEnemies[i].newPos();
                    myEnemies[i].update();
                    myEnemies[i].armor = armor;
                    myEnemies[i].eFire();
                }
            }

            // ===== End of Level Accounting & Stat Resets ======
            if (killsLvl + survivors == enemiesPerLevel[level-1]){
                // reset for next level
                
                spawn = true;
                enemyCount = 0;     // Reset enemy count for the next level
                killsLvl = 0;       // Reset kills for the next level
                survivors = 0;      // Reset survivors for the next level
                score += ammo;      // Add bonus for ammo remaining
                ammo = 100;         // Reset ammo for the next level
                myDamage = myFighter.armor;         // Reset armor for the next level
                document.getElementById("title").innerHTML = "Level complete!";
                
                level += 1;
                // change background
                if (level <= maxLevel) {
                    myGameArea.canvas.style.backgroundImage = "url('" + backgrounds[level - 1] + "')";
                }
            }
            
            if (level > maxLevel){
                // End the game
                level -= 1; // Set level back to maxLevel
                myGameArea.stop();
                msg = "All levels complete! You are a Luftwaffe Ace!";
                document.getElementById("title").innerHTML = msg;
                document.getElementById("message").innerHTML = "Final Score = " + Number(score) + " - Kills = " + kills + "/" + bogies + " - Kill Ratio = " + getRatio() + "%";
            }
            myDamage.color = "red";
            // Update the game stats
            myLevel.text = "Level: " + level;
            myLevel.update();
            myTheater.text = levelNames[level - 1];
            myTheater.update();
            myKills.text = "Kills: " + kills;
            myKills.update();
            myAmmo.text = "Ammo: " + ammo;
            myAmmo.update();
            myLife.text = "Armor: " + myDamage;
            myLife.update();
            myScore.text = "Score: " + Number(score);
            myScore.update();

            // Update player and bullet positions
            
            myFighter.newPos();
            myFighter.update();

            if (bullets !== undefined) {
            bullets.forEach((bullet) => {
                if (bullet.x > myGameArea.canvas.width) {
                    bullets.splice(bullets.indexOf(bullet), 1);
                }
                else{
                    bullet.newPos()
                    bullet.update();
                }
            });
            }
            eBullets.forEach((eBullet) => {
                if (eBullet.x < 0) {
                    eBullets.splice(eBullets.indexOf(eBullet), 1);
                }
                else{
                    eBullet.newPos()
                    eBullet.update();
                }
            });


        }  // updateGameArea

        function startGame() {
            myFighter = new component(pc_width, pc_height, graphic, startX, startY, fileType, myDamage);
            myLevel = new component("16px", "Cooper Black", "white", 20, 20, "text");
            myTheater = new component("16px", "Cooper Black", "white", 130, 20, "text");
            myKills = new component("16px", "Cooper Black", "white", 300, 20, "text");
            myAmmo = new component("16px", "Cooper Black", "white", 420, 20, "text");
            myLife = new component("18px", "Cooper Black", "orangered", 550, 20, "text");
            myScore = new component("16px", "Cooper Black", "white", 700, 20, "text");
            myGameArea.start();
        }  // startGame


        function everyinterval(n) {
            if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
            return false;
        }  // everyinterval

        function moveup() {
            myFighter.speedY = -mySpeed;
        }

        function movedown() {
            myFighter.speedY = mySpeed;
        }

        function moveleft() {
            myFighter.speedX = -mySpeed;
        }   

        function moveright() {
           myFighter.speedX = mySpeed;
        }

        function clearmove() {
            myFighter.speedX = 0;
            myFighter.speedY = 0;
        }

        function fire() {
            if (ammo <= 0) {
                document.getElementById("title").innerHTML = "Out of ammo!";
                return;
            }
            let bullet = new component(5, 5, "gold", myFighter.x + 75, myFighter.y + 40);
            bullet.newPos();
            bullet.speedX = 7;
            bullets.push(bullet);
            ammo -= 1;
        }

        function getRatio() {
            var ratio = Math.round((kills/bogies) * 100);
            return ratio;
        }