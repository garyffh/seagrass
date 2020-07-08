import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {map, tap} from 'rxjs/operators';

import { HttpService } from './http.service';

export class SuggestAddress {
  id: string;
  address: string;
  rank: number;
}

export class ValidatedAddress {

  validated = false;
  lat: number = null;
  lng: number = null;
  distance: number = null;

  street = '';
  extended  = '';
  locality = '';
  region = '';
  postalCode = '';
  country = '';

  constructor(value: any) {

    this.country = 'Australia';

    if (!value) {
      return;
    }

    if (!value.geometry) {
      return;
    }
    if (!value.geometry.coordinates) {
      return;
    }

    if (!value.geometry.coordinates.length) {
      return;
    }

    if (value.geometry.coordinates.length !== 2) {
      return;
    }

    if (!value.distance) {
      if (value.distance !== 0) {
        return;
      }
    }

    if (!value.properties) {
      return;
    }

    if (!value.properties.street_name) {
      return;
    }

    if (!value.properties.locality_name) {
      return;
    }

    if (!value.properties.postcode) {
      return;
    }

    if (!value.properties.state_territory) {
      return;
    }

    this.lng = value.geometry.coordinates[0];
    this.lat = value.geometry.coordinates[1];
    this.distance = value.distance;

    if (value.properties.complex_unit_identifier && value.properties.complex_level_number) {
      /* tslint:disable-next-line */
      this.extended = `${value.properties.complex_unit_type_description} ${value.properties.complex_unit_identifier} ${value.properties.complex_level_type_description} ${value.properties.complex_level_number}`;
    } else if (value.properties.complex_unit_identifier) {
      this.extended = `${value.properties.complex_unit_type_description} ${value.properties.complex_unit_identifier}`;
    } else if (value.properties.complex_level_number) {
      this.extended = `${value.properties.complex_level_type_description} ${value.properties.complex_level_number}`;
    }

    if (value.properties.street_number_1 &&  value.properties.street_number_2) {
      this.street = `${value.properties.street_number_1}-${value.properties.street_number_2}`;
    } else if (value.properties.street_number_1) {
      this.street = `${value.properties.street_number_1}`;
    }

    this.street = `${this.street} ${value.properties.street_name} ${value.properties.street_type_description}`;

    if (value.properties.street_suffix) {
      this.street = `${this.street} ${value.properties.street_suffix}`;
    }

    this.locality = value.properties.locality_name;
    this.postalCode = value.properties.postcode;
    this.region = value.properties.state_territory;

    this.validated = true;

  }

}

export class MapCoordinate {
  constructor(public lat: number, public lng: number) {
  }

  label = '';

}

export class MapDirection {
  origin: MapCoordinate;
  destination: MapCoordinate;
}

export class MapAddress {
  address: string;
  postalCode?: string;
  place?: string;
  province?: string;
  region?: string;
  country?: string;
}

export class DirectionOptions {

  travelMode: string;
  provideRouteAlternatives: boolean;
  avoidHighways: boolean;
  avoidTolls: boolean;

}

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private httpService: HttpService,
              private http: HttpClient) {

  }

  getSuggestedAddresses(query: string): Observable<Array<SuggestAddress>> {

    if (!query) {
      return of([]);
    }

    return this.httpService.httpPost(`address/search`, encodeURIComponent(query.trim()))
      .pipe(
        map((data) => data.suggest)
      );

  }

  validateAddress(id: string): Observable<ValidatedAddress> {

    if (!id) {
      return of(null);
    }

    return this.httpService.httpGet(`address/validate/${encodeURIComponent(id.trim())}`)
      .pipe(
        map((data) => new ValidatedAddress(data.address))
      );

  }

}
