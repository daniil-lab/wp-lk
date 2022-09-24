import React, { useMemo, useState, useRef } from "react";
import { YMaps, Map, Placemark } from "react-yandex-maps";

import "Styles/Pages/Main/ChartBlock/AddOperationModal/MapModal/MapModal.scss";

interface Props {
  onEnter: (v: number[] | null) => void;
}

const MapModal: React.FunctionComponent<Props> = (props: Props) => {
  const [selectCoords, setSelectCoords] = useState<number[] | null>(null);

  useMemo(() => {
    props.onEnter(selectCoords);
  }, [selectCoords]);

  const ref = useRef(null);

  const onMapClick = (e) => {
    const coords = e.get("coords");
    setSelectCoords(coords);
  };

  return (
    <div className="map-modal">
      <YMaps ref={ref}>
        <Map
          defaultState={{ center: [55.75, 37.57], zoom: 9 }}
          className="map"
          width={400}
          height={400}
          onClick={onMapClick}
        >
          {selectCoords && <Placemark geometry={selectCoords} />}
        </Map>
      </YMaps>
    </div>
  );
};

export default MapModal;
// .originalEvent.target._bounds
