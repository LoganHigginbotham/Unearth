window.onload = function(){startGame();}
var player;
var minAmount = 0;
var alowMove = true;
var mouseDown = false;
var miningTimeout = false;
var windowWidth = 0;
var dirMine = "";
var checkMine;

//Load function to start game

function startGame() {
    gameArea.start();
    player = new controller(10000000, 10000000);
    checkGen();
    loadStartingArea();
}

//Placing "Air" blocks at the staring area

function loadStartingArea() {
    mapCords[player.x -1][player.y +1] = new block('Air', 0, "#636363");
    mapCords[player.x][player.y +1] = new block('Air', 0, "#636363");
    mapCords[player.x +1][player.y +1] = new block('Air', 0, "#636363");
    mapCords[player.x -1][player.y] = new block('Air', 0, "#636363");
    mapCords[player.x][player.y] = new block('Air', 0, "#636363");
    mapCords[player.x +1][player.y] = new block('Air', 0, "#636363");
    mapCords[player.x -1][player.y -1] = new block('Air', 0, "#636363");
    mapCords[player.x][player.y -1] = new block('Air', 0, "#636363");
    mapCords[player.x +1][player.y -1] = new block('Air', 0, "#636363");
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

function block(type, toughness, color) {
    this.type = type;
    this.breakStage = 0;
    this.toughness = toughness;
    this.color = color
    //if(type === "sapling") {}
}

//Player Cords

function controller(xInput, yInput) {
    this.x = xInput;
    this.y = yInput;
    }
}

//Main function. Update runs very often

function updateGameArea() {
    move();
    mine();
    checkGen();
    gameArea.context.clearRect(0, 0, gameArea.canvas.width, gameArea.canvas.height);
    //Checks window size and resizes it
    if(window.innerWidth < window.innerHeight){minAmount = window.innerWidth} else {minAmount = window.innerHeight}
    gameArea.canvas.width = minAmount;
    gameArea.canvas.height = minAmount;
    windowWidth = window.innerWidth;
    draw();
    //console.log(mapCords[player.x -1][player.y]);
}

//Controlling up,down,left,right

function move() {
    if (gameArea.keys && gameArea.keys[65] && alowMove && mapCords[player.x -1][player.y].type === 'Air') {player.x -= 1; alowMove = false; setTimeout(function(){ alowMove = true; }, 200);}
	if (gameArea.keys && gameArea.keys[68] && alowMove && mapCords[player.x +1][player.y].type === 'Air') {player.x += 1; alowMove = false; setTimeout(function(){ alowMove = true; }, 200);}
	if (gameArea.keys && gameArea.keys[87] && alowMove && mapCords[player.x][player.y -1].type === 'Air') {player.y -= 1; alowMove = false; setTimeout(function(){ alowMove = true; }, 200);}
	if (gameArea.keys && gameArea.keys[83] && alowMove && mapCords[player.x][player.y +1].type === 'Air') {player.y += 1; alowMove = false; setTimeout(function(){ alowMove = true; }, 200);}
}

//Mines blocks

