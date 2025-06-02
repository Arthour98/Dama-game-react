import React,{useRef,useEffect} from "react";
import { useDama } from "../DamaContext";
import { InitPawns } from "./InitGame";
import { ValidMove } from "./ValidMove";


function Board()
{
const {createMap,map,createPawns,createEnemyPawns,
pawns,enemyPawns
}=useDama();
const CanvasRef=useRef(null);


function square(c,x,y,width,height,color)
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
createMap(Map);
},[])

useEffect(() => {
  if (!CanvasRef.current  || !map.length) return;
  const canvas = CanvasRef.current;
  const c = canvas.getContext("2d");
  InitPawns(c,map,createPawns,createEnemyPawns);
}, [map]);

 console.log(pawns);
console.log(enemyPawns);


useEffect(() => {
  if (!CanvasRef.current || !pawns.length || !map.length) return;
  const canvas = CanvasRef.current;
  const c = canvas.getContext("2d");
  ValidMove(canvas, c, pawns, enemyPawns, map);
  console.log(pawns[0]);
  console.log(map[0]);
}, [pawns, map]);







return(
    <canvas ref={CanvasRef} className="border border-black z-50 bg-white">

    </canvas>
)
}

export default Board;