type OsmType = 'node' | 'way' | 'relation';
type AddressClass = 'highway' | 'building' | 'place' | string;
type AddressType = 'residential' | 'living_street' | string;

export interface NominatimSearchResult {
  place_id: number;
  licence: string;
  osm_type: OsmType;
  osm_id: number;
  lat: string;
  lon: string;
  class: AddressClass;
  type: AddressType;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: [string, string, string, string];
}
