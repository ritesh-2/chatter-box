import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Form, FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, concatMap, map, Observable, switchMap, take, tap } from 'rxjs';
import { Chat, Message } from 'src/app/models/chat';
import { ChatConstant } from 'src/app/models/constant';
import { ChatService } from 'src/app/services/chat.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';

@UntilDestroy()
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  // templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  @ViewChild('endOfChat')
  endOfChat: ElementRef;

  placeHolderImg = ChatConstant.PlaceHolder;
  messageControl = new FormControl('');
  user$ = this.userServ.currentUser$;
  messages$: Observable<Message[]>
  selectedChat: Chat;
  @Input() selectedChat$: Observable<Chat>


  constructor(private chatServ: ChatService, private userServ: UserService
    , private shared: SharedService) {
   
    // this.messages$ = this.chatServ.getChatMessages$(this.selectedChat.id)
    setTimeout(() => {
      // this.selectedChat$.pipe(untilDestroyed(this)).subscribe({
      //   next: (chat) => {
      //     this.selectedChat = chat;
      //     this.messages$ = this.chatServ.getChatMessages$(chat.id)
      //     this.scrollToBottom();
      //   },
      //   error: (err) => console.log(err)
      // });

      // this.checkTypingStatus();
      this.shared.mySubject.subscribe(
        chatId =>{
         this.messages$ = this.chatServ.getChatMessages$(chatId).pipe(tap(()=>this.scrollToBottom()))
         this.scrollToBottom();
        }
      )
    
    }, 0)

  }

  ngOnInit(): void { }



  /**
   @name : ChatService.checkTypingStatus()
   @description : 
   @return: void 
   @author : Ritesh
   @modifiedDate : 03/09/2022
   **/

  checkTypingStatus() {
    this.messageControl.valueChanges.pipe(
      untilDestroyed(this),
      concatMap((value) => {
        if (value && this.selectedChat) {
          return this.chatServ.udpateTypingStatus(this.selectedChat, true)
        }
        else if (!value) {
          return this.chatServ.udpateTypingStatus(this.selectedChat, false)
        }
        else return "";
      })
    ).subscribe({
      next: res => (console.log(res)),
      error: err => console.log(err)
    })
  }

  /**
   @name : ChatService.sendMessage()
   @description : 
   @return: void 
   @author : Ritesh
   @modifiedDate : 03/09/2022
   **/
  sendMessage(chatId) {
    const message = this.messageControl.value;

    if (message && chatId) {
      this.chatServ.addChatMessages(chatId, message).subscribe(
        () => this.scrollToBottom(),
      );
      this.messageControl.setValue('');
    }
  }

  /**
  @name : ChatService.scrollToBottom()
  @description : 
  @return: void 
  @author : Ritesh
  @modifiedDate : 03/09/2022
  **/
  scrollToBottom() {
    setTimeout(() => {
      if (this.endOfChat) {
        this.endOfChat.nativeElement.scrollIntoView({ behaviour: 'smooth' })
      }
    }, 100)

  }

}
