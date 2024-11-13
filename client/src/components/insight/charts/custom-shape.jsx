import { Rectangle } from "recharts";

export const CustomShape = (props) => {
  const { x, y, width, height, fill } = props;
  return (
    <Rectangle
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      radius={[5, 5, 0, 0]}
    />
  );
};
