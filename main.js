window.onload = function(){startGame();}
var player;
var minAmount = 0;

function startGame() {
    gameArea.start();
    player = new controller(10000000, 10000000);
    checkGen();
}

var gameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
    }
}

function block(type, toughness, color) {
    this.type = type;
    this.breakStage = 0;
    this.toughness = toughness;
    this.color = color
    //if(type === "sapling") {}
}

function controller(xInput, yInput) {
    this.x = xInput;
    this.y = yInput;
    this.update = function() {
        ctx = gameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(window.innerWidth - 10, window.innerHeight - 10, 20, 20);
    }
}
function updateGameArea() {
    gameArea.context.clearRect(0, 0, gameArea.canvas.width, gameArea.canvas.height);
    if(window.innerWidth < window.innerHeight){minAmount = window.innerWidth} else {minAmount = window.innerHeight}
    draw();
}

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
        }
    }
}

function Create2DArray(rows) {
    var arr = [];
    for (var i = 0; i < rows; i++) {
        arr[i] = [];
    }
    return arr;
}

var mapCords = Create2DArray(20000000);

function chunkGen(x,y) {
    var rand = Math.random();
    if (rand <= .025) {
        mapCords[x][y] = new block('Iron', 7, 'white');
    } else if (rand > .025 && rand <= .03) {
        mapCords[x][y] = new block('Gold', 4, 'yellow');
    } else if (rand > .03 && rand <= .035) {
        mapCords[x][y] = new block('WorldDirt', 3, 'brown');
        //dirtSpawn(genX, genY);
    } else if (rand > .035 && rand <= .065) {
        mapCords[x][y] = new block('Coal', 6, 'black');
    } else {
        mapCords[x][y] = new block('Stone', 5, 'grey');
    }
}

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