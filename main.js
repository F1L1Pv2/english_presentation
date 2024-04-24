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

const Initial = new Image();
const OnlyRotate = new Image();
const Final = new Image();
const FunctionIntro = new Image();
const Function2 = new Image();
const Function3 = new Image();

const RotatePoint = new Image();
const RotatePointFull = new Image();
const OffsetPos = new Image();
const OffsetPosFinal = new Image();


function entry(){
    document.body.appendChild(canvas);
    
    Initial.src="Initial.svg"
    Final.src="Final.svg"
    OnlyRotate.src="OnlyRotate.svg";
    FunctionIntro.src="FunctionIntro.svg";
    Function2.src="Function2.svg";
    Function3.src="Function3.svg"

    RotatePoint.src = "RotatePoint.svg";
    RotatePointFull.src = "RotatePointFull.svg";
    OffsetPos.src = "OffsetPos.svg";
    OffsetPosFinal.src = "OffsetPosFinal.svg";

    addEventListener("keydown", keydown)

    requestAnimationFrame(draw)

}

function update_thingy(){

    if($_GET["debug"]){
        if($_GET["debug"] = "true"){
            let url = window.location.origin+window.location.pathname;
        
            window.location=`?debug=true&slide=${slide}`
        }
    }


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
            if(slide < slides.length-1){slide+=1; update_thingy();}
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

    ctx.font = `${size}px Ubuntu Mono`;
    ctx.textAlign = align;
    let metrics = ctx.measureText(text);
    let lineHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;

    let lines = text.split('\n');

    let totalLength = lineHeight * lines.length;

    ctx.restore();

    return totalLength
}

function write_multiline_text(text="Hello text", x=0, y=0, size=60, color="white", align="center"){
    ctx.save();

    let p = size/1*0;

    ctx.font = `${size}px Ubuntu Mono`;
    ctx.fillStyle = color;
    let metrics = ctx.measureText("M"); // dummy text to get font metrics
    let lineHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent + p;

    let lines = text.split('\n');//.filter(line => line !== '');

    let totalLength = lineHeight * lines.length;
    let maxWidth = 0;

    for (var i = 0; i < lines.length; i++){
        let line = lines[i];
        let segments = [];
        let lastIndex = 0;

        let currentColor = color.slice();

        let regex = /\{\[([^}]+)\]\}/g;
        let match;
        while ((match = regex.exec(line)) !== null) {
          let code = match[1];
          if (code == "reset") {
            code = color.slice();
          }
          let textBeforeCode = line.substring(lastIndex, match.index);
          segments.push({ text: textBeforeCode, color: currentColor.slice() });
          currentColor = code;
          lastIndex = match.index + match[0].length;
        }

        let remainingText = line.substring(lastIndex);
        if (remainingText) {
          segments.push({ text: remainingText, color: currentColor.slice() });
        }

        let lineWidth = 0;
        for (let segment of segments) {
            let measure = ctx.measureText(segment.text);
            lineWidth += measure.width;
        }

        let offsetX = 0;

        if (align === "center"){
            offsetX = -lineWidth /2
        }else if(align === "right"){
            offsetX = -lineWidth
        }

        for (let segment of segments) {
            ctx.fillStyle = segment.color;
            ctx.textAlign = "left"
            ctx.fillText(segment.text, x + offsetX   , y + (i*lineHeight) - totalLength/2);
            let measure = ctx.measureText(segment.text);
            offsetX += measure.width;
        }
        if (maxWidth < lineWidth){
            maxWidth = lineWidth
        }
    }

    ctx.restore();

    return [maxWidth, totalLength]
}


function write_headText(text, text_size, color="white"){
    let y = get_height(text,text_size)
    write_multiline_text(text, canvas.width/2, y+text_size/2,text_size,color, "center")
}

function promise_to_audience(){
    ctx.save();

    let p = canvas.width/15;
    write_headText("Before Presentation",p*0.4,BROWN)
    let [_,offset]=write_multiline_text("I have a request...", canvas.width/2+p/4, canvas.height/2,p,RED);
    write_multiline_text("I would like someone\nto record this, if thats possible", canvas.width/2, canvas.height/2+offset,p*0.6,BROWN,)

    ctx.restore();
}

