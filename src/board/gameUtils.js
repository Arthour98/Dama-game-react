
import whitePawn from "../assets/whitePawn.png";
import blackPawn from "../assets/blackPawn.png";

export function square(c,x,y,width,height,color)
{
this.c=c;
this.x=x;
this.y=y;
this.width=width;
this.height=height;
this.color=color
this.build=function()
{
c.save();
c.beginPath();
c.rect(this.x,this.y,this.width,this.height);
c.fillStyle=this.color;
c.fill();
c.stroke();
c.closePath()
c.restore();
}
}

export function damaBoard(c,Map)
{
    const width=100;
    const height=100;
    let x=0;
    let y=0;
    let color="black";
    for(let i=0;i<Map.length;i++)
    {
    let row=i/4;
    if(i%4!=0)
    {
    x+=width*2;
    }
    else if(i%4==0&&i/4%2==0)
    {
    x=width;
    }
    else
    {
    x=0;
    }
    y=Math.floor(row)*height;
    Map[i]=new square(c,x,y,width,height,color);
    Map[i].build();
    }
}

export function pawn(c,map)
{
this.c=c;
this.x=map.x;
this.y=map.y;
this.width=map.width;
this.height=map.height;
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

/** 
*@param {array}enemyPawns- array that gonna be iterated
*@param {obj} mapPos - object that keys are gonna compared to find the desired id of pawn
*/

export function idFinder(enemyPawns,mapPos)
{
const pawn=enemyPawns.find(e=>e.x===mapPos.x&&e.y===mapPos.y);
return pawn.id;
}