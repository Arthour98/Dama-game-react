import React,{useRef,useEffect} from "react";
import { useDama } from "../DamaContext";
import { idFinder, InitPawns } from "./gameUtils";
import { damaBoard } from "./gameUtils";
import whitePawn from "../assets/whitePawn.png";
import blackPawn from "../assets/blackPawn.png";
import {pawn,square} from "./gameUtils";

function Board()
{
const {createMap,map,createPawns,createEnemyPawns,
pawns,enemyPawns,newPositionPawns,newPositionEnemyPawns,killPawn,killEnemyPawn,turn,switchTurn
}=useDama();
const CanvasRef=useRef(null);

useEffect(()=>
{
const canvas=CanvasRef.current;
const c=canvas.getContext("2d");
let Map=new Array(32).fill(null);

const ratio=window.devicePixelRatio||1;
const resWidth=800;
const resHeight=800;
canvas.width=resWidth*ratio;
canvas.height=resHeight*ratio;
canvas.style.width=resWidth+"px";
canvas.style.height=resHeight+"px";
c.scale(ratio,ratio);

damaBoard(c,Map);
createMap(Map);
InitPawns(c,Map,createPawns,createEnemyPawns);

   
},[])

useEffect(()=>
{
if(turn===true)
{
const canvas=CanvasRef.current;
const c=canvas.getContext("2d");

let pawnIcon=new Image(80,80);
let enemyIcon=new Image(80,80);
pawnIcon.src=whitePawn;
enemyIcon.src=blackPawn;

let validMoves=[];
let selectedPawn=null;
let validForMove=[];
let selectedForMove=null;
let prevValidMoves=[];

function dimension(e)
{
let canvasFrame=canvas.getBoundingClientRect();
let posX=e.clientX-canvasFrame.left;
let posY=e.clientY-canvasFrame.top;
let point={x:posX,y:posY}
return point;
}

//hover effect
function mouseMove(e)
{
let point=dimension(e);
let hovering=false;
pawns.forEach((pawn)=>
{
if(point.x>=pawn.x&&point.x<=pawn.x+pawn.width
&&point.y>=pawn.y&&point.y<=pawn.y+pawn.height)
{
hovering=true;
}
})
canvas.style.cursor=hovering?"pointer":"default";
};
canvas.addEventListener("mousemove",mouseMove);
//hover effect

function validMove(e)
{
let point=dimension(e);
console.log(validForMove);
for(let move of validForMove)
{
if(point.x>=move.x&&point.x<=move.x+move.width
  &&point.y>=move.y&&point.y<=move.y+move.height)
{
  console.log(move.x)
newPositionPawns(selectedForMove.id,move.x,move.y);
if(move.kill)
{
  killEnemyPawn(move.kill);
}

switchTurn(turn);
validForMove = [];
selectedForMove = null;
return;
}}


prevValidMoves.forEach(move=>
{
let Square=new square(c,move.x,move.y,100,100,"black");
Square.build();
})

//logic for validMovves
for(let i=0;i<pawns.length;i++)
{
if(point.x>=pawns[i].x&&point.x<=pawns[i].x+pawns[i].width
&&point.y>=pawns[i].y&&point.y<=pawns[i].y+pawns[i].height)
{
selectedPawn=pawns[i]
break;
}
};


if(selectedPawn!=null)
{
for(let i=1;i<=map.length;i++)
{
let indexPawn=0;
let oddRow=i/4%2!==0;
let evenRow=Math.ceil(i/4)%2==0;
let firstCol=i%4==1;
let secondCol=i%4==2;
let thirdCol=i%4==3;
let forthCol=i%4==0;

if(selectedPawn.x==map[i-1].x&&selectedPawn.y==map[i-1].y)
{
  indexPawn=i-1;

  let evenHasRightEnemy=enemyPawns.some(e=>e.x===map[indexPawn+5].x&&e.y===map[indexPawn+5].y)
  &&!enemyPawns.some(e=>e.x===map[indexPawn+9].x&&e.y===map[indexPawn+9].y);
  let evenHasLeftEnemy=enemyPawns.some(e=>e.x===map[indexPawn+4].x&&e.y===map[indexPawn+4].y)
  &&!enemyPawns.some(e=>e.x===map[indexPawn+7].x&&e.y===map[indexPawn+7].y); //logic to check evenspawns enemies

  let oddHasRightEnemy=enemyPawns.some(e=>e.x===map[indexPawn+4].x&&e.y===map[indexPawn+4].y)
  &&!enemyPawns.some(e=>e.x===map[indexPawn+9].x&&e.y===map[indexPawn+9].y);
  let oddHasLeftEnemy=enemyPawns.some(e=>e.x===map[indexPawn+3].x&&e.y===map[indexPawn+3].y)
  &&!enemyPawns.some(e=>e.x===map[indexPawn+7].x&&e.y===map[indexPawn+7].y); //logic to check oddpawns enemies;



if (oddRow && firstCol) {
    validMoves = [map[indexPawn + 4], map[indexPawn + 5]];
    oddHasRightEnemy ? validMoves.push({
        kill: idFinder(enemyPawns,map[indexPawn + 4]),
        x: map[indexPawn + 9].x,
        y: map[indexPawn + 9].y,
        width: map[indexPawn + 9].width,
        height: map[indexPawn + 9].height
    }) : null;
}
else if (oddRow && secondCol) {
    validMoves = [map[indexPawn + 4], map[indexPawn + 5]];
    oddHasRightEnemy ? validMoves.push({
        kill: idFinder(enemyPawns,map[indexPawn + 4]),
        x: map[indexPawn + 9].x,
        y: map[indexPawn + 9].y,
        width: map[indexPawn + 9].width,
        height: map[indexPawn + 9].height
    }) : null;
    oddHasLeftEnemy ? validMoves.push({
        kill: idFinder(enemyPawns,map[indexPawn + 3]),
        x: map[indexPawn + 7].x,
        y: map[indexPawn + 7].y,
        width: map[indexPawn + 7].width,
        height: map[indexPawn + 7].height
    }) : null;
}
else if (oddRow && thirdCol) {
    validMoves = [map[indexPawn + 4], map[indexPawn + 5]];
    oddHasRightEnemy ? validMoves.push({
        kill: idFinder(enemyPawns,map[indexPawn + 4]),
        x: map[indexPawn + 9].x,
        y: map[indexPawn + 9].y,
        width: map[indexPawn + 9].width,
        height: map[indexPawn + 9].height
    }) : null;
    oddHasLeftEnemy ? validMoves.push({
        kill: idFinder(enemyPawns,map[indexPawn + 3]),
        x: map[indexPawn + 7].x,
        y: map[indexPawn + 7].y,
        width: map[indexPawn + 7].width,
        height: map[indexPawn + 7].height
    }) : null;
}
else if (oddRow && forthCol) {
    validMoves = [map[indexPawn + 4]];
    oddHasLeftEnemy ? validMoves.push({
        kill: idFinder(enemyPawns,map[indexPawn + 3]),
        x: map[indexPawn + 7].x,
        y: map[indexPawn + 7].y,
        width: map[indexPawn + 7].width,
        height: map[indexPawn + 7].height
    }) : null;
}

if (evenRow && firstCol) {
    validMoves = [map[indexPawn + 4]];
    evenHasRightEnemy ? validMoves.push({
        kill: idFinder(enemyPawns,map[indexPawn + 5]),
        x: map[indexPawn + 9].x,
        y: map[indexPawn + 9].y,
        width: map[indexPawn + 9].width,
        height: map[indexPawn + 9].height
    }) : null;
}
else if (evenRow && secondCol) {
    validMoves = [map[indexPawn + 3], map[indexPawn + 4]];
    evenHasRightEnemy ? validMoves.push({
        kill: idFinder(enemyPawns,map[indexPawn + 5]),
        x: map[indexPawn + 9].x,
        y: map[indexPawn + 9].y,
        width: map[indexPawn + 9].width,
        height: map[indexPawn + 9].height
    }) : null;
    evenHasLeftEnemy ? validMoves.push({
        kill: idFinder(enemyPawns,map[indexPawn + 4]),
        x: map[indexPawn + 7].x,
        y: map[indexPawn + 7].y,
        width: map[indexPawn + 7].width,
        height: map[indexPawn + 7].height
    }) : null;
}
else if (evenRow && thirdCol) {
    validMoves = [map[indexPawn + 3], map[indexPawn + 4]];
    evenHasRightEnemy ? validMoves.push({
        kill: idFinder(enemyPawns,map[indexPawn + 5]),
        x: map[indexPawn + 9].x,
        y: map[indexPawn + 9].y,
        width: map[indexPawn + 9].width,
        height: map[indexPawn + 9].height
    }) : null;
    evenHasLeftEnemy ? validMoves.push({
        kill: idFinder(enemyPawns,map[indexPawn + 4]),
        x: map[indexPawn + 7].x,
        y: map[indexPawn + 7].y,
        width: map[indexPawn + 7].width,
        height: map[indexPawn + 7].height
    }) : null;
}
else if (evenRow && forthCol) {
    validMoves = [map[indexPawn + 3], map[indexPawn + 4]];
    evenHasLeftEnemy ? validMoves.push({
        kill: idFinder(enemyPawns,map[indexPawn + 4]),
        x: map[indexPawn + 7].x,
        y: map[indexPawn + 7].y,
        width: map[indexPawn + 7].width,
        height: map[indexPawn + 7].height
    }) : null;
}}}

let _validMoves=validMoves.filter(m=>!enemyPawns.some(p=>p.y===m.y&&p.x===m.x)&&!pawns.some(p=>p.y===m.y&&p.x===m.x))
prevValidMoves=_validMoves;
validForMove=_validMoves; //key expression
selectedForMove=selectedPawn;

_validMoves.forEach(m=>
    {
      let s=new square(c,m.x,m.y,100,100,"green");
      s.build();
    })
    
}
else return ;
}

canvas.addEventListener("click",validMove);

return () => {
    canvas.removeEventListener("mousemove", mouseMove);
    canvas.removeEventListener("click", validMove);
  };
}},[pawns,turn,enemyPawns])



//Enemy turn 
useEffect(()=>
{
if(turn===false)
{

const canvas=CanvasRef.current;
const c=canvas.getContext("2d");
let pawnIcon=new Image(80,80);
let enemyIcon=new Image(80,80);
pawnIcon.src=whitePawn;
enemyIcon.src=blackPawn;
let selectedPawns=Array.from(enemyPawns);
let randPawn=null; 
let validMoves=[]; //valids moves
let validForMove=[]; //check if its possible for pawn to make a move
let prevValidMoves=[]; // previus green highlighted moves so i can clear and redraw their position



for(let selectedPawn of selectedPawns)
{
let indexPawn=map.findIndex(s => s.x === selectedPawn.x && s.y === selectedPawn.y)
let row=Math.floor(indexPawn/4);
let evenRow=row%2==0;
let oddRow=!evenRow;
let firstCol=indexPawn%4==1;
let secondCol=indexPawn%4==2;
let thirdCol=indexPawn%4==3;
let forthCol=indexPawn%4==0;
let curr_pos=null;

if(oddRow&&firstCol)
{
validMoves=[map[indexPawn-4]];
curr_pos="odd";

}
else if(oddRow&&secondCol)
{
validMoves=[map[indexPawn-4],map[indexPawn-5]];
curr_pos="odd";
console.log("odd");
}
else if(oddRow&&thirdCol)
{
validMoves=[map[indexPawn-4],map[indexPawn-5]];
curr_pos="odd";
console.log("odd");
}
else if(oddRow&&forthCol)
{
 validMoves=[map[indexPawn-4],map[indexPawn-5]]; 
 curr_pos="odd"; 
 
}
if(evenRow&&firstCol)
{
validMoves=[map[indexPawn-3],map[indexPawn-4]];
curr_pos="even";

}
else if(evenRow&&secondCol)
{
validMoves=[map[indexPawn-3],map[indexPawn-4]];
curr_pos="even";

}
else if(evenRow&&thirdCol)
{
validMoves=[map[indexPawn-3],map[indexPawn-4]]
curr_pos="even";

}
else if(evenRow&&forthCol)
{
validMoves=[map[indexPawn-4]];
curr_pos="even";

}

let _validMoves=validMoves.filter(m=>!enemyPawns.some(p=>p.y===m.y&&p.x===m.x)&&!pawns.some(p=>p.y===m.y&&p.x===m.x))
if(_validMoves.length>0)
{
validForMove.push({id:selectedPawn.id,x:selectedPawn.x,y:selectedPawn.y,moves:_validMoves,pos:curr_pos});
}
else 
{
  continue;
}
}
   

function randMove()
{
let randPawnIndex=Math.floor(Math.random()*validForMove.length);
randPawn=validForMove[randPawnIndex];
let randMoveIndex=Math.floor(Math.random()*randPawn.moves.length);
let randMove={x:randPawn.moves[randMoveIndex].x,
y:randPawn.moves[randMoveIndex].y
};
let Index=map.findIndex(s=>s.x===randPawn.x&&s.y===randPawn.y)
randPawn.moves.forEach(m=>
    {
      let s=new square(c,m.x,m.y,100,100,"green");
      s.build();
    });
let s=new square(c,randPawn.x,randPawn.y,100,100,"green");
s.build();
randPawn.width=100;
randPawn.height=100;
setTimeout(()=>
{
let p=new pawn(c,randPawn).init(enemyIcon);
},100)


s.build();
if(randPawn)

console.log(randPawn.id,randPawn.pos,Index);
setTimeout(()=>{
newPositionEnemyPawns(randPawn.id,randMove.x,randMove.y);
switchTurn(turn);
randPawn.moves.forEach(move=>
{
let Square=new square(c,move.x,move.y,100,100,"black");
Square.build();
})
validForMove = [];
validMoves=[];
randPawn=null;
prevValidMoves=[];
 },2000)
}
setTimeout(()=>{
randMove(); 

},1000)}},[turn,pawns,enemyPawns]);

//redraw logic !
useEffect(() => {
    const canvas = CanvasRef.current;
    const c = canvas.getContext("2d");

    c.clearRect(0, 0, canvas.width, canvas.height);
    map.forEach((s) =>
      new square(c, s.x, s.y, s.width, s.height, "black").build()
    );

    pawns.forEach((p) => {
      let Pawn = new pawn(c, p);
      Pawn.init(p.icon || whitePawn);
    });

    enemyPawns.forEach((p) => {
      let Pawn = new pawn(c, p);
      Pawn.init(p.icon || blackPawn);
    });

    

  

  }, [pawns,enemyPawns]);


return(
    <canvas ref={CanvasRef} className="border border-black z-50 bg-white">

    </canvas>
)
}

export default Board;