function slide_0(){
    ctx.save();

    let p = canvas.width/15;
    let [_, offset] = write_multiline_text(`How I write {[${BEIGE}]}Algorithms`, canvas.width/2, canvas.height/2, p, BROWN);
    write_multiline_text(`{[${DARKBROWN}]}F1L1P Młodzik`,canvas.width/2,canvas.height/2+offset, p/2)

    ctx.restore();
}

function slide_1(){
    ctx.save();

    let p = canvas.width/20;
    write_headText(`Why I chose this {[${PINK}]}title?`, p,BEIGE);
    let [_, offset] = write_multiline_text(`       why:{[${RED}]}\ "How I write Algorithms\"\n\ninstead of: {[${YELLOW}]}\"How to write Algorithms?\"`, p*0.5, canvas.height/2, p, BEIGE, "left");

    ctx.restore();
}

function niga_0(){
    ctx.save()

    let p = canvas.height/30;
    let text_size = canvas.width/15;
    let c = BEIGE;

    let offset1 = write_multiline_text(`78 105 103 97\n\nWhat do I Mean by Meaning?`, canvas.width/2, canvas.height/2,text_size,c, "center");

    write_multiline_text(`Currently those numbers have no meaning {[${GOLD}]}Meaning = unknown`, canvas.width/2, canvas.height/2+offset1[1],text_size/4)


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

    write_headText("Meaning = coordinates", canvas.width/30,GOLD)

    let offset1 = write_multiline_text(`(${Math.round(pos[0])} ${Math.round(pos[1])})`, canvas.width/2, canvas.height/2,text_size,c1, "right")
    let offset2 = write_multiline_text(`(${Math.round(size[0])} ${Math.round(size[1])})`, canvas.width/2, canvas.height/2,text_size,c2,"left")
    let subtext1 = write_multiline_text("position", canvas.width/2 - offset1[0]/4, canvas.height/2+offset1[1]/2, text_size/2, c1, "right")
    let subtext2 = write_multiline_text("size", canvas.width/2 + offset2[0]/2.5, canvas.height/2+offset2[1]/2, text_size/2, c2, "left")

    ctx.fillStyle= PURPLE;
    ctx.fillRect(pos[0] - size[0]/2, pos[1] - size[1]/2, size[0], size[1])


    ctx.restore()
}

const MAX_WAIT_TIME = 15

const player_timers_initial = [parseInt(Math.random()*MAX_WAIT_TIME)+1,parseInt(Math.random()*MAX_WAIT_TIME)+1,parseInt(Math.random()*MAX_WAIT_TIME)+1,parseInt(Math.random()*MAX_WAIT_TIME)+1]
var player_timers = [player_timers_initial[0],player_timers_initial[1],player_timers_initial[2],player_timers_initial[3]]
var counts = [78, 105, 103, 97]
var players_jumping = [false, false, false, false]
const player_colors = [RED, GREEN, YELLOW, BLUE]

var players_time = [0,0,0,0]


function ease_out(x){
    return 1 - (1 - x) * (1 - x)
}

const max_jump = 100

const players_origin = [canvas.width/2, canvas.height/2];

function draw_player(x, y, i, size){
    ctx.save()
    ctx.fillStyle=player_colors[i];
    
    if (players_jumping[i] == true){

        if(players_time[i] > max_jump){
            players_jumping[i] = false;
        }

        let t = players_time[i]/max_jump * 2;

        let size_x = size-(ease_out(t))*size/4;
        let size_y = size;//-(ease_out(t))*size/2;//*size*1.5;

        ctx.fillRect(x-size_x/2, y-ease_out(t)*size*1.5, size_x, size_y)
        
        players_time[i] += 1;

    }else{
        ctx.fillRect(x-size/2, y, size, size)
    }
    ctx.restore()
}

