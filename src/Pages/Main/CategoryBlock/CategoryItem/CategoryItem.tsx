import React from "react";

import { API_URL } from "Utils/Config";

import HexToRgbA from "Utils/HexToRgbA";

import "Styles/Pages/Main/CategoryBlock/CategoryItem/CategoryItem.scss";

interface Props {
  name: string;
  icon: string;
  color: string;
}

const CategoryItem: React.FunctionComponent<Props> = (props: Props) => {
  return (
    <div className="category-item">
      <div
        className="category-item-image"
        style={{
          background: props.color,
        }}
      >
        <img
          src={`${API_URL}api/v1/image/content/${props.icon}`}
          alt="Icon category"
        />
      </div>
      <span>{props.name}</span>
    </div>
  );
};

export default CategoryItem;
