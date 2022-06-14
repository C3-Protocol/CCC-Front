import React from "react";
import { useContext } from "react";
import { ColorContext } from "../../../../../context";
import { ColorType } from "../../../../../util/toolType";
import { ColorBox, createColor } from "material-ui-color";
import "./index.less";
import { useState } from "react";
import { useEffect } from "react";

interface ColorPanelProps {
  className?: string;
  title?: string;
}

const activeColorTypeCls = "active-color-type";

const ColorPanel: React.FC<ColorPanelProps> = (props) => {
  const { className, title } = props;
  const [pickerColor, setPickerColor] = useState(createColor("#000000FF"));
  const colorContext = useContext(ColorContext);
  const activeColorType = colorContext.activeColor;

  useEffect(() => {
    colorContext.setColor(`#${pickerColor.hex}`);
  }, [pickerColor]);

  return (
    <div className={className ? `colorpanel ${className}` : "colorpanel"}>
      <div className="content">
        {title ? (
          <div className="color-result">
            <div
              onClick={() => colorContext.setActiveColor(ColorType.MAIN)}
              className={
                activeColorType === ColorType.MAIN
                  ? `main-color ${activeColorTypeCls}`
                  : "main-color"
              }
            >
              <div
                className="color-box1"
                style={{ backgroundColor: colorContext.mainColor }}
              />
              <div>{title}</div>
            </div>
          </div>
        ) : (
          <h3>color</h3>
        )}
        <div className="material-color-box">
          <ColorBox
            value={pickerColor}
            disableAlpha={false}
            onChange={(color) => {
              setPickerColor(color);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ColorPanel;