function niga_2(){
    ctx.save()

    let p = canvas.height/30;
    let text_size = canvas.width/15;
    let c = "white";

    
    // let counts = player_timers

    write_headText("Meaning = Jump Counter", canvas.width/30, GOLD)

    let [offset_x, offset] = write_multiline_text(`{[${player_colors[0]}]}${counts[0]} {[${player_colors[1]}]}${counts[1]} {[${player_colors[2]}]}${counts[2]} {[${player_colors[3]}]}${counts[3]}`, canvas.width/2, canvas.height/2+text_size/1.5, text_size);
    write_multiline_text(`{[${player_colors[0]}]}player1 {[${player_colors[1]}]}player2 {[${player_colors[2]}]}player3 {[${player_colors[3]}]}player4`, canvas.width/2, canvas.height/2 + offset, text_size/2)

    draw_player(canvas.width/2-offset_x/4 - text_size,canvas.height/2-text_size*1.5,0,text_size)
    draw_player(canvas.width/2-offset_x/4 + text_size/1.5,canvas.height/2-text_size*1.5,1,text_size)
    draw_player(canvas.width/2+offset_x/4 - text_size/1.5,canvas.height/2-text_size*1.5,2,text_size)
    draw_player(canvas.width/2+offset_x/4 + text_size,canvas.height/2-text_size*1.5,3,text_size)
    



    for (let i = 0; i<4; i++){
        if (t%MAX_WAIT_TIME == 0){
            if (player_timers[i] <= 0){
                console.log(players_jumping[i])
                if (!players_jumping[i]){
                    players_jumping[i] = true
                    players_time[i] = 0
                    player_timers[i] = 0
                    counts[i] += 1;
                }
                player_timers[i] = player_timers_initial[i];
            }
            player_timers[i] -= 1;
        }


    }



    ctx.restore()
}

function niga_pre_final(){
    ctx.save()

    let p = canvas.height/30;
    let text_size = canvas.width/15;
    let c = BEIGE;

    write_headText("Meaning = Text", text_size/2,GOLD);

    let [_,offset] = write_multiline_text(`78 105 103 97`, canvas.width/2, canvas.height/2+text_size*3,text_size/1.1,c, "center")
    write_multiline_text("try to decode it ;)", canvas.width/2, canvas.height/2+text_size*2,text_size/3,c, "center")

    let ascii_table = `----------------------------------------------------------------
|65  A | 66  B | 67  C | 68  D | 69  E | 70  F | 71  G | 72  H |
|73  I | 74  J | 75  K | 76  L | 77  M | 78  N | 79  O | 80  P |
|81  Q | 82  R | 83  S | 84  T | 85  U | 86  V | 87  W | 88  X |
|89  Y | 90  Z | 97  a | 98  b | 99  c | 100 d | 101 e | 102 f |
|103 g | 104 h | 105 i | 106 j | 107 k | 108 l | 109 m | 110 n |
|111 o | 112 p | 113 q | 114 r | 115 s | 116 t | 117 u | 118 v |
|119 w | 120 x | 121 y | 122 z |       |       |       |       |
----------------------------------------------------------------`;

    // let [_2, offset2] = write_multiline_text("Ascii Table:", canvas.width/2, canvas.height/2-text_size*2, text_size/1.5, BEIGE);

    let [_2, offset2] = write_multiline_text("Ascii Table:", canvas.width/2, canvas.height/2-text_size*2, text_size/1.5, BEIGE);

    write_multiline_text(ascii_table, canvas.width/2, canvas.height/2, text_size/2.5, BEIGE, "center")

    ctx.restore()
}

function niga_final(){
    ctx.save()

    let p = canvas.height/30;
    let text_size = canvas.width/15;
    let c = BEIGE;

    write_headText("Meaning = Text", text_size/2,GOLD);

    let [offset_x,offset] = write_multiline_text(`78 105 103 97`, canvas.width/2, canvas.height/2-text_size/2,text_size,c, "center")
    write_multiline_text(`N`, canvas.width/2-offset_x/4 - text_size, canvas.height/2-text_size/2+offset,text_size,c, "center")
    write_multiline_text(`i`, canvas.width/2-offset_x/4 + text_size/1.5, canvas.height/2-text_size/2+offset,text_size,c, "center")
    write_multiline_text(`g`, canvas.width/2+offset_x/4 - text_size/1.5, canvas.height/2-text_size/2+offset,text_size,c, "center")
    write_multiline_text(`a`, canvas.width/2+offset_x/4 + text_size, canvas.height/2-text_size/2+offset,text_size,c, "center")


    ctx.restore()
}

