const can = document.querySelectorAll("canvas")[0];
const draw = can.getContext("2d");
draw.imageSmoothingEnabled = false;
const bgColour = "rgb(127,169,143)";
const bgGradient = draw.createRadialGradient(can.width/2,can.height/2,0,can.width/2,can.height/2,can.height*2);
bgGradient.addColorStop(0,"rgb(30,30,40)");
bgGradient.addColorStop(0.9,"rgb(0,0,0)");
let pixelWidth = 3;
const sourceMultiplier = pixelWidth/5;

const avgDist = 80;
const maxNeighbours = 6;
const rings = [Math.round(Math.random()*3)+3,Math.round(Math.random()*6)+6,Math.round(Math.random()*12)+12];

let player = {};
player.money = 10;

//console
let command = "";
const alphanum = /^[a-zA-Z0-9?]$/;
let terminal = {};
terminal.width = 200;
terminal.height = 20;
terminal.text = "universal terminal v0.0.1";
//input
keys = [];
document.body.onkeydown = (e)=>{
    if(!keys.includes(e.code)) keys.push(e.code);
    if(e.key.match(alphanum)) {
        command+=e.key;
        terminal.text = command;
        return;
    }
    switch(e.code){
        case "Space":
            command += " ";
            break;
        case "Backspace":{
            command = command.slice(0,command.length-1);
            terminal.text = command;
            break;
        }
        case "Enter":
            execute();
    }
};
function execute(){
    if(command == "") return;
    let com = command.split(" ")[0].toLocaleLowerCase();
    let arg = command.split(" ")[1];
    command = "";
    switch(com){
        case "echo":
            writeLine(arg);
            break;
        case "fuck":
            writeLine("AAAAAA");
            break;
        case "goto":
            let index = -1;
            for(let i = 0; i < planets.length; i++){
                if(shorten(planets[i].name) == arg){
                    index = i;
                    break;
                }
            }
            if(index != -1) {
                planets.splice(index,1);
                writeLine("whoops");
            }
            else{
                writeLine(arg + " doesn't exist");
            }
            break;
        case "wallet":
            writeLine(`${player.money}`);
            break;
        default:
            writeLine((arg!=null)?"incorrect command":"incomplete command");
            break;
    }
}
function writeLine(text){
    terminal.text = text;
}
function drawTerminal(){
    draw.fillStyle = "white";
    draw.fillText(terminal.text,(can.width)/2,can.height/2-100+terminal.height*0.3);
}
function shorten(name){
    let parts = name.split("-");
    let final = parts[0][0];
    final+=parts[1];
    final+=parts[2];
    return final;
}

document.body.onkeyup = (e) => {
    if(keys.includes(e.code)) keys.splice(keys.indexOf(e.code),1);
};
//text settings
draw.font = "10pt Consolas";
draw.textBaseline = "top";
draw.textAlign = "center";

const themes = ["rock","fire","crystal"];
const themeSprites = {
    rock: "rock",
    fire: "fire",
    crystal: "crystal",
};


//classes
let planets = [];
class planet{
    constructor(type,options){
        this.type = type;
        this.x = 0;
        this.y = 0;
        this.name = generateName();
        this.neighbours = [];
        this.difficulty = 0;
        this.spriteName = "missing";//missing by default
        if(options != null) Object.keys(options).forEach((key)=>this[key]=options[key]);
        planets.push(this);
    }
}
function generatePlanet(type){
    let newPlanet;
    switch(type){
        case "loot":
            let rngTheme = themes[Math.round(Math.random()*(themes.length-1))];
            newPlanet = new planet(type,{
                theme : rngTheme,
                spriteName : themeSprites[rngTheme],
            });
            break;
        case "merchant":
            newPlanet = new planet(type,{
                spriteName : "merchant1",
            });
            break;
    }
    //location fuckery
    let ang = Math.random()*2*Math.PI;
    if(planets.length==1) {
        newPlanet.x = can.width/2/pixelWidth-20;
        newPlanet.y = can.height/2/pixelWidth-20;
    }
    else if(planets.length<=rings[0]+1){
        newPlanet.x = Math.round(avgDist*Math.cos(ang))+can.width/2/pixelWidth-20;
        newPlanet.y = Math.round(avgDist*Math.sin(ang))+can.height/2/pixelWidth-20;
    }
    else if(planets.length<=rings[1]+1){
        newPlanet.x = Math.round(avgDist*2*Math.cos(ang))+can.width/2/pixelWidth-20;
        newPlanet.y = Math.round(avgDist*2*Math.sin(ang))+can.height/2/pixelWidth-20;
        
    }
    else if(planets.length<=rings[2]+1){
        newPlanet.x = Math.round(avgDist*3*Math.cos(ang))+can.width/2/pixelWidth-20;
        newPlanet.y = Math.round(avgDist*3*Math.sin(ang))+can.height/2/pixelWidth-20;
    }
    console.log(newPlanet);
    return newPlanet;

    /*
    
    else if(planets.length < 8){
        let ang = (Math.PI/3) * (planets.length-1);
        newPlanet.x = Math.round(avgDist*Math.cos(ang))+can.width/2/pixelWidth-20;
        newPlanet.y = Math.round(avgDist*Math.sin(ang))+can.height/2/pixelWidth-20;

        console.log(newPlanet);
        planets[0].neighbours.push(newPlanet);
        newPlanet.neighbours.push(planets[0]);
        if(planets.length > 2) {
            planets[planets.length-2].neighbours.push(newPlanet);
            newPlanet.neighbours.push(planets[planets.length-2]);
        }
        if(planets.length == 7){
            planets[1].neighbours.push(newPlanet);
            newPlanet.neighbours.push(planets[1]);
        }
    }
    else{
        let left, right;
        for(let i = 0; i < planets.length; i++){
            if(planets[i].neighbours.length < maxNeighbours){
                for(let j = 0; j < planets[i].neighbours.length; j++){
                    if(planets[i].neighbours[j].neighbours.length < maxNeighbours){
                        left = planets[i];
                        right = planets[i].neighbours[j];
                    }
                }
            }
        }
        newPlanet.x = left.x + right.x;
        newPlanet.y = left.y + right.y;
    }
    return newPlanet;
    */
}


