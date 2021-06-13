// @ts-nocheck
import { createControlComponent } from '@react-leaflet/core';
import Leaflet from 'leaflet';

Leaflet.Control.GitHubControl = Leaflet.Control.extend({
  onAdd: function (_map) {
    const container = Leaflet.DomUtil.create(
      'div',
      'leaflet-bar leaflet-control leaflet-control-custom'
    );
    container.innerHTML = '<i class="fab fa-github"></i>';
    container.style.fontSize = '28px';
    container.style.textAlign = 'center';
    container.style.display = 'table-cell';
    container.style.verticalAlign = 'middle';
    container.style.backgroundColor = 'white';
    container.style.cursor = 'pointer';
    container.style.width = '40px';
    container.style.height = '40px';

    container.onclick = function () {
      const url = 'https://github.com/yuiseki/crisis-news-map-next';
      const newWindow = window.open(url, '_blank');
      newWindow.focus();
    };
    return container;
  },
});

export const GitHubControl = createControlComponent(
  (props) => new Leaflet.Control.GitHubControl(props)
);
