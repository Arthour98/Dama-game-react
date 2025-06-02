
import whitePawn from "../assets/whitePawn.png";
import blackPawn from "../assets/blackPawn.png";



export function pawn(c,square)
{
this.c=c;
this.x=square.x;
this.y=square.y;
this.width=square.width;
this.height=square.height;
this.init=function(image)
{
let centeredX=this.x+this.width/2;
let centeredY=this.y+this.height/2;
let radius=(this.height/2)/1.5;
c.save();
c.beginPath();
c.arc(centeredX,centeredY,radius,0,Math.PI*2);
c.closePath();
c.clip();
c.drawImage(image, this.x + 10, this.y + 10, this.width - 20, this.height - 20);
c.restore();
}
this.move=function(x,y,image)
{
this.x=x
this.y=y
this.init(image)
}
}

export function InitPawns(c,map,createPawns,createEnemyPawns)
{

let pawnIcon=new Image(80,80);
let enemyPawnIcon=new Image(80,80);

pawnIcon.src=whitePawn;
enemyPawnIcon.src=blackPawn;


let pawnArr=new Array(12).fill(null);
let enemyPawnArr=new Array(12).fill(null);



pawnIcon.onload=()=>
{
for(let i=0;i<pawnArr.length;i++)
{
let Pawns=new pawn(c,map[i]);
pawnArr[i]={id:i,icon:pawnIcon,x:map[i].x,
y:map[i].y,width:map[i].width,height:map[i].height};
Pawns.init(pawnIcon);
//map_copy[i].pawn(pawnArr[i].icon);
}
createPawns(pawnArr);
}

enemyPawnIcon.onload=()=>
{
for(let i=0;i<enemyPawnArr.length;i++)
{
let Pawns=new pawn(c,map[map.length-1-i]);
enemyPawnArr[i]={id:i,icon:enemyPawnIcon,x:map[map.length-1-i].x,
y:map[map.length-1-i].y,width:map[map.length-1-i].width,
height:map[map.length-1-i].height};
Pawns.init(enemyPawnIcon);
}
createEnemyPawns(enemyPawnArr);
}






}