function meaning_introduction(){
    ctx.save()

    let p = canvas.height / 30;
    let text_size = canvas.width / 10;

    let [_, offset] = write_multiline_text("Part I",canvas.width/2, canvas.height/2, text_size, BROWN);
    write_multiline_text("Meaning",canvas.width/2, canvas.height/2 + offset, text_size/1.5, BEIGE)

    ctx.restore()
}

function meaning_conclusion(){
    ctx.save()

    let p = canvas.height / 30;
    let text_size = canvas.width / 15;

    write_headText("Meaning Conclusion", text_size, GOLD)

    write_multiline_text("Numbers / Data\nby themselves\ndont have a meaning.\nWe as humans\nattach it to them.", canvas.width/2-p*12, canvas.height/2+text_size, text_size/1.5, BEIGE, "left")


    ctx.restore()
}

function not_found(slide_num){
    ctx.save();

    let p = canvas.width / 30;
    write_multiline_text(`Slide ${slide_num}\nnot found sorry D:`, canvas.width/2, canvas.height/2, p)

    ctx.restore();
}

function introduction(){
    ctx.save();
    
    let p = canvas.height / 30;
    let text_size = canvas.width / 10;

    let [_, offset] = write_multiline_text("Part II",canvas.width/2, canvas.height/2, text_size, BROWN);
    let [__, offset2] = write_multiline_text("Meaning Shifters",canvas.width/2, canvas.height/2 + offset, text_size/1.5, BEIGE)
    write_multiline_text("(functions)",canvas.width/2, canvas.height/2 + offset + offset2, text_size/4, DARKBROWN)


    ctx.restore();
}

function conclusion(){
    ctx.save()

    let p = canvas.height / 30;
    let text_size = canvas.width / 15;

    write_headText("Conclusion", text_size, GOLD)

    write_multiline_text("By abstracting you are able\nto focus more on what to do and\nwhat boxes need to be created", canvas.width/2, canvas.height/2+text_size, text_size/1.5, BEIGE, "center")


    ctx.restore()
}

function function_intro(){
    ctx.save()

    let p = canvas.height / 30;
    let text_size = canvas.width / 15;

    draw_image(FunctionIntro, canvas.width/2 + p*1.95, canvas.height/2, p*20, true);

    write_headText("How to convert Meaning\ninto another one?", text_size/2.5, BEIGE);

    ctx.restore();
}

function function_1(){
    ctx.save()

    let p = canvas.height / 30;
    let text_size = canvas.width / 15;

    draw_image(Function2, canvas.width/2, canvas.height/2, p*20, true);

    write_headText("How to convert Meaning\ninto another one?", text_size/2.5, BEIGE)

    ctx.restore();
}

function function_2(){
    ctx.save()

    let p = canvas.height / 30;
    let text_size = canvas.width / 15;

    draw_image(Function3, canvas.width/2, canvas.height/2, p*20, true);

    write_headText("How to convert Meaning\ninto another one?", text_size/2.5, BEIGE)

    ctx.restore();
}

function endf(){
    ctx.save()

    let p = canvas.height / 30;
    let text_size = canvas.width / 15;

    write_multiline_text("Thanks for listening", canvas.width/2, canvas.height/2+text_size/2, text_size/1.5, BEIGE, "center")


    ctx.restore()
}

function draw_image(img, x, y, size, by_height = false){

    let width = size;
    let height = size * img.height / img.width;
    if(!by_height){
        let width = size;
        let height = size * img.height / img.width;
    }else{
        width = size * img.width / img.height;
        height = size;
    }
    ctx.drawImage(img, 0,0, img.width, img.height, x - width / 2 ,y - height / 2,width,height)


}

