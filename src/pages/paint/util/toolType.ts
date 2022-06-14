/**
 * 工具类型
 */
export enum ToolType {
  PEN, // 笔
  COLOR_FILL, // 填充
  TEXT, // 文字
  COLOR_EXTRACT, // 颜色提取
  ERASER, // 橡皮擦
  MAGNIFYING, // 放大镜
  SHAPE // 形状
}

/**
 * 形状类型
 */
export enum ShapeToolType {
  /**直线 */
  LINE,
  /**矩形 */
  RECT,
  /**圆 */
  CIRCLE,
  /**菱形 */
  RHOMBUS,
  /**三角形 */
  TRIANGLE,
  /**五边形 */
  PENTAGON,
  /**六边形 */
  SEXANGLE,
  /**上箭头 */
  ARROW_TOP,
  /**右箭头 */
  ARROW_RIGHT,
  /**下箭头 */
  ARROW_DOWN,
  /**左箭头 */
  ARROW_LEFT,
  /**四角星 */
  FOUR_STAR
}

/**
 * 形状轮廓类型
 */
export enum ShapeOutlineType {
  /**实线 */
  SOLID,
  /**虚线 */
  DOTTED
}

/**
 * 线宽
 */
export enum LineWidthType {
  THIN,
  MIDDLE,
  BOLD,
  MAXBOLD,
  LINESIZE
}

/**
 * 当前选择的颜色：主、副
 */
export enum ColorType {
  MAIN,
  SUB
}

/*

font_Family
*/


