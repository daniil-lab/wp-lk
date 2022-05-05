import React, { useEffect, useRef } from "react";

import "Styles/Components/DrumScrolling/DrumScrolling.scss";
import useDraggableScroll from "Utils/Hooks/useDraggableScroll";

const SHOW_ITEMS = 3;
const HEIGHT_ITEM = 20;
const selected = "active";

interface Props {
  data: any[];
  handler: (v: any) => void;
  tag: string;
}

const DrumScrolling: React.FunctionComponent<Props> = ({
  data,
  handler,
  tag,
}: Props) => {
  const ref = useRef(null);
  const item = useRef(null);

  const { onMouseDown } = useDraggableScroll(ref, { direction: "vertical" });

  const check = (e): void => {
    const rect = e.target.getBoundingClientRect();
    const centerCell: Element | null = document.elementFromPoint(
      rect.left + e.target.offsetWidth / 2,
      rect.top + e.target.offsetHeight / 2
    );
    for (const cell of e.target.getElementsByClassName(selected)) {
      cell.classList.remove(selected);
    }
    centerCell?.classList.add(selected);
    let v = centerCell?.innerHTML;
    handler(v);
  };

  const extendedItems = ["", "", ...data, "", ""];

  useEffect(() => {
    const scrollport: any = document.querySelector(`.drum-scrolling.${tag}`);
    scrollport.addEventListener("scroll", (event) => {
      check(event);
    });
  }, []);
  return (
    <div style={{ position: "relative" }}>
      <div
        className="drum-scrolling-top-mask"
        style={{
          height: HEIGHT_ITEM + 5,
        }}
      ></div>
      <div
        ref={ref}
        onMouseDown={onMouseDown}
        className={`drum-scrolling ${tag}`}
        style={{
          height: SHOW_ITEMS * (HEIGHT_ITEM + 15),
        }}
      >
        {extendedItems.map((i, k) => {
          return (
            <div ref={item} key={k} className={`drum-scrolling-item`}>
              {i}
            </div>
          );
        })}
      </div>
      <div
        className="drum-scrolling-bottom-mask"
        style={{
          height: HEIGHT_ITEM + 5,
        }}
      ></div>
    </div>
  );
};

export default DrumScrolling;
