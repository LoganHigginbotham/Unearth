window.onload = function(){startGame();}
var player;
var minAmount = 0;
var allowMove = true;
var mouseDown = false;
var rightDown = false;
var miningTimeout = false;
var windowWidth = 0;
var dirMine = "";
var checkMine;
var inventorySwitch = false;
var allowInventory = true;
var inventory = [];
var xActive = false;
var allowActive = true;
var active = -1;
var cTool = false;
var allowTool = true;
var tool = -1;

//Load function to start game

function startGame() {
    gameArea.start();
    player = new controller(10000000, 10000000);
    checkGen();
    loadStartingArea();
}

//Placing "Air" blocks at the staring area

function loadStartingArea() {
    mapCords[player.x -1][player.y +1] = new block('Air');
    mapCords[player.x][player.y +1] = new block('Air');
    mapCords[player.x +1][player.y +1] = new block('Air');
    mapCords[player.x -1][player.y] = new block('Air');
    mapCords[player.x][player.y] = new block('Air');
    mapCords[player.x +1][player.y] = new block('Air');
    mapCords[player.x -1][player.y -1] = new block('Air');
    mapCords[player.x][player.y -1] = new block('Air');
    mapCords[player.x +1][player.y -1] = new block('Air');
}

//Main function Canvas, and Key presses

var gameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        this.mouseX = 0;
        this.mouseY = 0;
        //Computer input
        window.addEventListener('mousedown', function(){mouseDown = true;})
        window.addEventListener('mouseup', function(){clearTimeout(checkMine); mouseDown = false; miningTimeout = false;})
        window.addEventListener('contextmenu', function(ev) {
            ev.preventDefault();
            rightDown = true;
            setTimeout(function(){rightDown = false;}, 30)
            return false;
        }, false);
        window.addEventListener('mousemove', function(e){
            gameArea.mouseX = e.clientX;
            gameArea.mouseY = e.clientY;
        })
        window.addEventListener('keydown', function (e) {
            gameArea.keys = (gameArea.keys || []);
            gameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            gameArea.keys[e.keyCode] = false;
        })
    }
}

//Creating a block

function block(type) {
    this.type = type;
    this.breakStage = 0;
    if(type === 'Air') {
        this.toughness = 0;
        this.color = "#636363";
    }
    if(type === 'Stone') {
        this.toughness = 5;
        this.color = "#808080";
    }
    if(type === 'Gold') {
        this.toughness = 4;
        this.color = "#fce356";
    }
    if(type === 'Coal') {
        this.toughness = 6;
        this.color = "#000000";
    }
    if(type === 'Iron') {
        this.toughness = 7;
        this.color = "#e0e0e0";
    }
    if(type === 'WorldDirt') {
        this.toughness = 3;
        this.color = "#8a7349";
    }
    if(type === 'Dirt') {
        this.toughness = 3;
        this.color = "#8a7349";
    }
    //if(type === "sapling") {}
}

//Player Cords

function controller(xInput, yInput) {
    this.x = xInput;
    this.y = yInput;
}

//Main function. Update runs very often

function updateGameArea() {
    keyPress();
    mine();
    place();
    if(xActive || cTool){checkActive()}
    checkGen();
    gameArea.context.clearRect(0, 0, gameArea.canvas.width, gameArea.canvas.height);
    //Checks window size and resizes it
    if(window.innerWidth < window.innerHeight){minAmount = window.innerWidth} else {minAmount = window.innerHeight}
    gameArea.canvas.width = minAmount;
    gameArea.canvas.height = minAmount;
    windowWidth = window.innerWidth;
    draw();
}

//Check Tool and Active

function checkActive() {
    for(var i=0;i<inventory.length;i++) {
        console.log(active);
         //minAmount/18, minAmount/6+minAmount*.043*(i+1.5)
        if(mouseDown && gameArea.mouseX > minAmount/18 && gameArea.mouseY > minAmount/6+minAmount*.043*(i+.5) && gameArea.mouseX < minAmount/2.1 && gameArea.mouseY < minAmount/6+minAmount*.043*(i+1.5)){
            if(xActive){active = i; xActive = false;}
            if(cTool){tool = i; cTool = false;}
        }
    }
}

//Controlling up,down,left,right

