import { useState, useCallback, useEffect } from "react";

export type ArcRadius = { x: number; y: number };

const arcradius = (
  cx: number,
  cy: number,
  radius: number,
  degrees: number
): ArcRadius => {
  const radians = ((degrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
};

export type ChartPathData = {
  svgProps: Record<string, string>;
  center: ArcRadius;
  categoryName: string;
};

const CreateDonutChart = (data: any[]) => {
  const [chartData, setChartData] = useState<Array<ChartPathData>>([]);

  const initOnLoad = useCallback((): void => {
    const radius = 15;
    const decimals = 4;

    let total = 0;
    let arr: Array<{
      svgProps: Record<string, string>;
      center: ArcRadius;
      categoryName: string;
    }> = [];
    let beg = 0;
    let end = 0;
    let count = 0;

    const array = data.sort((a, b) => b.sum - a.sum);

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

      const arcCenter = arcradius(21, 21, radius, (end + beg) / 2);
      const coeff = 300 / 42;
      arr.push({
        svgProps: tmp,
        center: { x: arcCenter.x * coeff, y: arcCenter.y * coeff },
        categoryName: v.value,
      });

      beg = end;
    });

    setChartData(arr);
  }, [data]);

  useEffect(() => {
    initOnLoad();
  }, [data, initOnLoad]);

  return { chartData };
};

export default CreateDonutChart;
