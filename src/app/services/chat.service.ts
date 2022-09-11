import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, orderBy, query, Timestamp, updateDoc, where } from '@angular/fire/firestore';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { concatMap, filter, from, map, Observable, of, take } from 'rxjs';
import { Chat, Message } from '../models/chat';
import { ProfileUser } from '../models/user-profile';
import { LoggerService } from './logger.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})

@UntilDestroy()
export class ChatService {

  constructor(private userServ: UserService, private fireStore: Firestore,
    private logger: LoggerService) { }


  /**
   @name : ChatService.createChat()
   @description : Property which holds data stream of all users matching with search string excluding logged in user
   @return: void 
   @author : Ritesh
   @modifiedDate : 03/09/2022
   **/
  createChat(otherUser: ProfileUser): Observable<string> {

    const ref = collection(this.fireStore, 'chats')
    return this.userServ.currentUser$.pipe(
      take(1),
      concatMap(user => addDoc(ref, {
        userIds: [user?.email, otherUser?.email],
        users: [{},
        {}]
      })),
      map(ref => ref.id)
    )
  }

  /**
   @name : ChatService.myChat$
   @description : Property which holds data stream of all users matching with search string excluding logged in user
   @return: void 
   @author : Ritesh
   @modifiedDate : 03/09/2022
   **/
  get myChat$(): Observable<Chat[]> {
    const ref = collection(this.fireStore, 'chats');
    return this.userServ.currentUser$.pipe(
      concatMap((user) => {
        //This query will return current chat of user
        const myQuery = query(ref, where('userIds', 'array-contains', user?.email))
        return collectionData(myQuery, { idField: 'id' })
          .pipe(
            map(chats => this.addOtherChatData(user?.email, chats as Chat[])),
          )
      })
    )
  }

  /**
 @name : ChatService.isExistingChat
 @description : Property which holds data stream of all users matching with search string excluding logged in user
 @return: void 
 @author : Ritesh
 @modifiedDate : 03/09/2022
 **/
  isExistingChat(otherUserEmailId: string): Observable<string | null> {
    return this.myChat$.pipe(
      take(1),
      map(
        chats => {
          for (let i = 0; i < chats.length; i++) {
            if (chats[i].userIds.includes(otherUserEmailId)) {
              return chats[i].id;
            }
          }
          //if no chat with same id found then returns null
          return null;
        }
      )
    )
  }

  /**
   @name : ChatService.addOtherChatData
   @description : Property which holds data stream of all users matching with search string excluding logged in user
   @return: void 
   @author : Ritesh
   @modifiedDate : 03/09/2022
   **/
  addOtherChatData(currentUserId: string, chats: Chat[]): Chat[] {
    chats.forEach(chat => {
      const otherIndex = chat.userIds.indexOf(currentUserId) === 0 ? 1 : 0;
      const otherUserEmailId = chat.userIds[otherIndex];
      const { isTyping } = chat.users[otherIndex];
      chat.isTyping = isTyping
      this.userServ.allusers$.pipe(
        untilDestroyed(this),
        map(users => users.filter(u => u.email.toLowerCase() === otherUserEmailId.toLowerCase()))).subscribe(
        {
          next: (res) => {
            const { displayName, photoURL, isOnline } = res[0]
            chat.chatName = displayName;
            chat.chatPic = photoURL;
            chat.isOnline = isOnline;
          },
          error: (err) => this.logger.logError(this.logger.getLogObject("ChatService.addOtherChatData()", "Error occured in while fetching other caht info for, ")),
          complete: () => console.log("Completed chat info subs")
        }
      )
    })

    return chats
  }

  /**
    @name : ChatService.addChatMessages()
    @description : 
    @return: void 
    @author : Ritesh
    @modifiedDate : 03/09/2022
    **/
  addChatMessages(chatId: string, message: string): Observable<any> {
    const ref = collection(this.fireStore, 'chats', chatId, 'messages');
    const chatRef = doc(this.fireStore, 'chats', chatId);
    const today = Timestamp.fromDate(new Date());
    return this.userServ.currentUser$.pipe(
      take(1),
      concatMap((user) => addDoc(ref, {
        text: message,
        senderId: user?.email,
        sendDate: today
      })),
      //after sending message last message date and last message is also updated in chatref doc
      concatMap(() => updateDoc(chatRef, { lastMessage: message, lastMessageDate: today }))
    )
  }

  /**
     @name : ChatService.getChatMessages$
     @description : 
     @return: void 
     @author : Ritesh
     @modifiedDate : 03/09/2022
     **/
  getChatMessages$(chatId: any): Observable<Message[]> {
    const ref = collection(this.fireStore, 'chats', chatId, 'messages');
    const querAll = query(ref, orderBy('sendDate', 'asc'));
    return collectionData(querAll) as Observable<Message[]>
  }

  /**
   @name : ChatService.udpateTypingStatus
   @description : 
   @return: void 
   @author : Ritesh
   @modifiedDate : 03/09/2022
   **/
  udpateTypingStatus(chat: Chat, status: boolean) {
    const chatRef = doc(this.fireStore, 'chats', chat.id);
    return this.userServ.currentUser$.pipe(
      take(1),
      concatMap((user) => {
        const currentUserIndex = chat.userIds.indexOf(user.email) === 0 ? 0 : 1;
        
        if ( status && chat.users[currentUserIndex].isTyping ) return of(null);
        else if(status && !chat.users[currentUserIndex].isTyping){ chat.users[currentUserIndex].isTyping = status;  return from(updateDoc(chatRef, { users: chat.users }))} 
        else if(!status && chat.users[currentUserIndex].isTyping) { chat.users[currentUserIndex].isTyping = status;  return from(updateDoc(chatRef, { users: chat.users }))}
        else  return of(null) 
      })
    )
  }

}
