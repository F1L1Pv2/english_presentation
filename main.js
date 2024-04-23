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

const TEST_IMG = new Image();


function entry(){
    document.body.appendChild(canvas);
    

    addEventListener("keydown", keydown)
    
    requestAnimationFrame(draw)

}

function update_thingy(){
    // let url = window.location.origin+window.location.pathname;

    // window.location=`?slide=${slide}`

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

    ctx.font = `${size}px Ubuntu Mono`;
    ctx.textAlign = align;
    let metrics = ctx.measureText(text);
    let lineHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent + p;

    let lines = text.split('\n');

    let totalLength = lineHeight * lines.length;

    ctx.restore();

    return totalLength
}

function write_multiline_text(text="Hello text", x=0, y=0, size=60, color="white", align="center"){
    ctx.save();

    let p = size/10;

    ctx.font = `${size}px Ubuntu Mono`;
    ctx.fillStyle = color;
    let metrics = ctx.measureText("M"); // dummy text to get font metrics
    let lineHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent + p;

    let lines = text.split('\n');//.filter(line => line !== '');

    let totalLength = lineHeight * lines.length;
    let maxWidth = 0;

    for (var i = 0; i < lines.length; i++){
        let line = lines[i];
        let segments = [];
        let lastIndex = 0;

        let currentColor = color.slice();

        // parse the line for color codes
        let matches = line.match(/\{\[([^}]+)\]\}/g);
        if (matches) {
            for (let match of matches) {
                let code = match.substring(2, match.length - 2);
                let textBeforeCode = line.substring(lastIndex, line.indexOf(match));
                segments.push({ text: textBeforeCode, color: currentColor.slice() });
                currentColor = code;
                lastIndex = line.indexOf(match) + match.length;
            }
            let remainingText = line.substring(lastIndex);
            segments.push({ text: remainingText, color: currentColor.slice() });
        } else {
            segments.push({ text: line, color: currentColor.slice() });
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
            ctx.fillText(segment.text, x + offsetX   , y + (i*lineHeight) - totalLength/4);
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
    let p = canvas.height/30;
    let y = get_height(text,text_size)
    write_multiline_text(text, canvas.width/2, y+p,text_size,color, "center")
}

function promise_to_audience(){
    ctx.save();

    let p = canvas.width/15;
    write_headText("Before Presentation",p*0.4,DARKBROWN)
    let [_,offset]=write_multiline_text("I have a request...", canvas.width/2+p/4, canvas.height/2,p,RED);
    write_multiline_text("I would want somebody\nto record my presentation\nif thats possible", canvas.width/2, canvas.height/2+offset,p*0.6,DARKBROWN,)

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
    write_headText(`Why I choose this {[${PINK}]}title?`, p,BEIGE);
    let [_, offset] = write_multiline_text(`       why:{[${RED}]}\ "How I write Algorithms\"\n\ninstead of: {[${YELLOW}]}\"How to write Algorithms?\"`, p*0.5, canvas.height/2, p, BEIGE, "left");

    ctx.restore();
}

function niga_0(){
    ctx.save()

    let p = canvas.height/30;
    let text_size = canvas.width/15;
    let c = BEIGE;

    // write_headText("Meaning = unknown", text_size/2,GOLD);

    let offset1 = write_multiline_text(`78 105 103 97\n\nWhat do I Mean by Meaning?`, canvas.width/2, canvas.height/2,text_size,c, "center");

    write_multiline_text(`Currently thoose numbers have no meaning {[${GOLD}]}Meaning = unknown`, canvas.width/2, canvas.height/2+offset1[1],text_size/4)


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

    write_headText("Meaning = cordinates", canvas.width/30,GOLD)

    let offset1 = write_multiline_text(`(${Math.round(pos[0])} ${Math.round(pos[1])})`, canvas.width/2, canvas.height/2,text_size,c1, "right")
    let offset2 = write_multiline_text(`(${Math.round(size[0])} ${Math.round(size[1])})`, canvas.width/2, canvas.height/2,text_size,c2,"left")
    let subtext1 = write_multiline_text("position", canvas.width/2 - offset1[0]/4, canvas.height/2+offset1[1]/2, text_size/2, c1, "right")
    let subtext2 = write_multiline_text("size", canvas.width/2 + offset2[0]/2.5, canvas.height/2+offset2[1]/2, text_size/2, c2, "left")

    ctx.fillStyle= PURPLE;
    ctx.fillRect(pos[0] - size[0]/2, pos[1] - size[1]/2, size[0], size[1])


    ctx.restore()
}

const player_timers_initial = [parseInt(Math.random()*20)+1,parseInt(Math.random()*20)+1,parseInt(Math.random()*20)+1,parseInt(Math.random()*20)+1]
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

    let [offset_x, offset] = write_multiline_text(`{[${player_colors[0]}]}${counts[0]} {[${player_colors[1]}]}${counts[1]} {[${player_colors[2]}]}${counts[2]} {[${player_colors[3]}]}${counts[3]}`, canvas.width/2, canvas.height/2+p*2, text_size);
    write_multiline_text(`{[${player_colors[0]}]}player1 {[${player_colors[1]}]}player2 {[${player_colors[2]}]}player3 {[${player_colors[3]}]}player4`, canvas.width/2, canvas.height/2 + offset + p*2, text_size/2)

    draw_player(canvas.width/2-offset_x/4 - text_size,canvas.height/2-text_size*1.5,0,text_size)
    draw_player(canvas.width/2-offset_x/4 + text_size/1.5,canvas.height/2-text_size*1.5,1,text_size)
    draw_player(canvas.width/2+offset_x/4 - text_size/1.5,canvas.height/2-text_size*1.5,2,text_size)
    draw_player(canvas.width/2+offset_x/4 + text_size,canvas.height/2-text_size*1.5,3,text_size)
    



    for (let i = 0; i<4; i++){
        if (t%20 == 0){
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

    let offset1 = write_multiline_text(`78 105 103 97`, p, p+text_size/3,text_size/3,c, "left")

    ctx.drawImage(TEST_IMG, canvas.width/2-TEST_IMG.width/2, canvas.height/2-TEST_IMG.height/2);

    let ascii_table = `Dec  Char                           Dec  Char     Dec  Char     Dec  Char
---------                           ---------     ---------     ----------
  0  NUL (null)                      32  SPACE     64  @         96  \`
  1  SOH (start of heading)          33  !         65  A         97  a
  2  STX (start of text)             34  "         66  B         98  b
  3  ETX (end of text)               35  #         67  C         99  c
  4  EOT (end of transmission)       36  $         68  D        100  d
  5  ENQ (enquiry)                   37  %         69  E        101  e
  6  ACK (acknowledge)               38  &         70  F        102  f
  7  BEL (bell)                      39  '         71  G        103  g
  8  BS  (backspace)                 40  (         72  H        104  h
  9  TAB (horizontal tab)            41  )         73  I        105  i
 10  LF  (NL line feed, new line)    42  *         74  J        106  j
 11  VT  (vertical tab)              43  +         75  K        107  k
 12  FF  (NP form feed, new page)    44  ,         76  L        108  l
 13  CR  (carriage return)           45  -         77  M        109  m
 14  SO  (shift out)                 46  .         78  N        110  n
 15  SI  (shift in)                  47  /         79  O        111  o
 16  DLE (data link escape)          48  0         80  P        112  p
 17  DC1 (device control 1)          49  1         81  Q        113  q
 18  DC2 (device control 2)          50  2         82  R        114  r
 19  DC3 (device control 3)          51  3         83  S        115  s
 20  DC4 (device control 4)          52  4         84  T        116  t
 21  NAK (negative acknowledge)      53  5         85  U        117  u
 22  SYN (synchronous idle)          54  6         86  V        118  v
 23  ETB (end of trans. block)       55  7         87  W        119  w
 24  CAN (cancel)                    56  8         88  X        120  x
 25  EM  (end of medium)             57  9         89  Y        121  y
 26  SUB (substitute)                58  :         90  Z        122  z
 27  ESC (escape)                    59  ;         91  [        123  {
 28  FS  (file separator)            60  <         92  \\        124  |
 29  GS  (group separator)           61  =         93  ]        125  }
 30  RS  (record separator)          62  >         94  ^        126  ~
 31  US  (unit separator)            63  ?         95  _        127  DEL`;


    write_multiline_text(ascii_table, canvas.width/2-p*18, canvas.height/2-p*5, p, BEIGE, "left")

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

    write_multiline_text("Numbers / Data\nby themselves\ndont have a meaning.\nWe as humans\nattach it to them.", canvas.width/2-p*12, canvas.height/2, text_size/1.5, BEIGE, "left")


    ctx.restore()
}

function not_found(slide_num){
    ctx.save();

    let p = canvas.width / 30;
    write_multiline_text(`Slide ${slide_num}\nnot found sorry D:`, canvas.width/2, canvas.height/2, p)

    ctx.restore();
}

function part2(){
    ctx.save();
    
    let p = canvas.height / 30;
    let text_size = canvas.width / 10;

    let [_, offset] = write_multiline_text("Part II",canvas.width/2, canvas.height/2, text_size, BROWN);
    let [__, offset2] = write_multiline_text("Meaning Shifters",canvas.width/2, canvas.height/2 + offset, text_size/1.5, BEIGE)
    write_multiline_text("(functions)",canvas.width/2, canvas.height/2 + offset + offset2, text_size/4, DARKBROWN)


    ctx.restore();
}

const slides = [promise_to_audience, slide_0, slide_1, meaning_introduction, niga_0, niga_1, niga_2, niga_pre_final, niga_final, meaning_conclusion, part2];

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