function keyPress() {
    //Keys w,a,s,d
    if(!inventorySwitch){
        if (gameArea.keys && gameArea.keys[65] && allowMove && mapCords[player.x -1][player.y].type === 'Air') {player.x -= 1; allowMove = false; setTimeout(function(){ allowMove = true; }, 200);}
	    if (gameArea.keys && gameArea.keys[68] && allowMove && mapCords[player.x +1][player.y].type === 'Air') {player.x += 1; allowMove = false; setTimeout(function(){ allowMove = true; }, 200);}
	    if (gameArea.keys && gameArea.keys[87] && allowMove && mapCords[player.x][player.y -1].type === 'Air') {player.y -= 1; allowMove = false; setTimeout(function(){ allowMove = true; }, 200);}
	    if (gameArea.keys && gameArea.keys[83] && allowMove && mapCords[player.x][player.y +1].type === 'Air') {player.y += 1; allowMove = false; setTimeout(function(){ allowMove = true; }, 200);}
    }
    //Key e
    if(gameArea.keys && gameArea.keys[69] && allowInventory){allowInventory = false; inventorySwitch = !inventorySwitch; xActive = false; cTool = false;} else if(gameArea.keys && !gameArea.keys[69]){allowInventory = true;}
    if(gameArea.keys && gameArea.keys[88] && allowActive && !cTool){xActive = !xActive; allowActive = false;} else if(gameArea.keys && !gameArea.keys[88]){allowActive = true;}
    if(gameArea.keys && gameArea.keys[67] && allowTool && !xActive){cTool = !cTool; allowTool = false;} else if(gameArea.keys && !gameArea.keys[67]){allowTool = true}
}

//Array for a for loop to see the 4 cardnal direction blocks
var cordSet = [[-1,0,3,4,4,5],[1,0,5,6,4,5],[0,-1,4,5,3,4],[0,1,4,5,5,6]];

//Place blocks

function place() {
    if(rightDown && active != -1) {
        for(var i=0;i<4;i++) {
            if(gameArea.mouseX >= (windowWidth-minAmount)/2+(minAmount/9*cordSet[i][2]) && gameArea.mouseX < (windowWidth-minAmount)/2+(minAmount/9*cordSet[i][3]) && gameArea.mouseY >= minAmount/9*cordSet[i][4] && gameArea.mouseY < minAmount/9*cordSet[i][5] && mapCords[player.x +cordSet[i][0]][player.y +cordSet[i][1]].type === 'Air') {
                mapCords[player.x +cordSet[i][0]][player.y +cordSet[i][1]] = new block(inventory[active][0]);
                inventory[active][1]--;
                if(inventory[active][1] < 1) {
                    inventory.splice(active, 1);
                    active = -1;
                }
            }
        }
    }
}

//Mines blocks

function mine() {
    if(mouseDown && !miningTimeout && !inventorySwitch) {
        for(var i=0;i<cordSet.length;i++) {
            if(gameArea.mouseX >= (windowWidth-minAmount)/2+(minAmount/9*cordSet[i][2]) && gameArea.mouseX < (windowWidth-minAmount)/2+(minAmount/9*cordSet[i][3]) && gameArea.mouseY >= minAmount/9*cordSet[i][4] && gameArea.mouseY < minAmount/9*cordSet[i][5] && mapCords[player.x +cordSet[i][0]][player.y +cordSet[i][1]].type != 'Air') {
                checkMine = setTimeout(function(placeHolderi){ 
                    if(gameArea.mouseX >= (windowWidth-minAmount)/2+(minAmount/9*cordSet[placeHolderi][2]) && gameArea.mouseX < (windowWidth-minAmount)/2+(minAmount/9*cordSet[placeHolderi][3]) && gameArea.mouseY >= minAmount/9*cordSet[placeHolderi][4] && gameArea.mouseY < minAmount/9*cordSet[placeHolderi][5] && mapCords[player.x +cordSet[placeHolderi][0]][player.y +cordSet[placeHolderi][1]].type != 'Air') {
                        mapCords[player.x +cordSet[placeHolderi][0]][player.y +cordSet[placeHolderi][1]].breakStage++; 
                        if(mapCords[player.x +cordSet[placeHolderi][0]][player.y +cordSet[placeHolderi][1]].breakStage >= mapCords[player.x +cordSet[placeHolderi][0]][player.y +cordSet[placeHolderi][1]].toughness) {
                            if(mapCords[player.x +cordSet[placeHolderi][0]][player.y +cordSet[placeHolderi][1]].type != 'WorldDirt') {
                                addInventory(mapCords[player.x +cordSet[placeHolderi][0]][player.y +cordSet[placeHolderi][1]].type);
                            } else if(mapCords[player.x +cordSet[placeHolderi][0]][player.y +cordSet[placeHolderi][1]].type === 'WorldDirt') {
                                addInventory('Dirt');
                            }
                            mapCords[player.x +cordSet[placeHolderi][0]][player.y +cordSet[placeHolderi][1]] = new block('Air');
                        }
                    } 
                }, 1000, i);
                miningTimeout = true;
                setTimeout(function(){miningTimeout = false;}, 1000);
            }
        }   
    }
}

//Draws on canvas

