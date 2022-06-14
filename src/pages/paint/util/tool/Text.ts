import Tool from "./tool";

// interface propsInput = {
//             x?: number,
//             y?: Number,
//             maxWidth?:Number
// }

class Text extends Tool {
  private isMouseDown = false;
  private saveImageData?: ImageData;
  private _x: number;
  private _y: number;
  private textContent: string;
  private textBox: any;
  private fontStyle: any;
  private canvas: any;
  public constructor(fontType: any) {
    super();
    this._x = NaN;
    this._y = NaN;
    this.textBox = document.getElementById("textBox");
    this.canvas = document.getElementById("ccc-paint-canvas");
    this.textContent = "";
    this.fontStyle = fontType;
  }

  private drawing(x: number, y: number) {
    const context = Tool.ctx;
    if (!context || !this.canvas) {
      return;
    } else {
      // 设置画笔的颜色和大小

      context.fillStyle = "#000"; // 填充颜色为红色
      // context.strokeStyle = "blue"; // 画笔的颜色
      context.lineWidth = 5; // 指定描边线的宽度
      context.font = "10px";

      if (this.canvas && this.fontStyle) {
        const { fontSize = 12, fontFamily, letterSpacing } = this.fontStyle;
        context.fillStyle = this.textBox.color || "#000";
        context.font = `${fontSize} ${fontFamily}`; // 指定描边线的宽度
        this.canvas.style.letterSpacing = letterSpacing;
      }

      context.save();
      context.beginPath();

      // 写字
      //   const width = this.canvas.offsetWidth;
      //   console.log("----546", this.canvas);
      //   const height = this.canvas.offsetHeight;
      //   const tempImg = new Image();
      //   tempImg.width = width;
      //   tempImg.height = height;
      //   tempImg.onload = function () {
      //     // 把img绘制在canvas画布上
      //     context.drawImage(tempImg, 0, 0, width, height);
      //   };
      //   (tempImg.src =
      //     'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg"><foreignObject width="' +
      //     width +
      //     '" height="' +
      //     height +
      //     '"><body xmlns="http://www.w3.org/1999/xhtml" style="margin:0;font:' +
      //     context.font +
      //     ';">' +
      //     this.textContent),
      //     +"</body></foreignObject></svg>";
      context.fillText(this.textContent, parseInt(this.textBox.style.left), parseInt(this.textBox.style.top));
      // this.wrapText(this.textContent, parseInt(this.textBox.style.left), parseInt(this.textBox.style.top));
      context.restore();
      context.closePath();
    }
  }

  public onMouseDown(event: MouseEvent): void {
    // 鼠标按下位置保存

    event.preventDefault();

    if (this.isMouseDown) {
      this.textContent = this.textBox.value;
      this.isMouseDown = false;
      this.textBox.style["z-index"] = 1;
      this.textBox.style.visibility = "hidden";
      this.drawing(this._x, this._y);
      this.textBox.value = "";
    } else if (!this.isMouseDown) {
      this._x = event.offsetX; // 鼠标按下时保存当前位置，为起始位置
      this._y = event.offsetY;
      this.isMouseDown = true;
      if (typeof this.fontStyle === "object") {
        Object.keys(this.fontStyle).forEach((va) => {
          this.textBox.style[va] = this.fontStyle[va];
        });
      }
      this.textBox.style.left = this._x + "px";
      this.textBox.style.top = this._y + "px";
      this.textBox.style["z-index"] = 6;
      this.textBox.style.visibility = "visible";
    }
  }
}

export default Text;
