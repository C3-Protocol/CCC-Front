import React, { FC } from "react";
import TextField from "@material-ui/core/TextField";

const TextBox: FC = () => {
  return (
    // <TextField
    //   className="text-box"
    //   id="textBox"
    //   label="Multiline"
    //   multiline
    //   rows={4}
    //   // defaultValue="Default Value"
    // />
    <textarea
      id="textBox"
      name="story"
      className="text-box"
      //rows={2}
    ></textarea>
  );
};
export default TextBox;
