// @ts-nocheck
import { createControlComponent } from '@react-leaflet/core';
import Leaflet from 'leaflet';

Leaflet.Control.ExpandControl = Leaflet.Control.extend({
  onAdd: function (map) {
    const container = Leaflet.DomUtil.create(
      'div',
      'leaflet-bar leaflet-control leaflet-control-custom'
    );
    container.innerHTML = '<i class="fas fa-expand"></i>';
    container.style.fontSize = '20px';
    container.style.textAlign = 'center';
    container.style.display = 'table-cell';
    container.style.verticalAlign = 'middle';
    container.style.backgroundColor = 'white';
    container.style.cursor = 'pointer';
    container.style.width = '34px';
    container.style.height = '34px';

    container.onclick = function () {
      map.setView([36.56028, 139.19333], 6);
    };
    return container;
  },
});

export const ExpandControl = createControlComponent(
  (props) => new Leaflet.Control.ExpandControl(props)
);