function draw_circle(x,y, radius){
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    // ctx.stroke();
    ctx.restore();
}

function draw_line(x, y, x1, y1){
    ctx.save()

    ctx.beginPath(); // Start a new path
    ctx.moveTo(x, y); // Move the pen to (30, 50)
    ctx.lineTo(x1, y1); // Draw a line to (150, 100)
    ctx.stroke(); // Render the path

    ctx.restore()
}

function point_between(x, y, x1, y1){
    return [(x+x1)/2, (y+y1)/2]
}


let distance_pos = [0,0];
let player_pos1 = [0,0];
let particle_pos = [0,0];
function desired_output(){
    ctx.save()

    let p = canvas.height / 30;
    let text_size = canvas.width / 15;

    write_headText("Desired Output", text_size, BEIGE)

    // write_multiline_text(`Time: ${t}`, text_size/10, canvas.height-text_size/10, text_size/2, BROWN, "left")
    
    let player_pos = [ text_size/2*Math.cos(t*0.04), text_size/2*Math.cos(t*0.02)]
    let distance = text_size*2.5;
    
    write_multiline_text(`Player   (${Math.floor(player_pos[0])},${Math.floor(player_pos[1])})
Particle (${Math.floor(distance*Math.cos(t*0.025) + player_pos[0])},${Math.floor(distance*Math.sin(t*0.025) + player_pos[1])})
Distance: ${Math.floor(distance)}
Time: ${t}`, 
    text_size/2, canvas.height/2, text_size/3, DARKBROWN, "left");


    ctx.fillStyle = PINK;

    ctx.fillRect(canvas.width/2 - text_size/2 + player_pos[0], canvas.height/2 - text_size/2 + player_pos[1], text_size, text_size);

    
    ctx.fillStyle = GOLD;
    
    draw_circle(canvas.width/2 + distance*Math.cos(t*0.025) + player_pos[0], canvas.height/2+distance*Math.sin(t*0.025) + player_pos[1], text_size/5)
    
    
    ctx.strokeStyle = RED;
    ctx.lineWidth = text_size/20;
    draw_line(canvas.width/2 + player_pos[0], canvas.height/2 + player_pos[1], canvas.width/2 + distance*Math.cos(t*0.025) + player_pos[0], canvas.height/2+distance*Math.sin(t*0.025) + player_pos[1])
    
    player_pos1 =  [canvas.width/2 + player_pos[0], canvas.height/2 + player_pos[1], canvas.width/2 + distance*Math.cos(t*0.025) + player_pos[0]]
    particle_pos = [canvas.width/2 + distance*Math.cos(t*0.025) + player_pos[0], canvas.height/2+distance*Math.sin(t*0.025) + player_pos[1]]

    distance_pos = [(player_pos[0] + particle_pos[0]) /2 + canvas.width/4, (player_pos[1] + particle_pos[1])/2 + canvas.height/4]

    write_multiline_text("Distance", distance_pos[0], distance_pos[1], text_size/2)

    write_multiline_text("(PlayerX, PlayerY)", canvas.width/2 - text_size/2 + player_pos[0] + text_size/3 *1.5, canvas.height/2 - text_size/2 + player_pos[1], text_size/2)
    write_multiline_text("(ParticleX, ParticleY)", canvas.width/2 + distance*Math.cos(t*0.025) + player_pos[0], canvas.height/2+distance*Math.sin(t*0.025) + player_pos[1] - text_size/3 / 2, text_size/2)

    ctx.restore()
}

function simple_algorithm_initial(){
    ctx.save()

    let p = canvas.height / 30;
    let text_size = canvas.width / 15;

    draw_image(Initial, canvas.width/2, canvas.height/2, p*14)

    ctx.restore();
}

function simple_algorithm_only_rotate(){
    ctx.save()

    let p = canvas.height / 30;
    let text_size = canvas.width / 15;

    draw_image(OnlyRotate, canvas.width/2, canvas.height/2, p*14)

    ctx.restore();
}

