import React, { useRef } from "react";
import useDraggableScroll from "Utils/Hooks/useDraggableScroll";
import Checkmark from "Components/Checkmark/Checkmark";

import "Styles/Pages/Main/CategoryBlock/CategoryConstructor/ColorsBlock/ColorsBlock.scss";
import { ColorType } from "Models/CategoryModel";
import useGetCategoryColors from "Services/Category/useGetCategoryColors";

interface Props {
  onColorChange: (color: ColorType) => void;
  color: ColorType | null;
}

const ColorsBlock: React.FunctionComponent<Props> = ({
  onColorChange,
  color: colorValue,
}: Props) => {
  const ref = useRef(null);

  const { onMouseDown } = useDraggableScroll(ref, { direction: "horizontal" });

  const { load, colors } = useGetCategoryColors();

  if (!load) return null;
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
