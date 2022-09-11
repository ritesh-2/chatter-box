import { Injectable } from '@angular/core';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { uploadBytes } from '@firebase/storage';
import { from, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private fireStorage: Storage) { }


  uploadFile(file: any, path: string) {

    const storageRef = ref(this.fireStorage, path);
    const uploadTask = from(uploadBytes(storageRef, file));
    return uploadTask.pipe(
      switchMap((result) => getDownloadURL(result.ref))
    )
  }
}

