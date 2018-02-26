import { Injectable } from '@angular/core';

import { GlobService } from './glob.service';
import { AngularFireUploadTask, AngularFireStorage } from 'angularfire2/storage';

@Injectable()
export class UploadService {
  progress: number = 0
  
    constructor(private gs: GlobService, private afStorage: AngularFireStorage) {}
  
    pushUpload(file: File) {
      this.progress = 0
      const task: AngularFireUploadTask = this.afStorage.upload(`${this.gs.entityBasePath}/${file.name}`, file);
      task.percentageChanges().subscribe(percentage => this.progress = percentage)
      return task.downloadURL()
    }

    deleteUpload(url) {
      this.afStorage.storage.ref().child(this.getFilePath(url, `${this.gs.entityBasePath}/`)).delete()
      this.afStorage.storage.ref().child(this.getFilePath(url, `${this.gs.entityBasePath}/`)+'_64_thumb.png').delete()
    }

    getThumbUrl(url) {
      this.afStorage.storage.ref().child(this.getFilePath(url, `${this.gs.entityBasePath}/`)+'_64_thumb.png').getDownloadURL()
    }
    
    getFilePath(url, root) {
      let fullPath = decodeURIComponent(url).split('?')[0]
      let pathFromRoot = fullPath.slice(fullPath.indexOf(root))
      return pathFromRoot
    }

  }
