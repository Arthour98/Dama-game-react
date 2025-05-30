
export function ValidMove(canvas,c,pawns,enemyPawns,map)
{
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
console.log("Mousemove listener work");

canvas.addEventListener("click",(e)=>
{
    
})


}