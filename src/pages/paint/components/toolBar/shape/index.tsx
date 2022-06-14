import React from "react";
import {useContext} from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import {ShapeOutlineContext, ShapeTypeContext, ToolTypeContext} from "../../../context";
import { ShapeOutlineType, ShapeToolType, ToolType } from "../../../util/toolType";
import shape_line from '@/assets/images/icon-paint/shape_line.svg'
import shape_rect from '@/assets/images/icon-paint/shape_rect.svg'
import shape_circle from '@/assets/images/icon-paint/shape_circle.svg'
import shape_rhombus from '@/assets/images/icon-paint/shape_rhombus.svg'
import shape_triangle from'@/assets/images/icon-paint/shape_triangle.svg'
import shape_pentagon from '@/assets/images/icon-paint/shape_pentagon.svg'
import shape_sexangle from'@/assets/images/icon-paint/shape_sexangle.svg'
import shape_arrowtop from '@/assets/images/icon-paint/shape_arrowtop.svg'
import shape_arrowright from '@/assets/images/icon-paint/shape_arrowright.svg'
import shape_fourstar from '@/assets/images/icon-paint/shape_fourstar.svg'

import "./index.less";

const selectedShapeClass = "selected-shape";

const shapes = [
    {
        type: ShapeToolType.LINE,
        img: shape_line,
        title: "直线"
    },
    {
        type: ShapeToolType.RECT,
        img: shape_rect,
        title: "矩形"
    },
    {
        type: ShapeToolType.CIRCLE,
        img: shape_circle,
        title: "圆（椭圆）"
    },
    {
        type: ShapeToolType.RHOMBUS,
        img: shape_rhombus,
        title: "菱形"
    },
    {
        type: ShapeToolType.TRIANGLE,
        img: shape_triangle,
        title: "三角形"
    },
    {
        type: ShapeToolType.PENTAGON,
        img: shape_pentagon,
        title: "五边形"
    },
    {
        type: ShapeToolType.SEXANGLE,
        img: shape_sexangle,
        title: "六边形"
    },
    {
        type: ShapeToolType.ARROW_TOP,
        img: shape_arrowtop,
        title: "上箭头"
    },
    {
        type: ShapeToolType.ARROW_RIGHT,
        img: "./icon/shape_arrowright.svg",
        title: "右箭头"
    },
    {
        type: ShapeToolType.ARROW_DOWN,
        img: "./icon/shape_arrowdown.svg",
        title: "下箭头"
    },
    {
        type: ShapeToolType.ARROW_LEFT,
        img: shape_arrowright,
        title: "左箭头"
    },
    {
        type: ShapeToolType.FOUR_STAR,
        img: shape_fourstar,
        title: "四角星"
    }
];

interface ShapePanelProps {
    className?: string;
}

const ShapePanel: React.FC<ShapePanelProps> = (props) => {
    const {className} = props;
    const toolTypeContex = useContext(ToolTypeContext);
    const shapeOutlineContext = useContext(ShapeOutlineContext);

    return (
        <div className={className ? `shapepanel ${className}` : "shapepanel"}>
            <div className="shape-container">
                <div className="shape-content">
                    <ShapeTypeContext.Consumer>
                        {
                            ({type, setType}) => shapes.map((shape) => (
                                <img
                                    src={shape.img}
                                    key={shape.img}
                                    title={shape.title}
                                    className={type === shape.type && toolTypeContex.type === ToolType.SHAPE ? `shape-item ${selectedShapeClass}` : "shape-item"}
                                    onClick={() => setType(shape.type)}
                                />
                            ))
                        }
                    </ShapeTypeContext.Consumer>
                </div>
                <div className="shape-style">
                    <FormControl variant="outlined" disabled={toolTypeContex.type === ToolType.SHAPE ? false : true}>
                        <InputLabel>轮廓</InputLabel>
                        <Select
                            value={shapeOutlineContext.type}
                            onChange={(event) => shapeOutlineContext.setType(event.target.value as ShapeOutlineType)}
                            label="轮廓"
                        >
                            <MenuItem value={ShapeOutlineType.SOLID}>实线</MenuItem>
                            <MenuItem value={ShapeOutlineType.DOTTED}>虚线</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className="title">形状</div>
        </div>
    );
};

export default ShapePanel;
