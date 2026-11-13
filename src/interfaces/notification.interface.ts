export interface NotificationUser {
  _id: string;
  name: string;
  photo: string;
}

export interface NotificationEntity {
  _id: string;
  unavailable?: boolean; // البوست اتمسح
  body?: string;
  image?: string;
}

export interface Notification {
  _id: string;
  recipient: NotificationUser;
  actor: NotificationUser;
  type: string;
  entityType: string;
  entityId: string;
  isRead: boolean;
  createdAt: string;
  entity?: NotificationEntity;
}