import { Component, Input, signal } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as Leaflet from 'leaflet';
import { ItineraryItem, LeafletPosition } from '../../models/trips';
Leaflet.Icon.Default.imagePath = 'assets/';

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
      this.activity.set(activity);
      this.initialMarkers = [
        {
          position: Leaflet.latLng(
            activity.startLocation?.latitude ?? 0,
            activity.startLocation?.longitude ?? 0
          ),
        },
        {
          position: Leaflet.latLng(
            activity.endLocation?.latitude ?? 0,
            activity.endLocation?.longitude ?? 0
          ),
        },
      ];
      this.options = {
        ...this.options,
        center: Leaflet.latLng(
          activity.startLocation?.latitude ?? 0,
          activity.startLocation?.longitude ?? 0
        ),
      };
      this.title.set(activity.title);
    } else {
      this.options = {
        ...this.options,
        center: Leaflet.latLng(0, 0),
      };
    }
  }

  title = signal('Activity Location');
  activity = signal<ItineraryItem | null>(null);

  map: Leaflet.Map | null = null;
  markers: Leaflet.Marker[] = [];
  initialMarkers: LeafletPosition[] = [
    {
      position: Leaflet.latLng(0, 0),
    },
    {
      position: Leaflet.latLng(0, 0),
    },
  ];
  options = {
    layers: [
      Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 1,
        maxZoom: 20,
      }),
    ],
    zoom: 12,
    center: Leaflet.latLng(0, 0),
  };

  initMarkers() {
    for (const marker of this.initialMarkers) {
      if (this.map) {
        const generatedMarker = this.generateMarker(marker);
        generatedMarker.addTo(this.map).bindPopup(this.title());
        this.markers.push(generatedMarker);
      }
    }
  }

  generateMarker(data: LeafletPosition) {
    return Leaflet.marker(data.position, { draggable: false });
  }

  onMapReady(map: Leaflet.Map) {
    this.map = map;
    this.initMarkers();
  }

  mapClicked(position: Leaflet.LeafletMouseEvent) {
    if (this.map) {
      if (!this.activity()) {
        const marker = this.generateMarker({ position: position.latlng });
        marker.addTo(this.map).bindPopup(this.title());
      }
    }
  }
}
