import React, { useEffect, useRef } from "react";
import useDraggableScroll from "Utils/Hooks/useDraggableScroll";
import Checkmark from "Components/Checkmark/Checkmark";

import "Styles/Pages/Main/CategoryBlock/CategoryConstructor/ColorsBlock/ColorsBlock.scss";
import { ColorType } from "Models/CategoryModel";

interface Props {
  onColorChange: (color: ColorType) => void;
  color: ColorType | null;
  colors: ColorType[];
}

const ColorsBlock: React.FunctionComponent<Props> = ({
  onColorChange,
  color: colorValue,
  colors,
}: Props) => {
  const ref = useRef(null);

  const { onMouseDown } = useDraggableScroll(ref, { direction: "horizontal" });

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      className="category-colors"
      style={{
        gridTemplateColumns: colors.map((_) => "1fr").join(" "),
      }}
    >
      {colors.map((color, i) => {
        return (
          <div
            key={i}
            onClick={() => onColorChange(color)}
            className="category-colors-item"
            style={{
              position: "relative",
              backgroundColor: color.hex,
            }}
          >
            {colorValue?.name === color.name && <Checkmark radius={"50%"} />}
          </div>
        );
      })}
    </div>
  );
};

export default ColorsBlock;
