export type Vector = {
  x: number;
  y: number;
};

export type Radian = number;

export const degree = (value: number) => ((value / 180) * Math.PI) as Radian;

export const sub = (v1: Vector, v2: Vector) =>
  ({
    x: v1.x - v2.x,
    y: v1.y - v2.y,
  }) as Vector;

export const add = (v1: Vector, v2: Vector) =>
  ({
    x: v1.x + v2.x,
    y: v1.y + v2.y,
  }) as Vector;

export const theta = ({ x, y }: Vector) => Math.atan2(y, x) as Radian;

export const rotate = ({ x, y }: Vector, rad: Radian) =>
  ({
    x: x * Math.cos(rad) - y * Math.sin(rad),
    y: x * Math.sin(rad) + y * Math.cos(rad),
  }) as Vector;
