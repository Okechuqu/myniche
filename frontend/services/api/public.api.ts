import api from "./client";

export interface SiteConfiguration {
  id: number;
  site_name: string;
  site_description: string;
  favicon_url: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  open_graph_image: string;
  canonical_url: string;
  updated_at: string;
}

export interface SiteContent {
  id: number;
  title: string;
  slug: string;
  content_type: string;
  summary: string;
  body: string;
  payload: Record<string, any>;
  is_published: boolean;
  sort_order: number;
  updated_at: string;
}

export const getSiteConfiguration = async () => {
  const response = await api.get<SiteConfiguration>("/public/config/");
  return response.data;
};

export const getSiteContents = async (params?: {
  type?: string;
  slug?: string;
}) => {
  const queryString = new URLSearchParams();

  if (params?.type) {
    queryString.set("type", params.type);
  }

  if (params?.slug) {
    queryString.set("slug", params.slug);
  }

  const response = await api.get<SiteContent[]>(
    `/public/contents/?${queryString.toString()}`,
  );
  return response.data;
};

export const getSiteContentBySlug = async (slug: string) => {
  const response = await api.get<SiteContent>(`/public/content/${slug}/`);
  return response.data;
};