function RotatePoint_Initial(){
    ctx.save()

    let p = canvas.height / 30;
    let text_size = canvas.width / 15;

    draw_image(RotatePoint, canvas.width/2, canvas.height/2, p*14);

    write_multiline_text("Desired Output: ", text_size/2, text_size, text_size/2, BEIGE, "left");

    let offset = [text_size/2,canvas.height/2];

    let size = text_size*2;

    ctx.save()
    ctx.lineWidth = 4
    ctx.strokeStyle = BROWN;
    ctx.setLineDash([10,10])
    draw_line(offset[0]+size,offset[1]-size, offset[0]+size,offset[1]+size)
    ctx.strokeStyle = BEIGE;
    draw_line(offset[0],offset[1], offset[0]+size*2,offset[1])
    ctx.restore()

    let middle = [offset[0]+size, offset[1]];
    ctx.lineWidth = 4
    
    let distance = text_size*2
    
    let x_pos = [(middle[0]+middle[0]+distance*Math.cos(t*0.02))/2,(middle[1]+distance*Math.sin(t*0.02)+middle[1]+distance*Math.sin(t*0.02))/2,]
    let y_pos = [(middle[0]+distance*Math.cos(t*0.02)+middle[0]+distance*Math.cos(t*0.02))/2,(middle[1]+middle[1]+distance*Math.sin(t*0.02))/2]

    ctx.save();
    ctx.setLineDash([10,10])
    ctx.strokeStyle = GREEN;
    ctx.strokeStyle = GREEN;
    draw_line(middle[0]+distance*Math.cos(t*0.02),middle[1],middle[0]+distance*Math.cos(t*0.02),middle[1]+distance*Math.sin(t*0.02))
    write_multiline_text("Y",y_pos[0],y_pos[1],text_size/2)

    ctx.strokeStyle = RED;
    ctx.fillStyle = RED;
    draw_line(middle[0],middle[1]+distance*Math.sin(t*0.02),middle[0]+distance*Math.cos(t*0.02),middle[1]+distance*Math.sin(t*0.02))
    write_multiline_text("X",x_pos[0],x_pos[1]+text_size/1.5,text_size/2)
    
    ctx.restore()

    ctx.strokeStyle = BLUE;
    draw_line(middle[0],middle[1],middle[0]+distance*Math.cos(t*0.02),middle[1]+distance*Math.sin(t*0.02))


    ctx.restore();
}

