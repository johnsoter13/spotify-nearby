export type MeResponse = {
  id: string;
  display_name: string;
  email?: string;
  images: Array<{
    height: number,
    url: string;
    width: number;
  }>
};
