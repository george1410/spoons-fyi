import axios from 'axios';
import { MenuResponse, VenueResponse } from './types';

export const getPubs = async () => {
  const {
    data: { venues },
  } = await axios.get<VenueResponse>(
    'https://static.wsstack.nn4maws.net/v1/venues/en_gb/venues.json'
  );

  return venues;
};

export const getMenus = async (pubId: string) => {
  const {
    data: { menus },
  } = await axios.get<MenuResponse>(
    `https://static.wsstack.nn4maws.net/content/v8/menus/${pubId}.json`
  );

  return menus;
};