function RotatePoint_Final(){
    ctx.save()

    let p = canvas.height / 30;
    let text_size = canvas.width / 15;

    draw_image(RotatePointFull, canvas.width/2, canvas.height/2, p*14)

    write_multiline_text("Desired Output: ", text_size/2, text_size, text_size/2, BEIGE, "left");

    let offset = [text_size/2,canvas.height/2];

    let size = text_size*2;

    ctx.save()
    ctx.lineWidth = 4
    ctx.strokeStyle = BROWN;
    ctx.setLineDash([10,10])
    draw_line(offset[0]+size,offset[1]-size, offset[0]+size,offset[1]+size)
    ctx.strokeStyle = BEIGE;
    draw_line(offset[0],offset[1], offset[0]+size*2,offset[1])
    ctx.restore()

    let middle = [offset[0]+size, offset[1]];
    ctx.lineWidth = 4
    
    let distance = text_size*2
    
    let x_pos = [(middle[0]+middle[0]+distance*Math.cos(t*0.02))/2,(middle[1]+distance*Math.sin(t*0.02)+middle[1]+distance*Math.sin(t*0.02))/2,]
    let y_pos = [(middle[0]+distance*Math.cos(t*0.02)+middle[0]+distance*Math.cos(t*0.02))/2,(middle[1]+middle[1]+distance*Math.sin(t*0.02))/2]

    ctx.save();
    ctx.setLineDash([10,10])
    ctx.strokeStyle = GREEN;
    ctx.strokeStyle = GREEN;
    draw_line(middle[0]+distance*Math.cos(t*0.02),middle[1],middle[0]+distance*Math.cos(t*0.02),middle[1]+distance*Math.sin(t*0.02))
    write_multiline_text("Y",y_pos[0],y_pos[1],text_size/2)

    ctx.strokeStyle = RED;
    ctx.fillStyle = RED;
    draw_line(middle[0],middle[1]+distance*Math.sin(t*0.02),middle[0]+distance*Math.cos(t*0.02),middle[1]+distance*Math.sin(t*0.02))
    write_multiline_text("X",x_pos[0],x_pos[1]+text_size/1.5,text_size/2)
    
    ctx.restore()

    ctx.strokeStyle = BLUE;
    draw_line(middle[0],middle[1],middle[0]+distance*Math.cos(t*0.02),middle[1]+distance*Math.sin(t*0.02))

    
    let algorithm = `
    {[${GOLD}]}function{[reset]} {[${BLUE}]}rotate_point{[reset]} ({[${GREEN}]}angle, distance{[reset]})
    {[${RED}]}{
        {[${PURPLE}]}let {[${GREEN}]}x{[reset]} = {[${BLUE}]}cos{[reset]}({[${GREEN}]}angle{[reset]}) * {[${GREEN}]}distance{[reset]};
        {[${PURPLE}]}let {[${GREEN}]}y{[reset]} = {[${BLUE}]}sin{[reset]}({[${GREEN}]}angle{[reset]}) * {[${GREEN}]}distance{[reset]};

        {[${PURPLE}]}return{[reset]} [{[${GREEN}]}x, y{[reset]}];
    {[${RED}]}}
`;

    write_multiline_text(algorithm, canvas.width - text_size*6, canvas.height/2, text_size/4, WHITE, "left")

    ctx.restore();
}

function OffsetPos_Initial(){
    ctx.save()

    let p = canvas.height / 30;
    let text_size = canvas.width / 15;

    draw_image(OffsetPos, canvas.width/2, canvas.height/2, p*14);

    ctx.restore();
}


function OffsetPos_Final(){
    ctx.save()

    let p = canvas.height / 30;
    let text_size = canvas.width / 15;

    draw_image(OffsetPosFinal, canvas.width/2, canvas.height/2, p*14);

    let algorithm = `
    {[${GOLD}]}function{[reset]} {[${BLUE}]}offset_pos{[reset]}({[${GREEN}]}x1, y1, x2, y2{[reset]})
    {[${RED}]}{
        {[${PURPLE}]}let {[${GREEN}]}x{[reset]} = {[${GREEN}]}x1 {[reset]}+ {[${GREEN}]}x2{[reset]};
        {[${PURPLE}]}let {[${GREEN}]}y{[reset]} = {[${GREEN}]}y1 {[reset]}+ {[${GREEN}]}y2{[reset]};
        
        {[${PURPLE}]}return{[reset]} [{[${GREEN}]}x, y{[reset]}];
    {[${RED}]}}
`;

    write_multiline_text(algorithm, canvas.width - text_size*6, canvas.height/2, text_size/4, WHITE, "left")

    ctx.restore();
}

function simple_algorithm_ready(){
    ctx.save()

    let p = canvas.height / 30;
    let text_size = canvas.width / 15;

    draw_image(Final, canvas.width/2, canvas.height/2, p*14)

    ctx.restore();
}

function simple_algorithm_main_func(){
    ctx.save()

    let p = canvas.height / 30;
    let text_size = canvas.width / 15;

    let algorithm = `
    {[${GOLD}]}function{[reset]} {[${BLUE}]}particle_pos{[reset]}({[${GREEN}]}player_x, player_y, time, distance{[reset]})
    {[${RED}]}{
        {[${PURPLE}]}let{[reset]} [{[${GREEN}]}rotated_x, rotated_y{[reset]}] = {[${BLUE}]}rotate_point{[reset]}({[${GREEN}]}time, ditance{[reset]});

        {[${PURPLE}]}let{[reset]} [{[${GREEN}]}offseted_x, offseted_y{[reset]}] = {[${BLUE}]}offset_pos{[reset]}({[${GREEN}]}player_x, player_y, rotated_x, rotated_y{[reset]});
        
        {[${PURPLE}]}return{[reset]} [{[${GREEN}]}offseted_x, offseted_y{[reset]}];
    {[${RED}]}}
`;

    write_multiline_text(algorithm, text_size  *1.5, canvas.height - text_size, text_size/4, WHITE, "left")

    draw_image(Initial, canvas.width/2, canvas.height/2 - text_size * 1.3, text_size*2.5);

    ctx.restore()
}


