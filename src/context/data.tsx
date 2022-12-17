import { Dispatch, createContext, useContext, useReducer, ReactNode } from "react";
import { Data } from "../types/data";

interface State {
  dates: Data[]
  data: Data
}

interface Action {
  type: string,
  dates?: Data[],
  data?: any
}

interface Props {
  children: ReactNode
}

export const dataContext = createContext({} as {
  state: State,
  dispatch: Dispatch<Action>
})

const reducer = (state:State,action:Action) => {
  switch (action.type) {
    case "data/add":
      return {
        ...state,
        dates: [...state.dates,action.data]
      }
    case "data/update":
      const __ = state.dates.map((item) => {
        return item.id === action.data.id ? action.data : item; 
      })
      return {
        ...state,
        dates: __
      }
    default:
      return state
  }
}

const initalState: State = {
  dates:[
   {
     id: 1,
     title: "testtest",
     userId: 1
   }
  ],
  data: {
    id: 1,
    title: "testtest",
    userId: 1
  }
}

export const DataProvider = (props:Props) => {
  const [state,dispatch] = useReducer(reducer,initalState);
  return <dataContext.Provider value={{state, dispatch}}>{props.children}</dataContext.Provider>
}