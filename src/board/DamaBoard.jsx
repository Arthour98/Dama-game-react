import React,{useRef,useEffect} from "react";
import { useDama } from "../DamaContext";
import { InitPawns } from "./gameUtils";
import { damaBoard } from "./gameUtils";
import whitePawn from "../assets/whitePawn.png";
import blackPawn from "../assets/blackPawn.png";
import {pawn,square} from "./gameUtils";

function Board()
{
const {createMap,map,createPawns,createEnemyPawns,
pawns,enemyPawns,newPosition,killPawn,killEnemyPawn,turn,switchTurn
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
pawns.forEach(pawn=>console.log(pawn));
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


function validMove(e)
{
let point=dimension(e);
for(let move of validForMove)
{
if(point.x>=move.x&&point.x<=move.x+move.width
  &&point.y>=move.y&&point.y<=move.y+move.height
)
{
newPosition(selectedForMove.id,move.x,move.y);
let newPos={id:selectedForMove.id,x:move.x,y:move.y}



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

if(oddRow&&firstCol)
{
validMoves=[map[indexPawn+4],map[indexPawn+5]];
console.log("odd");
}
else if(oddRow&&secondCol)
{
validMoves=[map[indexPawn+4],map[indexPawn+5]];
console.log("odd");
}
else if(oddRow&&thirdCol)
{
validMoves=[map[indexPawn+4],map[indexPawn+5]];
console.log("odd");
}
else if(oddRow&&forthCol)
{
 validMoves=[map[indexPawn+4]];
 console.log("odd");   
}
if(evenRow&&firstCol)
{
validMoves=[map[indexPawn+4]]
console.log("even");
}
else if(evenRow&&secondCol)
{
validMoves=[map[indexPawn+3],map[indexPawn+4]];
console.log("even");
}
else if(evenRow&&thirdCol)
{
validMoves=[map[indexPawn+3],map[indexPawn+4]]
console.log("even");
}
else if(evenRow&&forthCol)
{
validMoves=[map[indexPawn+3],map[indexPawn+4]]
console.log("even");
}}}

let _validMoves=validMoves.filter(m=>!pawns.some(p=>p.y===m.y&&p.x===m.x))
prevValidMoves=_validMoves;
validForMove=_validMoves;
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
}},[pawns,map,turn])


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
    switchTurn(turn);;
  }, [pawns, enemyPawns]);

console.log(turn);
return(
    <canvas ref={CanvasRef} className="border border-black z-50 bg-white">

    </canvas>
)
}

export default Board;