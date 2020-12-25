export interface Category {
  id: number | undefined,
  name: string,
  createdAt: string,
  updatedAt: string,
  categoryProfiles: {
    createdAt: string,
    updatedAt: string,
    categoryId: number | undefined,
    profileId: number | undefined,
  }
}