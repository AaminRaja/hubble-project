export interface ApiShow {
  showName: string;
  startDate: string;
  endDate: string;
}

export interface ApiExhibitorDetail {
  exhibitorType: string | null;
  sponsorship: string | null;
  boothNo: string | null;
  hallNo: string | null;
}

export interface ApiCustomer {
  id: number;
  companyName: string;
  country: string | null;
  squareLogo: string | null;
  userId: string;
  showId: number;
  exhibitorDetail: ApiExhibitorDetail | null;
  show: ApiShow | null;
}

export interface ApiCategory {
  id: number;
  mainCategory: string;
  categoryType: string;
  productCategoryType: string;
}

export interface ExhibitorPage {
  totalCount: number;
  customers: ApiCustomer[];
  categories: ApiCategory[];
}
