export interface Message {
  id: number,
  text: string,
  createdAt: string,
  profileId: number,
  receivedMessageId: number,
  sentMessageId: number,
  updatedAt: string,
}