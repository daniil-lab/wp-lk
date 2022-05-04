import { useEffect, useState } from "react";

type arcradius = { x: number; y: number };

const CreateDonutChart = (data: []) => {
  const [chartData, setChartData] = useState<Array<any>>([]);

  const arcradius = (
    cx: number,
    cy: number,
    radius: number,
    degrees: number
  ): arcradius => {
    var radians = ((degrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + radius * Math.cos(radians),
      y: cy + radius * Math.sin(radians),
    };
  };

  const initOnLoad = (): void => {
    const radius = 15;
    const decimals = 4;

    let total = 0;
    let arr: any = [];
    let beg = 0;
    let end = 0;
    let count = 0;

    const array = data;

    array.forEach((v, i) => {
      total += +v.sum;
    });

    array.forEach((v, i) => {
      let tmp: any = {};

      let p = ((+v.sum + 1) / total) * 100;

      count += p;

      if (i === array.length - 1 && count < 100) p = p + (100 - count);

      end = beg + (360 / 100) * p;

      let b = arcradius(21, 21, radius, end);
      let e = arcradius(21, 21, radius, beg);
      let la = end - beg <= 180 ? 0 : 1;

      tmp.d = [
        "M",
        b.x.toFixed(decimals),
        b.y.toFixed(decimals),
        "A",
        radius,
        radius,
        0,
        la,
        0,
        e.x.toFixed(decimals),
        e.y.toFixed(decimals),
      ].join(" ");
      tmp.stroke = v.color;
      arr.push(tmp);
      beg = end;
    });

    setChartData(arr);
  };

  useEffect(() => {
    initOnLoad();
  }, [data]);

  return { chartData };
};

export default CreateDonutChart;
