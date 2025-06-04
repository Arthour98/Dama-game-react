import React,{useContext,createContext,useEffect,useState} from "react";



const DamaContext=createContext();


export default function DamaProvider({children})
{
    const [pawns,setPawns]=useState([]);
    const [enemyPawns,setEnemyPawns]=useState([]);
    const [map,setMap]=useState([]);
    const [turn,setTurn]=useState(true);
    
   


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

 const newPosition = (id, x, y) => {
    setPawns((newPos) => {
      const updated = newPos.map((p) =>
        p.id === id ? { ...p, x, y } : p
      );
      return [...updated];
    });
  };

const switchTurn=(turn)=>
{
setTurn(!turn);
}


return(
    <>
    <DamaContext.Provider value=
    {{createMap,createEnemyPawns,createPawns,
    killPawn,killEnemyPawn,newPosition,switchTurn,turn,
     map,pawns,enemyPawns}}>
        {children}
    </DamaContext.Provider>
    </>
)
};

export const useDama=()=>
{
    return useContext(DamaContext);
}