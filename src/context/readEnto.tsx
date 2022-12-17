import { Dispatch, createContext, useContext, useReducer, ReactNode } from "react";
import { ReadEnto } from "../types/readEnto";

interface State {
  items: ReadEnto[]
  item: ReadEnto
  division: number
}

interface Action {
  type: string
  dates?: ReadEnto[]
  data?: any
  division?: number
}

interface Props {
  children: ReactNode
}

export const readEntoContext = createContext({} as {
  state: State,
  dispatch: Dispatch<Action>
})

const reducer = (state:State,action:Action) => {
  switch (action.type) {
    case "data/add":
      return {
        ...state,
        items: [...state.items,action.data]
      }
    case "data/addList":
      return {
        ...state,
        items: action.dates!
      }
    case "data/update":
      const __ = state.items.map((item) => {
        return item.id === action.data.id ? action.data : item; 
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
     coreNumber: 0,
    }
  ],
  item: {
    id: 1,
    title: "testtest",
    description: "",
    coreNumber: 0,
  },
  division: 0
}

export const ReadEntoProvider = (props:Props) => {
  const [state,dispatch] = useReducer(reducer,initalState);
  return <readEntoContext.Provider value={{state, dispatch}}>{props.children}</readEntoContext.Provider>
}