import { Timestamp } from "@angular/fire/firestore";

export interface chattingUser {
   
    isTyping?: boolean;

}

export class Chat {
    id: string;
    lastMessage?: string;
    lastMessageDate?: Date & Timestamp;
    userIds: string[];
    users: any[];
    //Not Stored only for display
    chatPic?: string;
    chatName?: string;
    isOnline?: boolean;
    isTyping?:boolean;
}

export interface Message {
    text: string;
    senderId: string;
    sendDate: Date & Timestamp;
}