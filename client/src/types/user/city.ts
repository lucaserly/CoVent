export interface City {
  id: string,
  name: string,
  createdAt: string,
  updatedAt: string,
  cityProfiles: {
    createdAt: string,
    updatedAt: string,
    cityId: number,
    profileId: number
  }
}