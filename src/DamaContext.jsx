import React,{useContext,createContext,useEffect,useState} from "react";



const DamaContext=createContext();


export default function DamaProvider({children})
{
    const [pawns,setPawns]=useState([]);
    const [enemyPawns,setEnemyPawns]=useState([]);
    const [map,setMap]=useState([]);
    
   


    const CreatePawns=(numb)=>
    {
        let pawnsArr=new Array(numb);
        setPawns(pawnsArr);
    }

    const createEnemyPawns=(numb)=>
    {
        let pawnsArr=new Array(numb);
        setEnemyPawns(pawnsArr)
    }

    const killPawn=(pawn)=>
    {
    let pawnArr=[...pawns.filter(p=>p!=pawn)];
    setPawns(pawnArr);
    }

    const killEnemyPawn=(pawn)=>
    {
    let pawnArr=[...enemyPawns.filter(p=>p!=pawn)];
    setEnemyPawns(pawnArr);
    }

    const createMap=(newmap)=>
    {
    setMap(newmap);
    }


    const initialPos=(map)=>
    {
    let positionsPawns=[];
    let positionsEnemyPawns=[];
    for(let i=0;i<pawns.length;i++)
    {
    for(let y=0;y<pawns.length*2;y+=2)
    {
        positionsPawns[i]=
        {
        pawn:pawns[i],
        pos:map[y][y]
        }
    }
    }

    for(let i=0;i<enemyPawns.length;i++)
    {
    for(let y=0;y<enemyPawns.length*2;y+=2)
    {
        positionsEnemyPawns=
        {
        pawns:pawns[i],
        pos:map[map.length-y][map.length-y]
        }
    }
    }
    const allPos=[...positionsPawns,...positionsEnemyPawns];

    setPosition(allPos);
}


return(
    <>
    <DamaContext.Provider value=
    {{createMap,createEnemyPawns,CreatePawns,
    killPawn,killEnemyPawn,
    initialPos,map,pawns,enemyPawns}}>
        {children}
    </DamaContext.Provider>
    </>
)
};

export const useDama=()=>
{
    return useContext(DamaContext);
}