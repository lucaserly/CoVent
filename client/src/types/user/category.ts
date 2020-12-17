export interface Category {
  id: number,
  name: string,
  createdAt: string,
  updatedAt: string,
  categoryProfiles: {
    createdAt: string,
    updatedAt: string,
    categoryId: number,
    profileId: number,
  }
}