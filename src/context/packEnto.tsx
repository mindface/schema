import { Dispatch, createContext, useContext, useReducer, ReactNode } from "react";
import { PackEnto } from "../types/packEnto";

interface State {
  items: PackEnto[]
  item: PackEnto,
  division: number
}

interface Action {
  type: string
  dates?: PackEnto[]
  data?: any
  division?: number
}

interface Props {
  children: ReactNode
}

export const packEntoContext = createContext({} as {
  state_p: State,
  dispatch_p: Dispatch<Action>
})

const reducer = (state:State,action:Action) => {
  switch (action.type) {
    case "data/add":
      return {
        ...state,
        items: [...state.items,action.data]
      }
    case "data/addList":
      console.log(action)
      console.log(action.dates)
      return {
        ...state,
        items: action.dates!
      }
    case "data/update":
      const __ = state.items.map((item) => {
        return item.id === action.data?.id ? action.data : item; 
      })
      return {
        ...state,
        items: __
      }
    case "data/divisionSet":
      return {
        ...state,
        division: action.division!
      }
    default:
      return state
  }
}

const initalState: State = {
  items:[
   {
     id: 1,
     title: "testtest",
     description: "",
     itemNumber: 0,
     groupNumber: 0
    }
  ],
  item: {
    id: 1,
    title: "testtest f",
    description: "",
    itemNumber: 0,
    groupNumber: 0
  },
  division: 0
}

export const PackEntoProvider = (props:Props) => {
  const [state_p,dispatch_p] = useReducer(reducer,initalState);
  return <packEntoContext.Provider value={{state_p, dispatch_p}}>{props.children}</packEntoContext.Provider>
}