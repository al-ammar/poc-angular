import { Component, Input, OnInit } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observer } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss']
})
export class UploadDocumentComponent implements OnInit {

  @Input()
  public fileList : NzUploadFile[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  beforeUpload = (file: NzUploadFile, fileList: NzUploadFile[]) =>{
    return new Observable((observer: Observer<boolean>) => {
      console.log(file);
      console.log(fileList);
      observer.complete();
      return ;
    });
  }

}
