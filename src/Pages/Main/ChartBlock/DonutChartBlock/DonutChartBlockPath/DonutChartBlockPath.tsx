import React, { useState, useCallback } from "react";
import ClickTooltip from "../../../../../Components/ClickTooltip";
import { ChartPathData } from "../../../../../Utils/CreateDonutChart";

import "../../../../../Styles/Pages/Main/ChartBlock/DonutChartBlock/DonutChartBlockPath/DonutChartBlockPath.scss";

type DonutChartBlockPathProps = {
  chartDataItem: ChartPathData;
};

const DonutChartBlockPath: React.FC<DonutChartBlockPathProps> = ({
  chartDataItem,
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [pathCenterCoords, setPathCenterCoords] = useState({
    x: 0,
    y: 0,
  });

  const handlePathClick = (event) => {
    const target = event.target as SVGPathElement;
    const svgElem = target?.parentElement as SVGElement | null;
    const offsetParent = target?.parentElement?.parentElement as HTMLElement;
    if (!(svgElem && offsetParent)) return;

    const svgBoundingRect = svgElem.getBoundingClientRect();
    const offsetBoundingRect = offsetParent.getBoundingClientRect();
    const coords = {
      x: svgBoundingRect.x - offsetBoundingRect.x + chartDataItem.center.x,
      y: svgBoundingRect.y - offsetBoundingRect.y + chartDataItem.center.y,
    };

    setPathCenterCoords(coords);
    setTooltipOpen(true);
  };

  const handleCloseTooltip = useCallback(() => setTooltipOpen(false), []);

  return (
    <>
      <ClickTooltip
        open={tooltipOpen}
        coords={pathCenterCoords}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        elemToAppend={".donut-chart .center"}
        onClose={handleCloseTooltip}
      >
        <div className="tooltip__wrapper">{chartDataItem.categoryName}</div>
      </ClickTooltip>
      <path
        fill="transparent"
        strokeWidth="5"
        strokeDashoffset={10}
        strokeLinejoin="round"
        className="circle-part"
        onClick={handlePathClick}
        {...chartDataItem.svgProps}
      />
    </>
  );
};

export default DonutChartBlockPath;
