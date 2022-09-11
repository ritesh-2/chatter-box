import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy,untilDestroyed } from '@ngneat/until-destroy';
import { concatMap } from 'rxjs';
import { ChatConstant } from 'src/app/models/constant';
import { ProfileUser } from 'src/app/models/user-profile';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { LoggerService } from 'src/app/services/logger.service';
import { UserService } from 'src/app/services/user.service';

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user$ = this.userService.currentUser$;
  placeHolderImg =  ChatConstant.PlaceHolder;

  constructor(private userService: UserService, private toast: HotToastService,
    private logger: LoggerService, private fileServ: FileUploadService , private router:Router) { }

  ngOnInit(): void {

    this.userService.currentUser$.pipe(
      untilDestroyed(this)
    ).subscribe((user) => {
      this.profileForm.patchValue({ ...user });
    })

  }


  profileForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    displayName: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
  })

  get displayName() {
    return this.profileForm.get('displayName');
  }
  get firstName() {
    return this.profileForm.get('firstName');
  }
  get lastName() {
    return this.profileForm.get('lastName');
  }
  get phone() {
    return this.profileForm.get('phone');
  }
  get address() {
    return this.profileForm.get('address');
  }

  /**
  @name : ProfileComponent.saveChanges()
  @description : Updates and saves user data in fire store
  @return: void
  @author : Ritesh
  @modifiedDate : 03/09/2022
  **/

  saveChanges() {
    try{
      const profileData = this.profileForm.value;
      this.userService.updateUser(profileData).pipe(
        untilDestroyed(this),
        this.toast.observe({
          loading: 'updating Data',
          success: 'Data has been Updated',
          error: 'There was some error in updating the data'
        })
      ).subscribe({
        next: (res) => { this.logger.logInfo(this.logger.getLogObject("ProfileComponent.saveChanges()", "User details updated successfully :")) },
        error: (err) => this.logger.logError(this.logger.getLogObject("ProfileComponent.saveChanges()", "Error occured while updating user data :", err)),
        complete: () => this.logger.logInfo(this.logger.getLogObject("ProfileComponent.saveChanges()", "update user subs completed"))
      });
    }catch(err){
      (err) => this.logger.logError(this.logger.getLogObject("ProfileComponent.saveChanges()", "Error occured while updating user data :", err))
    }
    
  }

   /**
  @name : ProfileComponent.uploadImage()
  @description : Uploads and saves user image in fire storage
  @return: void
  @author : Ritesh
  @modifiedDate : 03/09/2022
  **/
  uploadImage(event: any, user: ProfileUser) {
    try{
      this.fileServ.uploadFile(event.target.files[0], `images/profile/${user.email}`).pipe(
        untilDestroyed(this),
        this.toast.observe({
          loading: 'Uploading Image',
          success: 'Image uploaded',
          error: 'There was an error in uploading'
        }),
        concatMap((photoURL) => this.userService.updateUser({ email: user.email, photoURL }))
      ).subscribe({
        next: (res) => { this.logger.logInfo(this.logger.getLogObject("ProfileComponent.uploadImage", "Image upladed success fully at location :")); this.router.navigate(['/home']) },
        error: (err) => this.logger.logError(this.logger.getLogObject("ProfileComponent.uploadImage", "Error occured in uploaing image :", err)),
        complete: () => this.logger.logInfo(this.logger.getLogObject("ProfileComponent.uploadImage", "uplad Image Subscription completed"))
      });
    }catch(err){
      this.logger.logError(this.logger.getLogObject("ProfileComponent.uploadImage", "Error occured in uploaing image :", err))
    }
   

  }

}
