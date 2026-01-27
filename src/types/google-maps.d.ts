declare namespace google.maps {
  class Map {
    constructor(element: HTMLElement, options: MapOptions);
    setZoom(zoom: number): void;
    fitBounds(bounds: LatLngBounds): void;
  }

  interface MapOptions {
    zoom?: number;
    center?: LatLng | LatLngLiteral;
    mapTypeControl?: boolean;
    fullscreenControl?: boolean;
    streetViewControl?: boolean;
  }

  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
    getPosition(): LatLng | null | undefined;
    addListener(eventName: string, callback: () => void): void;
  }

  interface MarkerOptions {
    position: LatLng | LatLngLiteral;
    map: Map;
    title?: string;
    icon?: string;
  }

  class InfoWindow {
    constructor(options: InfoWindowOptions);
    open(map: Map, marker?: Marker): void;
  }

  interface InfoWindowOptions {
    content?: string;
  }

  class LatLngBounds {
    extend(point: LatLng): void;
  }

  interface LatLng {
    lat(): number;
    lng(): number;
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }
}

declare const google: {
  maps: typeof google.maps;
};
