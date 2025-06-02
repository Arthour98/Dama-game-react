import whitePawn from "../assets/whitePawn.png";
import blackPawn from "../assets/blackPawn.png";
import { pawn } from "./InitGame";

export function ValidMove(canvas,c,pawns,enemyPawns,map)
{
let pawnIcon=new Image(80,80);
let enemyIcon=new Image(80,80);
pawnIcon.src=whitePawn;
enemyIcon.src=blackPawn;

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
let validMoves=[];
let selectedPawn=null;

for(let i=0;i<pawns.length;i++)
{
let Pawn=new pawn(c,map[i])
if(point.x>=pawns[i].x&&point.x<=pawns[i].x+pawns[i].width
&&point.y>=pawns[i].y&&point.y<=pawns[i].y+pawns[i].height)
{
selectedPawn=map[i];
selectedPawn.color="green";
selectedPawn.build();
Pawn.init(pawnIcon);
}
};
console.log("selected is : "+selectedPawn.x);

if(selectedPawn!=null)
{
//(i%4==0&&i/4%2==0)  left  can two dir
//(i%4!=0&&i/4%2==0)  right can two dir
//else one dir 
//2dir= i=4|5

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
   console.log("index of pawn is :"+i);
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
}

let _validMoves=validMoves.filter(m=>pawns.every(p=>p.y!==m.y))

 



if(_validMoves.length!=0)
{
_validMoves.forEach(m=>
    {
    m.color="green"
    m.build();
    })
}

function Move(e) {
      let point = dimension(e);
      for (let move of validMoves) {
        if (
          point.x >= move.x && point.x <= move.x + move.width &&
          point.y >= move.y && point.y <= move.y + move.height
        ) 
        {
        selectedPawn.x=move.x;
        selectedPawn.y=move.x;

            let Pawn=new pawn(c,pawns);     
          // Redraw everything
          c.clearRect(0,0,canvas.width,canvas.height);
            Pawn.move(currentPos.x,currentPos.y,pawnIcon)


          // Clear highlights
          previousHighlights = [];
          canvas.removeEventListener("click", Move);
          break;
        }
      }
    }

canvas.addEventListener("click",Move);
  

}
}
}
console.log("clicked")
}






canvas.addEventListener("click",validMove);



}