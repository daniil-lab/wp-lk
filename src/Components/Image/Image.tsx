import React from "react";
import "Styles/Components/Image/Image.scss";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  frame: {
    width: number | string;
    height: number | string;
  };
}

const Image: React.FunctionComponent<Props> = (props: Props) => {
  return (
    <div
      className={`${props.className} image`}
      style={{
        width: props.frame.width,
        height: props.frame.height,
      }}
    >
      <img
        src={props.src}
        alt={props.alt}
        width={props.width}
        height={props.height}
      />
    </div>
  );
};

export default Image;
