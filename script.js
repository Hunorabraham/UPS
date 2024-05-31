const can = document.querySelectorAll("canvas")[0];
const draw = can.getContext("2d");
const bgColour = "rgb(170,225,190)";
const pixelWidth = 10;
const sourceMultiplier = pixelWidth/5;
const testSprite = new Image();
testSprite.src = "./img/test.png";
testSprite.onload = start;


function drawGrid(){
    draw.strokeStyle = bgColour;
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
function start(){
    let x = 5;
    setInterval(()=>{
        draw.fillStyle = bgColour;
        draw.fillRect(0,0,can.width,can.height);
        drawPixelPerfect(testSprite, x++, 5);
        drawGrid();
    },100);
}


