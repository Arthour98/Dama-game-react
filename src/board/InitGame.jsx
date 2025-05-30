
import whitePawn from "../assets/whitePawn.png";
import blackPawn from "../assets/blackPawn.png";

export function InitGame(canvas,map,createPawns,createEnemyPawns)
{


let pawnIcon=new Image(80,80);
let enemyPawnIcon=new Image(80,80);

pawnIcon.src=whitePawn;
enemyPawnIcon.src=blackPawn;
pawnIcon.style.borderRadius=50+"%";

let pawnArr=new Array(12).fill(null);
let enemyPawnArr=new Array(12).fill(null);

let map_copy=Array.from(map);

pawnIcon.onload=()=>
{
for(let i=0;i<pawnArr.length;i++)
{
pawnArr[i]={id:i,icon:pawnIcon,x:map_copy[i].x,
y:map_copy[i].y,width:map_copy[i].width,height:map_copy[i].height};
map_copy[i].pawn(pawnArr[i].icon);
}
}

enemyPawnIcon.onload=()=>
{
for(let i=0;i<enemyPawnArr.length;i++)
{
enemyPawnArr[i]={id:i,icon:enemyPawnIcon,x:map_copy[map_copy.length-1-i].x,
y:map_copy[map_copy.length-1-i].y,width:map_copy[map_copy.length-1-i].width,
height:map_copy[map_copy.length-1-i].height};
map_copy[map_copy.length-1-i].pawn(enemyPawnArr[i].icon);
}
}

createPawns(pawnArr);
createEnemyPawns(enemyPawnArr);



}