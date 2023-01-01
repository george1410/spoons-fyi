type Currency = 'GBP';
type Venue = {
  name: string;
  sortName: string;
  iOrderId: number;
  venueId: number;
  salesAreaId: string;
  topGroup: string;
  topGroupSortId: number;
  subGroup: string;
  isPubInHotel: boolean;
  isAirport: false;
  currency: Currency;
  venueCanOrder: boolean;
  canPlaceOrder: boolean;
  long: number;
  lat: number;
  country: string;
  town: string;
  postcode: string;
  line1: string;
  line2: string;
  county: string;
  pubIsClosed: boolean;
  pubIsTempClosed: boolean;
  comingSoon: boolean;
  menuLocation: string;
  hotelBookingUrl: string;
  testAndTraceEnabled: boolean;
  airshipId: string;
  iZettleEnabled: boolean;
  numOfCashBelts: number;
  sumUpEnabled: boolean;
  statusMessage: string;
  iadPricing: number;
  displayPopUp: boolean;
};

export type VenueResponse = {
  venues: Venue[];
};

type Portion = {
  name: string;
  price: number;
};

type Product = {
  displayName: string;
  description: string;
  priceValue: number;
  portions?: Portion[];
  defaultPortionName?: string;
};

type ProductGroup = {
  groupHeader: string;
  products: Product[];
};

interface SubMenu {
  headerText: string;
  productGroups: ProductGroup[];
}

interface Menu {
  name: string;
  subMenu: SubMenu[];
}

export type MenuResponse = {
  menus: Menu[];
};
