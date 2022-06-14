import React from "react";
import { useContext } from "react";
import { TextContext, ColorContext } from "../../../../context";
import { ColorBox, createColor } from "material-ui-color";
import "./index.less";
import { useState } from "react";
import { useEffect } from "react";
import { Select, MenuItem, FormControl } from "@material-ui/core";
import IntegerStep from "../components/slider";
import { useMemo } from "react";

interface FormatColor {
  className?: string;
}

const textFamily = [
  "Barlow-ExtraBold",
  "DIN-AlternateBold",
  "Trebuchet-MSBold",
  "Trebuchet-MS",
  "Poppins-Bold",
  "Poppins-Light",
  "Poppins-Medium",
  "Poppins-Regular",
  "Poppins-SemiBold"
];

const FormatColor: React.FC<FormatColor> = (props) => {
  const { className } = props;
  const [pickerColor, setPickerColor] = useState(createColor("#000000FF"));
  const TextToolContext = useContext(TextContext);
  const colorContext = useContext(ColorContext);

  const fontStyle = useMemo(() => {
    return TextToolContext.fontStyle;
  }, [TextToolContext.fontStyle]);

  const activeColorType = colorContext.activeColor;

  useEffect(() => {
    colorContext.setColor(`#${pickerColor.hex}`);
  }, [pickerColor]);

  return (
    <div className={className ? ` ccc-text formatColor ${className}` : "ccc-text colorpanel"}>
      <div className="content">
        <div className="font">
          <h3>Font</h3>
          <FormControl fullWidth>
            <Select
              autoWidth
              className="ccc-text-family"
              onChange={(event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
                TextToolContext.setFont({
                  ...fontStyle,
                  fontFamily: event.target.value as string
                });
              }}
            >
              {textFamily.map((va) => {
                return (
                  <MenuItem key={va} value={va}>
                    {va}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className="font">
          <h3>Letter Spacing</h3>
          <IntegerStep
            min={1}
            max={8}
            onPropsChange={(value) => {
              TextToolContext.setFont({
                ...fontStyle,
                letterSpacing: value + "px"
              });
            }}
          />
        </div>
        <div className="font">
          <h3>Font Size</h3>
          <IntegerStep
            min={12}
            max={72}
            onPropsChange={(value) => {
              TextToolContext.setFont({
                ...fontStyle,
                fontSize: value + "px"
              });
            }}
          />
        </div>
        <div className="font">
          <h3>FLine Height</h3>
          <IntegerStep
            min={24}
            max={56}
            onPropsChange={(value) => {
              TextToolContext.setFont({
                ...fontStyle,
                lineHeight: value + "px"
              });
            }}
          />
        </div>
        <h3>color</h3>
        <div className="material-color-box">
          <ColorBox
            value={pickerColor}
            disableAlpha={false}
            onChange={(color) => {
              setPickerColor(color);
              TextToolContext.setFont({
                ...fontStyle,
                color: "#" + color.hex
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FormatColor;