function draw() {
    //draw world
    var firstCount = 0;
    for (var i = -4; i < 5; i++) {
        firstCount++;
        var secoundCount = 0;
        for (var j = -4; j < 5; j++) {
            secoundCount++;
            ctx = gameArea.context;
            ctx.fillStyle = mapCords[i + player.x][j + player.y].color;
            ctx.globalAlpha = 1-mapCords[i + player.x][j + player.y].breakStage/mapCords[i + player.x][j + player.y].toughness;
            ctx.fillRect(minAmount/9*firstCount-minAmount/9, minAmount/9*secoundCount-minAmount/9, minAmount/9, minAmount/9);
            ctx.globalAlpha = 1.0;
        }
    }
    //draw player
    ctx = gameArea.context;
    ctx.fillStyle = "#edcf8e";
    ctx.fillRect(minAmount/2-(minAmount/11)/2, minAmount/2-(minAmount/11)/2, minAmount/11, minAmount/11);
    //draw Active item
    if(active != -1) {
        ctx.fillStyle = "#ffffff";
        ctx.font = String(minAmount*.043)+"px Arial";
        ctx.fillText(inventory[active][0] + ' x' + String(inventory[active][1]), minAmount/9/7, minAmount/9/2.5);
    }
    //draw tool
    if(tool != -1) {
        ctx.fillStyle = "#ffffff";
        ctx.fillText(inventory[tool][0] + ' x' + String(inventory[tool][1]), minAmount/9/7, minAmount/9/2.5+minAmount*.043);
    }
    //draw inventory
    if(inventorySwitch) {
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = "#000000";
        ctx.fillRect(0,0,minAmount,minAmount);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(minAmount/2-1,minAmount/6,3,minAmount/6*4.5);
        ctx.font = String(minAmount*.043)+"px Arial";
        ctx.fillText("Inventory", minAmount/18, minAmount/6);
        ctx.fillText("Crafting", minAmount/1.75, minAmount/6);
        ctx.font = String(minAmount*.037)+"px Arial";
        for(var i=0;i<inventory.length;i++) {
            if(inventory[i][1] != null){
                ctx.fillText(inventory[i][0] + ' x' + String(inventory[i][1]), minAmount/18, minAmount/6+minAmount*.043*(i+1.5))
            }
        }
        ctx.font = String(minAmount*.043)+"px Arial"
        if(xActive){
           ctx.fillText("Active", minAmount/2.2, minAmount/9/2.5);
        }
        if(cTool){
           ctx.fillText("Tool", minAmount/2.2, minAmount/9/2.5+minAmount*.043);
        }
    }
}

//Adding to inventory

function addInventory(type) {
    var worked = false;
    for(var i=0;i<inventory.length;i++){
        if(type === inventory[i][0] && inventory[i][1] < 32) {
            inventory[i][1]++;
            worked = true;
            break;
        }
    }
    if(!worked && inventory.length < 16){
        inventory.push([type,1]);
        console.log(inventory);
    }
}

//Creates array for the map

function Create2DArray(rows) {
    var arr = [];
    for (var i = 0; i < rows; i++) {
        arr[i] = [];
    }
    return arr;
}

//Choeses world gen

var mapCords = Create2DArray(20000000);

function chunkGen(x,y) {
    var rand = Math.random();
    if (rand <= .025) {
        mapCords[x][y] = new block('Iron');
    } else if (rand > .025 && rand <= .03) {
        mapCords[x][y] = new block('Gold');
    } else if (rand > .03 && rand <= .035) {
        mapCords[x][y] = new block('WorldDirt');
        //dirtSpawn(genX, genY);
    } else if (rand > .035 && rand <= .065) {
        mapCords[x][y] = new block('Coal');
    } else {
        mapCords[x][y] = new block('Stone');
    }
}

//Starting world gen

function checkGen() {
    for (var i = -8; i < 8; i++) {
        for (var j = -8; j < 8; j++) {
            if (mapCords[i + player.x][j + player.y] === undefined) {
                chunkGen(i + player.x, j + player.y);
            }
        }
    }
}

/*
function dirtSpawn(genX, genY) {
    var dirtRan = Math.random();
    if (dirtRan >= 0.6) {
        mapCords[genX][genY + 1] = 'WorldDirt';
        mapCords[genX][genY - 1] = 'WorldDirt';
        mapCords[genX + 1][genY] = 'WorldDirt';
        mapCords[genX - 1][genY] = 'WorldDirt';
    } else if (dirtRan < 0.6 && dirtRan > 0.1) {
        mapCords[genX][genY + 1] = 'WorldDirt';
        mapCords[genX + 1][genY + 1] = 'WorldDirt';
        mapCords[genX + 1][genY] = 'WorldDirt';
    }
}*/