function simple_algorithm_final(){
    ctx.save()

    let p = canvas.height / 30;
    let text_size = canvas.width / 15;

    let algorithm = `
    {[${GOLD}]}function{[reset]} {[${BLUE}]}particle_pos{[reset]}({[${GREEN}]}player_x, player_y, time, distance{[reset]})
    {[${RED}]}{
        {[${PURPLE}]}let{[reset]} [{[${GREEN}]}rotated_x, rotated_y{[reset]}] = {[${BLUE}]}rotate_point{[reset]}({[${GREEN}]}time, ditance{[reset]});

        {[${PURPLE}]}let{[reset]} [{[${GREEN}]}offseted_x, offseted_y{[reset]}] = {[${BLUE}]}offset_pos{[reset]}({[${GREEN}]}player_x, player_y, rotated_x, rotated_y{[reset]});
        
        {[${PURPLE}]}return{[reset]} [{[${GREEN}]}offseted_x, offseted_y{[reset]}];
    {[${RED}]}}

    {[${GOLD}]}function{[reset]} {[${BLUE}]}rotate_point{[reset]} ({[${GREEN}]}angle, distance{[reset]})
    {[${RED}]}{
        {[${PURPLE}]}let {[${GREEN}]}x{[reset]} = {[${BLUE}]}cos{[reset]}({[${GREEN}]}angle{[reset]}) * {[${GREEN}]}distance{[reset]};
        {[${PURPLE}]}let {[${GREEN}]}y{[reset]} = {[${BLUE}]}sin{[reset]}({[${GREEN}]}angle{[reset]}) * {[${GREEN}]}distance{[reset]};

        {[${PURPLE}]}return{[reset]} [{[${GREEN}]}x, y{[reset]}];
    {[${RED}]}}

    {[${GOLD}]}function{[reset]} {[${BLUE}]}offset_pos{[reset]}({[${GREEN}]}x1, y1, x2, y2{[reset]})
    {[${RED}]}{
        {[${PURPLE}]}let {[${GREEN}]}x{[reset]} = {[${GREEN}]}x1 {[reset]}+ {[${GREEN}]}x2{[reset]};
        {[${PURPLE}]}let {[${GREEN}]}y{[reset]} = {[${GREEN}]}y1 {[reset]}+ {[${GREEN}]}y2{[reset]};
        
        {[${PURPLE}]}return{[reset]} [{[${GREEN}]}x, y{[reset]}];
    {[${RED}]}}
`;

    write_multiline_text(algorithm, text_size, canvas.height/2, text_size/4, WHITE, "left")

    draw_image(Final, canvas.width/2 + text_size*3, canvas.height/2.25+ text_size, text_size*2.5);

    ctx.restore()
}

const part1 = [promise_to_audience, slide_0, slide_1, meaning_introduction, niga_0, niga_1, niga_2, niga_pre_final, meaning_conclusion];
const part2 = [introduction,function_intro,function_1,function_2,desired_output,simple_algorithm_initial,simple_algorithm_only_rotate,RotatePoint_Initial,RotatePoint_Final,OffsetPos_Initial,OffsetPos_Final,simple_algorithm_ready,simple_algorithm_main_func,simple_algorithm_final,desired_output,conclusion];
const end = [endf];

const slides = [].concat(part1).concat(part2).concat(end);

function draw(){
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    clear_background()

    if (slide >= slides.length){
        not_found(slide)
    }else{
        slides[slide]()
    }

    t+=1;

    requestAnimationFrame(draw)
}