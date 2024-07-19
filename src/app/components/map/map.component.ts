import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as Leaflet from 'leaflet';
import { ItineraryItem, LeafletPosition } from '../../models/trips';
Leaflet.Icon.Default.imagePath = 'assets/map/';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [LeafletModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  @Input() set inputActivity(activity: ItineraryItem | null) {
    if (activity) {
      let zoomLevel = 1;
      this.activity.set(activity);
      if (activity.startLocation && activity.endLocation) {
        this.initialMarkers = [
          {
            position: Leaflet.latLng(
              activity.startLocation?.latitude,
              activity.startLocation?.longitude
            ),
          },
          {
            position: Leaflet.latLng(
              activity.endLocation?.latitude,
              activity.endLocation?.longitude
            ),
          },
        ];
        zoomLevel = 12;
      }
      this.options = {
        ...this.options,
        zoom: zoomLevel,
        center: Leaflet.latLng(
          activity.startLocation?.latitude ?? 0,
          activity.startLocation?.longitude ?? 0
        ),
      };
      this.title.set(activity.title);
    } else {
      this.options = {
        ...this.options,
      };
    }
  }
  @Input() set inputLocations(locations: LeafletPosition[] | null) {
    if (locations) {
      this.initialMarkers = locations;
    }
  }
  @Output() locationsChanged = new EventEmitter<LeafletPosition[]>();

  title = signal('Activity Location');
  activity = signal<ItineraryItem | null>(null);

  map: Leaflet.Map | null = null;
  markers: Leaflet.Marker[] = [];
  locations: LeafletPosition[] = [];
  initialMarkers: LeafletPosition[] = [];
  options = {
    layers: [
      Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 1,
        maxZoom: 20,
      }),
    ],
    zoom: 1,
    center: Leaflet.latLng(0, 0),
  };

  initMarkers() {
    if (this.map) {
      for (const marker of this.initialMarkers) {
        const generatedMarker = this.generateMarker(marker, false);
        generatedMarker.addTo(this.map).bindPopup(this.title());
        this.markers.push(generatedMarker);
        this.locations.push({ position: generatedMarker.getLatLng() });
      }
      const bounds = Leaflet.latLngBounds(this.markers.map(m => m.getLatLng()));
      if (bounds.isValid()) {
        this.map.flyToBounds(bounds);
      }
    }
  }

  generateMarker(data: LeafletPosition, isDraggable: boolean) {
    return Leaflet.marker(data.position, { draggable: isDraggable }).on(
      'click',
      click => this.removeMarker(click)
    );
  }

  onMapReady(map: Leaflet.Map) {
    this.map = map;
    this.initMarkers();
  }

  removeMarker(position: Leaflet.LeafletMouseEvent) {
    if (this.map && !this.activity()) {
      for (const marker of this.markers) {
        if (
          marker.getLatLng().lat === position.latlng.lat &&
          marker.getLatLng().lng === position.latlng.lng
        ) {
          this.map.removeLayer(marker);
          this.markers = this.markers.filter(m => m !== marker);
          this.locations = this.locations.filter(
            l => l.position !== marker.getLatLng()
          );
          this.locationsChanged.emit(this.locations);
        }
      }
    }
  }

  mapClicked(position: Leaflet.LeafletMouseEvent) {
    if (this.map && !this.activity() && this.markers.length < 2) {
      const marker = this.generateMarker({ position: position.latlng }, false);
      marker.addTo(this.map);
      this.markers.push(marker);
      this.locations.push({ position: marker.getLatLng() });
      this.locationsChanged.emit(this.locations);
    }
  }
}
