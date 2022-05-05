import React, { useRef } from "react";
import { API_URL } from "Utils/Config";
import useDraggableScroll from "Utils/Hooks/useDraggableScroll";
import Checkmark from "Components/Checkmark/Checkmark";

import "Styles/Pages/Main/CategoryBlock/CategoryConstructor/IconsBlock/IconsBlock.scss";
import useGetCategoryIcons from "Services/Category/useGetCategoryIcons";
import { IconType } from "Models/CategoryModel";

interface Props {
  onIconChange: (icon: IconType) => void;
  icon: IconType | null;
}

const IconsBlock: React.FunctionComponent<Props> = ({
  onIconChange,
  icon: iconValue,
}: Props) => {
  const ref = useRef(null);

  const { onMouseDown } = useDraggableScroll(ref, { direction: "horizontal" });

  const { load, icons } = useGetCategoryIcons();

  if (!load) return null;
  return (
    <div
      ref={ref}
      className="category-icons"
      style={{
        gridTemplateColumns: icons.map((_) => "1fr").join(" "),
      }}
      onMouseDown={onMouseDown}
    >
      {icons.map((icon, i) => {
        return (
          <div
            key={i}
            className="category-icons-item"
            onClick={() => onIconChange(icon)}
          >
            <img src={`${API_URL}api/v1/image/content/${icon.name}`} />
            {iconValue?.id === icon.id && <Checkmark radius={5} />}
          </div>
        );
      })}
    </div>
  );
};

export default IconsBlock;
