import tw, { css } from 'twin.macro';

export const CommonMapStyle = css`
  ${tw`h-screen mx-auto m-0 p-0`}

  .twitter-share-button {
    z-index: 1000;
    position: absolute !important;
    left: 64px !important;
    bottom: 36px !important;
  }

  .twitter-follow-button {
    z-index: 1000;
    position: absolute !important;
    left: 64px !important;
    bottom: 10px !important;
  }

  #nav-link {
    position: absolute !important;
    top: 10px;
    left: 50px;
    padding: 5px;
    background: white;
  }
  #nav-link i {
    padding-right: 5px;
  }
  #nav-link * {
    width: auto !important;
    text-align: left;
  }

  .leaflet-marker-icon {
    z-index: 9999 !important;
  }

  .leaflet-popup {
    z-index: 10000;
  }

  .leaflet-tooltip-pane {
    z-index: 10000;
  }
`;