function mine() {
    if(mouseDown && !miningTimeout) {
        if(gameArea.mouseX >= (windowWidth-minAmount)/2+(minAmount/9*3) && gameArea.mouseX < (windowWidth-minAmount)/2+(minAmount/9*4) && gameArea.mouseY >= minAmount/9*4 && gameArea.mouseY < minAmount/9*5) {
            dirMine = "left";
            checkMine = setTimeout(function(){ 
                if(gameArea.mouseX >= (windowWidth-minAmount)/2+(minAmount/9*3) && gameArea.mouseX < (windowWidth-minAmount)/2+(minAmount/9*4) && gameArea.mouseY >= minAmount/9*4 && gameArea.mouseY < minAmount/9*5 && dirMine === "left") {
                    mapCords[player.x -1][player.y].breakStage++; 
                    if(mapCords[player.x -1][player.y].breakStage >= mapCords[player.x -1][player.y].toughness) {
                        mapCords[player.x -1][player.y] = new block('Air', 0, "#636363");
                    }
                } 
            }, 1000);
            miningTimeout = true;
            setTimeout(function(){miningTimeout = false;}, 1000);
            //console.log(mapCords[player.x -1][player.y]);
        }
        if(gameArea.mouseX >= (windowWidth-minAmount)/2+(minAmount/9*5) && gameArea.mouseX < (windowWidth-minAmount)/2+(minAmount/9*6) && gameArea.mouseY >= minAmount/9*4 && gameArea.mouseY < minAmount/9*5) {
            dirMine = "right";
            checkMine = setTimeout(function(){ 
                if(gameArea.mouseX >= (windowWidth-minAmount)/2+(minAmount/9*5) && gameArea.mouseX < (windowWidth-minAmount)/2+(minAmount/9*6) && gameArea.mouseY >= minAmount/9*4 && gameArea.mouseY < minAmount/9*5 && dirMine === "right"){
                    mapCords[player.x +1][player.y].breakStage++;
                    if(mapCords[player.x +1][player.y].breakStage >= mapCords[player.x +1][player.y].toughness) {
                        mapCords[player.x +1][player.y] = new block('Air', 0, "#636363");
                    }
                } 
            }, 1000);
            miningTimeout = true;
            setTimeout(function(){miningTimeout = false;}, 1000);
            //console.log(mapCords[player.x +1][player.y]);
        }
        if(gameArea.mouseX >= (windowWidth-minAmount)/2+(minAmount/9*4) && gameArea.mouseX < (windowWidth-minAmount)/2+(minAmount/9*5) && gameArea.mouseY >= minAmount/9*3 && gameArea.mouseY < minAmount/9*4) {
            dirMine = "up";
            checkMine = setTimeout(function(){ 
                if(gameArea.mouseX >= (windowWidth-minAmount)/2+(minAmount/9*4) && gameArea.mouseX < (windowWidth-minAmount)/2+(minAmount/9*5) && gameArea.mouseY >= minAmount/9*3 && gameArea.mouseY < minAmount/9*4 && dirMine === "up"){
                    mapCords[player.x][player.y -1].breakStage++;
                    if(mapCords[player.x][player.y -1].breakStage >= mapCords[player.x][player.y -1].toughness) {
                        mapCords[player.x][player.y -1] = new block('Air', 0, "#636363");
                    }
                } 
            }, 1000);
            miningTimeout = true;
            setTimeout(function(){miningTimeout = false;}, 1000);
            //console.log(mapCords[player.x][player.y -1]);
        }
        if(gameArea.mouseX >= (windowWidth-minAmount)/2+(minAmount/9*4) && gameArea.mouseX < (windowWidth-minAmount)/2+(minAmount/9*5) && gameArea.mouseY >= minAmount/9*5 && gameArea.mouseY < minAmount/9*6) {
            dirMine = "down";
            checkMine = setTimeout(function(){ 
                if(gameArea.mouseX >= (windowWidth-minAmount)/2+(minAmount/9*4) && gameArea.mouseX < (windowWidth-minAmount)/2+(minAmount/9*5) && gameArea.mouseY >= minAmount/9*5 && gameArea.mouseY < minAmount/9*6 && dirMine === "down"){
                    mapCords[player.x][player.y +1].breakStage++;
                    if(mapCords[player.x][player.y +1].breakStage >= mapCords[player.x][player.y +1].toughness) {
                        mapCords[player.x][player.y +1] = new block('Air', 0, "#636363");
                    }
                } 
            }, 1000);
            miningTimeout = true;
            setTimeout(function(){miningTimeout = false;}, 1000);
            //console.log(mapCords[player.x][player.y +1]);
        }
    }
}

//Draws on canvas

function draw() {
    var firstCount = 0;
    for (var i = -4; i < 5; i++) {
        firstCount++;
        var secoundCount = 0;
        for (var j = -4; j < 5; j++) {
            secoundCount++;
            ctx = gameArea.context;
            ctx.fillStyle = mapCords[i + player.x][j + player.y].color;
            ctx.fillRect(minAmount/9*firstCount-minAmount/9, minAmount/9*secoundCount-minAmount/9, minAmount/9, minAmount/9);
            ctx.globalAlpha = mapCords[i + player.x][j + player.y].breakStage/mapCords[i + player.x][j + player.y].toughness;
            ctx.fillStyle = "#636363"
            ctx.fillRect(minAmount/9*firstCount-minAmount/9, minAmount/9*secoundCount-minAmount/9, minAmount/9, minAmount/9);
            ctx.globalAlpha = 1.0;
        }
    }
    ctx = gameArea.context;
    ctx.fillStyle = "#edcf8e";
    ctx.fillRect(minAmount/2-(minAmount/11)/2, minAmount/2-(minAmount/11)/2, minAmount/11, minAmount/11);
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
        mapCords[x][y] = new block('Iron', 7, "#e0e0e0");
    } else if (rand > .025 && rand <= .03) {
        mapCords[x][y] = new block('Gold', 4, "#fce356");
    } else if (rand > .03 && rand <= .035) {
        mapCords[x][y] = new block('WorldDirt', 3, "#8a7349");
        //dirtSpawn(genX, genY);
    } else if (rand > .035 && rand <= .065) {
        mapCords[x][y] = new block('Coal', 6, "#000000");
    } else {
        mapCords[x][y] = new block('Stone', 5, "#808080");
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