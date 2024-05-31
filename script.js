const can = document.querySelectorAll("canvas")[0];
const draw = can.getContext("2d");
const bgColour = "rgb(170,225,190)";
const bgGradient = draw.createRadialGradient(can.width/2,can.height/2,can.height/10,can.width/2,can.height/2,can.height);
bgGradient.addColorStop(0,"rgb(170,225,190)");
bgGradient.addColorStop(0.9,"rgb(85,112,95)");
bgGradient.addColorStop(1,"black");
const pixelWidth = 10;
const sourceMultiplier = pixelWidth/5;


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
        running = false;
        start();
    }
}
function drawGrid(){
    draw.beginPath();
    for(let i = 1; i < can.height / pixelWidth; i++){
        draw.moveTo(0, i * pixelWidth);
        draw.lineTo(can.width, i * pixelWidth);
    }
    for(let i = 1; i < can.width / pixelWidth; i++){
        draw.moveTo(i * pixelWidth, 0);
        draw.lineTo(i * pixelWidth, can.height);
    }
    draw.stroke();
    draw.closePath();
}
//currently assumes that source image has 5x5 pixels
function drawPixelPerfect(img, x, y){
    draw.drawImage(img, x * pixelWidth, y * pixelWidth, img.width * sourceMultiplier, img.height * sourceMultiplier);
}

//initilalisation
addSprite("planet_1","planet.png");
addSprite("planet_2","planet2.png");


function start(){
    //this whole part is only for testing
    console.log("begun!", spriteDict);
    let x = 5;
    draw.lineWidth = 2;
    draw.fillStyle = bgGradient;
    draw.strokeStyle = bgGradient;
    planets = [];
    for(let i = 0; i < 5; i++){
        planets.push({
            x: Math.round(Math.random()*can.width/pixelWidth),
            y: Math.round(Math.random()*can.height/pixelWidth),
            type: (Math.random()<0.5)?"planet_1":"planet_2",
        });
    }
    setInterval(()=>{
        draw.fillRect(0,0,can.width,can.height);
        //drawPixelPerfect(spriteDict.planet_1,5,5);
        planets.forEach(planet => drawPixelPerfect(spriteDict[planet.type],planet.x,planet.y));
        drawGrid();
    },100);
}