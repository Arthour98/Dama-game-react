import React,{useContext,createContext,useEffect,useState} from "react";



const DamaContext=createContext();


export default function DamaProvider({children})
{
    const [pawns,setPawns]=useState([]);
    const [enemyPawns,setEnemyPawns]=useState([]);
    const [map,setMap]=useState([]);
    const [position,setPosition]=useState(pawns)
   


    const createPawns=(pawnsArr)=>
    {
        setPawns(pawnsArr);
    }

    const createEnemyPawns=(enemyPawnsArr)=>
    {
        setEnemyPawns(enemyPawnsArr)
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

    const newPosition=(pawn)=>
    {
        setPosition(pawn={x,y},...pawns);
    }




return(
    <>
    <DamaContext.Provider value=
    {{createMap,createEnemyPawns,createPawns,
    killPawn,killEnemyPawn,newPosition,
    position,map,pawns,enemyPawns}}>
        {children}
    </DamaContext.Provider>
    </>
)
};

export const useDama=()=>
{
    return useContext(DamaContext);
}