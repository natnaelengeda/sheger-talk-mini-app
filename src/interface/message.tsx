export interface IMessageData {
  id: string;
  room: string;
  message: string;
  socket_id: string;
  time: string;
}

export interface ITypingData {
  id: string;
  room: string;
  socket_id: string;
  isTyping: boolean;
}