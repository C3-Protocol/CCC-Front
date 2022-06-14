/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import {createContext} from "react";
import Dispatcher from "../util/dispatcher";
import {ColorType, LineWidthType, ShapeOutlineType, ShapeToolType, ToolType} from "../util/toolType";

export const ToolTypeContext = createContext({
    type: ToolType.PEN,
    setType: (type: ToolType) => { },
    
});

export const ShapeTypeContext = createContext({
    type: ShapeToolType.LINE,
    setType: (type: ShapeToolType) => {}
});

export const ShapeOutlineContext = createContext({
    type: ShapeOutlineType.SOLID,
    setType: (type: ShapeOutlineType) => {}
});

export const LineWidthContext = createContext({
    type: LineWidthType.LINESIZE,
    setType: (type: LineWidthType) => { },
    lineSize:1,
    setLineSize: (lineSize:number) => { },
});

export const ColorContext = createContext({
    mainColor: "black",
    subColor: "white",
    activeColor: ColorType.MAIN,
    setColor: (value: string) => {},
    setActiveColor: (type: ColorType) => {}
});

export const FillContext = createContext({
    fillColor: "black",
    setFillColor: (type:string) => {}
});

export const DispatcherContext = createContext({
    dispatcher: new Dispatcher()
});

export const TextContext = createContext({
    fontStyle: {},
    setFont: (type: any) => { }
});
export const SizeContext = createContext({
  size: {},
  onSize: (type: any) => {}
});