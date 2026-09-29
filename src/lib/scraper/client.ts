import { ApiCustomer, ApiCategory, ExhibitorPage } from "./types";

const GRAPHQL_URL = "https://mmiconnect.in/graphql";
export const GROUP = "ep-blr-2026";
export const PAGE_SIZE = 100;

const QUERY = `
query getExhibitorListForGroup(
  $where: [WhereExpression!], $first: Int, $after: Int, $categoryIds: [Int],
  $keyword: String, $group: String, $categoryGroup: String, $categoryWhere: [WhereExpression!]
) {
  catalogueQueries {
    exhibitorsWithWishListGroup(
      first: $first, where: $where, after: $after,
      categoryIds: $categoryIds, keyword: $keyword, group: $group
    ) {
      totalCount
      exhibitors {
        customer {
          id companyName country squareLogo userId showId
          exhibitorDetail { exhibitorType sponsorship boothNo hallNo }
          show { showName startDate endDate }
        }
      }
    }
    selectedCustomerCategories(where: $categoryWhere, group: $categoryGroup) {
      categoryType productCategoryType mainCategory categoryName id
    }
  }
}`;

interface RawResponse {
  data?: {
    catalogueQueries: {
      exhibitorsWithWishListGroup: {
        totalCount: number;
        exhibitors: { customer: ApiCustomer }[];
      };
      selectedCustomerCategories: ApiCategory[];
    };
  };
  errors?: { message: string }[];
}

export async function fetchExhibitorPage(
  after: number,
  categoryIds?: number[],
): Promise<ExhibitorPage> {
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://mmiconnect.in",
    },
    body: JSON.stringify({
      operationName: "getExhibitorListForGroup",
      variables: {
        where: [],
        categoryWhere: [
          { comparison: "equal", path: "categoryType", value: ["EXHIBITOR"] },
        ],
        group: GROUP,
        categoryGroup: GROUP,
        first: PAGE_SIZE,
        after,
        ...(categoryIds ? { categoryIds } : {}),
      },
      query: QUERY,
    }),
  });

  if (!response.ok) {
    throw new Error(`MMI API returned HTTP ${response.status}`);
  }

  const json = (await response.json()) as RawResponse;

  if (json.errors?.length || !json.data) {
    throw new Error(`MMI API error: ${json.errors?.[0]?.message ?? "no data"}`);
  }

  const { exhibitorsWithWishListGroup, selectedCustomerCategories } =
    json.data.catalogueQueries;

  return {
    totalCount: exhibitorsWithWishListGroup.totalCount,
    customers: exhibitorsWithWishListGroup.exhibitors.map((e) => e.customer),
    categories: selectedCustomerCategories,
  };
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
