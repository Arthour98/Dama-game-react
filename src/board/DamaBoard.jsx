import React,{useRef,useEffect} from "react";
import { useDama } from "../DamaContext";




function Board()
{
const {createMap,map}=useDama();
const CanvasRef=useRef(null);


function square(c,x,y,width,height)
{
this.c=c;
this.x=x;
this.y=y;
this.width=width;
this.height=height;
this.build=function()
{
c.save();
c.beginPath();
c.rect(this.x,this.y,this.width,this.height);
c.fillStyle="black";
c.fill();
c.stroke();
c.closePath()
c.restore();
}
}


console.log(Map);

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
Map[i]=new square(c,x,y,width,height)
Map[i].build();
}
createMap(Map);
},[])








return(
    <canvas ref={CanvasRef} className="border border-black">

    </canvas>
)
}

export default Board;