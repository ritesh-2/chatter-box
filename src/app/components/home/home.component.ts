import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, fromEvent, map, merge, of, startWith, switchMap, take, tap } from 'rxjs';
import { ChatConstant } from 'src/app/models/constant';
import { ProfileUser } from 'src/app/models/user-profile';
import { ChatService } from 'src/app/services/chat.service';
import { LoggerService } from 'src/app/services/logger.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';

@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  @ViewChild('endOfChat')
  endOfChat: ElementRef;



  placeHolderImg = ChatConstant.PlaceHolder;

  mobileView: boolean = false;
  user$ = this.userServ.currentUser$;
  searchControl = new FormControl('');
  chatListControl = new FormControl('');
  myChat$ = this.chatServ.myChat$
  oneflag = false;
  constructor(private userServ: UserService, private logger: LoggerService,
    private chatServ: ChatService, private shared: SharedService) { }

  ngOnInit(): void {
    // window.innerWidth < 650 ? this.mobileView = true : this.mobileView= false;
    // console.log("mobile View", this.mobileView)
    // console.log("one Flag",this.oneflag)
    this.chatListControl.valueChanges.pipe(
      map(value => value[0]),
      switchMap(async (chatId) => this.shared.mySubject.next(chatId))
    ).subscribe();
  }

  messages$ = this.chatListControl.valueChanges.pipe(
    map(value => value[0]),
    switchMap(chatId => this.chatServ.getChatMessages$(chatId)),
    tap(() => {
      this.scrollToBottom();
    })
  );

  toggleChatList() {
    this.oneflag = !this.oneflag
    console.log(this.oneflag)
  }
  /**
  @name : HomeComponent.users$
  @description : Property which holds data stream of all users matching with search string excluding logged in user
  @return: void 
  @author : Ritesh
  @modifiedDate : 03/09/2022
  **/
  users$ = combineLatest([this.userServ.allusers$, this.user$, this.searchControl.valueChanges.pipe(startWith(''))]).pipe(
    map(([users, user, searchString]) => users.filter(u => u.displayName.toLowerCase().includes(searchString ? searchString.toLowerCase() : '') && u.email != user.email))
  )

  /**
   @name : HomeComponent.selectedChat$
   @description : Holds Selected Chat
   @return: void 
   @author : Ritesh
   @modifiedDate : 03/09/2022
   **/
  selectedChat$ = combineLatest([
    this.chatListControl.valueChanges,
    this.myChat$
  ]).pipe(
    map(([value, chats]) => chats.find(c => c.id == value[0]))
  )



  /**
  @name : HomeComponent.createChat
  @description : Creates a chat doc in firestore db
  @return: void 
  @author : Ritesh
  @modifiedDate : 03/09/2022
  **/
  createChat(otherUser: ProfileUser) {
    this.chatServ.isExistingChat(otherUser.email).pipe(
      untilDestroyed(this),
      switchMap(chatId => {
        if (chatId) return of(chatId);
        else {
          this.logger.logInfo(this.logger.getLogObject("HomeComponent.createChat", "New Chat created"))
          return this.chatServ.createChat(otherUser)
        }
      })
    ).subscribe()
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.endOfChat) {
        this.endOfChat.nativeElement.scrollIntoView({ behaviour: 'smooth' })
      }
    }, 100)

  }

}
