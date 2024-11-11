export interface RegisterValues {
  name: string;
  phoneNumber: string;
  password: string;
}

export interface LoginValues {
  name: string;
  phoneNumber: string;
  password: string;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
}