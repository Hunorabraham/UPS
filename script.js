const can = document.querySelectorAll("canvas")[0];
const draw = can.getContext("2d");
draw.imageSmoothingEnabled = false;
const bgColour = "rgb(127,169,143)";
const bgGradient = draw.createRadialGradient(can.width/2,can.height/2,0,can.width/2,can.height/2,can.height*2);
bgGradient.addColorStop(0,"rgb(30,30,40)");
bgGradient.addColorStop(0.9,"rgb(0,0,0)");
const pixelWidth = 3;
const sourceMultiplier = pixelWidth/5;

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
                x : Math.round(Math.random()*can.width/pixelWidth -40),
                y : Math.round(Math.random()*can.height/pixelWidth -40),
            });
            break;
        case "merchant":
            newPlanet = new planet(type,{
                spriteName : "merchant1",
                x : Math.round(Math.random()*can.width/pixelWidth -40),
                y : Math.round(Math.random()*can.height/pixelWidth -40),
            });
            break;
    }
    return newPlanet;
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
    console.log("thing loaded: ", this);
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
    for(let i = 0; i < 20; i++){
        planets.push(generatePlanet((Math.random()<0.1)?"merchant":"loot"));
    }
    setInterval(()=>{
        draw.fillStyle = bgGradient;
        draw.fillRect(0,0,can.width,can.height);
        //drawPixelPerfect(spriteDict.planet_1,5,5);
        planets.forEach(planet => {
            drawAligned2(spriteDict[planet.spriteName],planet.x,planet.y)
        });
        drawGrid();
        draw.fillStyle = "white";
        planets.forEach(planet => {
            draw.fillText(planet.name,(planet.x+20)*pixelWidth,(planet.y + 41)*pixelWidth);
        });
    },100);
}