let spriteDict = {};
let spriteCount = 0;
function addSprite(name, filename){
    let img = new Image();
    img.src = `./img/${filename}`;
    img.onload = load;
    spriteDict[name] = img;
    spriteCount++;
}
let loadedSprites = 0;
let running = false;
function load(){
    loadedSprites++;
    //console.log("thing loaded: ", this);
    if(loadedSprites>=spriteCount && !running){
        running = true;
        start();
    }
}
function drawGrid(){
    draw.beginPath();
    draw.translate(0.5,0.5);
    for(let i = 1; i < can.height / pixelWidth; i++){
        draw.moveTo(0, i * pixelWidth);
        draw.lineTo(can.width, i * pixelWidth);
    }
    for(let i = 1; i < can.width / pixelWidth; i++){
        draw.moveTo(i * pixelWidth, 0);
        draw.lineTo(i * pixelWidth, can.height);
    }
    draw.stroke();
    draw.resetTransform();
    draw.closePath();
}
//currently assumes that source image has 5x5 pixels
function drawAligned(img, x, y){
    draw.drawImage(img, x * pixelWidth, y * pixelWidth, img.width * sourceMultiplier, img.height * sourceMultiplier);
}
function drawAligned2(img, x, y){
    draw.drawImage(img, x * pixelWidth, y * pixelWidth, img.width * pixelWidth, img.height * pixelWidth);
}
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
function generateName(){
    let name = names[Math.round(Math.random()*(names.length-1))] + "-";
    //LNN
    name += letters[Math.round(Math.random()*(letters.length-1))];
    name += letters[Math.round(Math.random()*(letters.length-1))] + "-";
    name += Math.round(Math.random()*9);
    name += Math.round(Math.random()*9);
    name += Math.round(Math.random()*9);
    return name;
}


//initilalisation
addSprite("rock","rockPlanet.png");
addSprite("fire","firePlanet.png");
addSprite("crystal","crystalPlanet.png");
addSprite("merchant1","ringOutpost.png");

function start(){
    //this whole part is only for testing
    console.log("begun!", spriteDict);
    let x = 5;
    draw.lineWidth = 1;
    draw.fillStyle = bgGradient;
    draw.strokeStyle = bgGradient;
    planets = [];
    for(let i = 0; i < 10; i++){
        generatePlanet((Math.random()<0.1)?"merchant":"loot");
    }
    let stars = [];
    for(let i = 0; i < 100; i++){
        stars.push({x: Math.round(Math.random()*can.width/pixelWidth), y: Math.round(Math.random()*can.height/pixelWidth)});
    }
    setInterval(()=>{
        draw.fillStyle = bgGradient;
        draw.fillRect(0,0,can.width,can.height);
        //drawPixelPerfect(spriteDict.planet_1,5,5);
        draw.fillStyle = "white";
        stars.forEach(star=>draw.fillRect(star.x*pixelWidth,star.y*pixelWidth,pixelWidth,pixelWidth));
        planets.forEach(planet => {
            drawAligned2(spriteDict[planet.spriteName],planet.x,planet.y)
        });
        drawGrid();
        draw.fillStyle = "white";
        planets.forEach(planet => {
            draw.fillText(planet.name,(planet.x+20)*pixelWidth,(planet.y + 41)*pixelWidth);
        });
        drawTerminal();
    },100);
}