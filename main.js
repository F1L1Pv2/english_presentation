var $_GET=[];
window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(a,name,value){$_GET[name]=value;});
// window.$_GET

// console.log($_GET)

const canvas = document.createElement("canvas");
canvas.setAttribute("id", "canvas");
const ctx = canvas.getContext("2d");

var slide = 0;

var t = 0;

if($_GET["slide"]){
    slide = parseInt($_GET["slide"]);
}


const LIGHTGRAY =  "rgb(200, 200, 200, 255)"   // Light Gray
const GRAY =       "rgb(130, 130, 130, 255)"   // Gray
const DARKGRAY =   "rgb(80, 80, 80, 255)"      // Dark Gray
const YELLOW =     "rgb(253, 249, 0, 255)"     // Yellow
const GOLD =       "rgb(255, 203, 0, 255)"     // Gold
const ORANGE =     "rgb(255, 161, 0, 255)"     // Orange
const PINK =       "rgb(255, 109, 194, 255)"   // Pink
const RED =        "rgb(230, 41, 55, 255)"     // Red
const MAROON =     "rgb(190, 33, 55, 255)"     // Maroon
const GREEN =      "rgb(0, 228, 48, 255)"      // Green
const LIME =       "rgb(0, 158, 47, 255)"      // Lime
const DARKGREEN =  "rgb(0, 117, 44, 255)"      // Dark Green
const SKYBLUE =    "rgb(102, 191, 255, 255)"   // Sky Blue
const BLUE =       "rgb(0, 121, 241, 255)"     // Blue
const DARKBLUE =   "rgb(0, 82, 172, 255)"      // Dark Blue
const PURPLE =     "rgb(200, 122, 255, 255)"   // Purple
const VIOLET =     "rgb(135, 60, 190, 255)"    // Violet
const DARKPURPLE = "rgb(112, 31, 126, 255)"    // Dark Purple
const BEIGE =      "rgb(211, 176, 131, 255)"   // Beige
const BROWN =      "rgb(127, 106, 79, 255)"    // Brown
const DARKBROWN =  "rgb(76, 63, 47, 255)"      // Dark Brown
const WHITE =      "rgb(255, 255, 255, 255)"   // White
const BLACK =      "rgb(0, 0, 0, 255)"         // Black
const BLANK =      "rgb(0, 0, 0, 0)"           // Blank (Transparent)
const MAGENTA =    "rgb(255, 0, 255, 255)"     // Magenta
const RAYWHITE =   "rgb(245, 245, 245, 255)"   // My own White (raylib logo)

function entry(){
    document.body.appendChild(canvas);
    
    addEventListener("keydown", keydown)
    
    requestAnimationFrame(draw)
}

function update_thingy(){
    let url = window.location.origin+window.location.pathname;

    window.location=`?slide=${slide}`

    t = 0
}


function keydown(event){
    // console.log(event)
    switch (event.key) {
        case "ArrowLeft": {
            if (slide > 0){slide-=1; update_thingy();};
            break;
        }
        case "ArrowRight": {
            slide+=1;
            update_thingy();
            break;
        }
        default:
            console.log(event)
    }
}


function clear_background(){
    ctx.save()
    ctx.fillStyle = "#181818"
    ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height)
    ctx.restore();
}

function get_height(text="Hello text",size=60,align="center"){
    ctx.save();

    let p = size/10;

    ctx.font = `${size}px Arial`;
    ctx.textAlign = align;
    let metrics = ctx.measureText(text);
    let lineHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent + p;

    let lines = text.split('\n');

    let totalLength = lineHeight * lines.length;

    ctx.restore();

    return totalLength
}

function write_multiline_text(text="Hello text", x=0, y=0, size=60, color="white",align="center"){
    ctx.save();

    let p = size/10;

    ctx.font = `${size}px Arial`;
    ctx.textAlign = align;
    ctx.fillStyle = color;
    let metrics = ctx.measureText(text);
    let lineHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent + p;

    let lines = text.split('\n');

    let totalLength = lineHeight * lines.length;
    let maxWidth = 0;

    for (var i = 0; i<lines.length; i++){
        let measure = ctx.measureText(lines[i]);
        ctx.fillText(lines[i], x, y + (i*lineHeight) - totalLength/4);
        let actualWidth = measure.actualBoundingBoxLeft + measure.actualBoundingBoxRight;
        if (maxWidth < actualWidth){
            maxWidth = actualWidth
        }
    }


    ctx.restore();

    // console.log(maxWidth)

    return [maxWidth, totalLength]
}


function write_headText(text, text_size, color="white"){
    let p = canvas.height/30;
    let y = get_height(text,text_size)
    write_multiline_text(text, canvas.width/2, y+p,text_size,color, "center")
}

function slide_0(){
    ctx.save();

    let p = canvas.width/30;
    let [_, offset] = write_multiline_text("How I write Algorithms", canvas.width/2, canvas.height/2, p);
    write_multiline_text("F1L1P Młodzik",canvas.width/2,canvas.height/2+offset, p/2)

    ctx.restore();
}

function niga_0(){
    ctx.save()

    let p = canvas.height/30;
    let text_size = canvas.width/15;
    let c = "white";

    write_headText("Meaning = unknown", text_size/2);

    let offset1 = write_multiline_text(`78 105 103 97`, canvas.width/2, canvas.height/2,text_size,c, "center")


    ctx.restore()
}

function niga_1(){
    ctx.save()

    let p = canvas.height/30;
    let text_size = canvas.width/15;
    let c = "white";

    let c1 = RED;
    let c2 = YELLOW;

    let pos = [78 + Math.sin(t*0.1)*10, 105 + Math.cos(t*0.1)*10]
    let size = [103 + Math.sin(t*0.1)*10, 97 + Math.sin(t*0.1)*20]

    write_headText("Meaning = cordinates", canvas.width/30)

    let offset1 = write_multiline_text(`(${Math.round(pos[0])} ${Math.round(pos[1])})`, canvas.width/2, canvas.height/2,text_size,c1, "right")
    let offset2 = write_multiline_text(`(${Math.round(size[0])} ${Math.round(size[1])})`, canvas.width/2, canvas.height/2,text_size,c2,"left")
    let subtext1 = write_multiline_text("position", canvas.width/2 - offset1[0]/4, canvas.height/2+offset1[1]/2, text_size/2, c1, "right")
    let subtext2 = write_multiline_text("size", canvas.width/2 + offset2[0]/2.5, canvas.height/2+offset2[1]/2, text_size/2, c2, "left")

    ctx.fillStyle= PURPLE;
    ctx.fillRect(pos[0] - size[0]/2, pos[1] - size[1]/2, size[0], size[1])


    ctx.restore()
}

function not_found(slide_num){
    ctx.save();

    let p = canvas.width / 30;
    write_multiline_text(`Slide ${slide_num}\nnot found sorry D:`, canvas.width/2, canvas.height/2, p)

    ctx.restore();
}

function draw(){
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    clear_background()

    switch (slide){
        case 0: {
            slide_0()
            break
        }

        case 1: {
            niga_0();
            break
        }

        case 2: {
            niga_1();
            break
        }

        default: not_found(slide);
    }

    t+=1;

    requestAnimationFrame(draw)
}