
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableQueryParams, NzTableSize } from 'ng-zorro-antd/table';
import { catchError, finalize, map, Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserCriteria } from 'src/app/models/UserCriteria';
import { SharedService } from 'src/app/services/shared.service';
import { Utils } from 'src/app/utils/ArrayUtils';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { Setting } from 'src/app/models/settings';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as FileSaver from 'file-saver';
import { DomSanitizer } from '@angular/platform-browser';
import { FileUtils } from 'src/app/utils/FileUtils';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  public user?: User;
  panel = 'Actions';
  panelRecherche = 'Recherche personnalisée';
  public searchForm!: UntypedFormGroup;
  displayList = true;
  displayActions = true;
  displayCreation = false;
  displayUpdate = false;
  pageSize = 10;
  pageIndex = 1;
  total = 20;
  settingForm?: UntypedFormGroup;
  listOfData: User[] = [];
  displayData: User[] = [];
  allChecked = false;
  indeterminate = false;
  fixedColumn = false;
  settingValue!: Setting;

  private subs: Subscription = new Subscription();



  currentPageDataChange($event: User[]): void {
    this.displayData = $event;
    this.refreshStatus();
  }

  refreshStatus(): void {
    const validData = this.displayData.filter(value => !value.disabled);
    const allChecked = validData.length > 0 && validData.every(value => value.checked === true);
    const allUnChecked = validData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnChecked;
  }

  checkAll(value: boolean): void {
    this.displayData.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
  }

  getUsers(pageIndex: number, pageSize: number, sortField: string | null, sortOrder: string | null): void {
    const data: User[] = [];
    this.settingValue.loading = true;
    this.service.getUsers(pageIndex - 1, pageSize, sortField, sortOrder)
      .pipe(
        finalize(() => {
          this.settingValue.loading = false;
          this.settingValue.noResult = false;
        }),
        catchError((error: Error) => {
          this.notification.error("Erreur lors de la recherche utilisateurs", error.message);
          throw error;
        })
      ).subscribe({
        next: (result: any) => {
          console.log(result);
          this.listOfData = [];
          this.listOfData.push(...result.data!.content!);
          this.total = result.data!.totalElements!;
        }
      })
  }

  updateUser(userToUpdate: User) {
    this.user = userToUpdate;
    this.displayList = false;
    this.displayActions = false;
    this.displayUpdate = true;
  }

  onDoneUpdate(done: boolean) {
    this.displayList = true;
    this.displayActions = true;
    this.displayUpdate = false;
    this.user = new User();
  }

  deleteUser(index: string): void {
    this.settingValue.loading = true;
    this.service.deleteUser(index)
      .pipe(
        finalize(() => {
          this.settingValue.loading = false;
          this.settingValue.noResult = false;
        })
      )
      .subscribe({
        next: (res: any) => {
          const tmp = this.listOfData;
          Utils.remove(tmp, (p: User) => p.id === index);
          // this.listOfData.splice(this.listOfData.findIndex(f => f.id === index), 1);
          this.listOfData = tmp;
          this.total = this.total - 1;
        }
      }
      );
  }




  constructor(
    private sanitizer: DomSanitizer,
    private notification: NzNotificationService ,
    private formBuilder: UntypedFormBuilder,
    private service: SharedService, private router: Router) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.settingForm = this.formBuilder.group({
      bordered: false,
      loading: true,
      pagination: true,
      sizeChanger: true,
      title: true,
      header: true,
      footer: true,
      expandable: false,
      checkbox: true,
      fixHeader: true,
      noResult: true,
      ellipsis: false,
      simple: false,
      size: 'small',
      paginationType: 'default',
      tableScroll: 'unset',
      tableLayout: 'auto',
      position: 'bottom'
    });
    this.settingValue = this.settingForm.value;
    this.settingForm.valueChanges.subscribe(value => (this.settingValue = value));

    this.searchForm = this.formBuilder.group({
      lastName: [],
      firstName: [],
      username: [],
      creationDateDebut: [],
      creationDateFin: [],
      updateDateDebut: [],
      updateDateFin: []
    });
  }


  onQueryParamsChange(params: NzTableQueryParams): void {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.getUsers(this.pageIndex, this.pageSize, null, null);
  }


  public initCreation(): void {
    this.displayCreation = true;
    this.displayList = false;
    this.displayActions = false;

   }

  public downloadFile(id: string){
    let u = this.listOfData.find(data => data!.id! === id);
    // const file = new Blob([u!.content], {type: 'image/png;base64'});
    // const file = new Blob([u!.content]);
    // FileSaver.saveAs(file, "file.png");
    
    // bf : Buffer = Buffer.from(u!.content, 'base64');
    // console.log(atob(u!.content));
    // console.log(btoa(u!.content));

    // let reader = new FileReader();
        // a.download = 'filekk.jpeg';
        // const STRING_CHAR = u!.content.reduce((data : any, byte : any) => {
        //   return data + String.fromCharCode(byte);
        //   }, '');
    // reader.readAsBinaryString(blob); // converts the blob to base64 and calls onload
    // let link = document.createElement('a');
    // link.download = 'filekk.jpeg';
    // reader.onload = function() {
    // link.href = reader.result!.toString(); // data url
    // link.click();
    
    // };

    // let a = document.createElement('a');
    // a.href = URL.createObjectURL(blob);
    // a.download = 'filekk.jpeg';
    // a.click();
    // a.remove();
    let file = new Blob([u!.content!], { type: 'image/jpeg' });            
    FileSaver.saveAs(FileUtils.base64ToBlob(u!.content), 'download.png');
  
  }

  getBase64(data: Blob): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsBinaryString(new Blob([data]));
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  public onDoneCreation(done: boolean) {
    this.displayCreation = false;
    this.displayList = true;
    this.displayActions = true;
  }

  rechercher() {
    this.settingValue.loading = true;
    const userName = this.searchForm.value.username;
    const firstName = this.searchForm.value.firstName;
    const lastName = this.searchForm.value.lastName;
    const password = this.searchForm.value.password;
    const creationDateDebut = this.searchForm.value.creationDateDebut;
    const creationDateFin = this.searchForm.value.creationDateFin;
    const updateDateDebut = this.searchForm.value.updateDateDebut;
    const updateDateFin = this.searchForm.value.updateDateFin;
    if (Utils.isEmpty(userName) &&
      Utils.isEmpty(firstName) &&
      Utils.isEmpty(lastName) &&
      Utils.isEmpty(creationDateDebut) &&
      Utils.isEmpty(creationDateFin) && Utils.isEmpty(updateDateDebut) && Utils.isEmpty(updateDateFin)) {
      Object.values(this.searchForm.controls).forEach(control => {
        if (control!.invalid) {
          control!.markAsDirty();
          control!.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.settingValue.loading = false;
    } else {
      const user: UserCriteria = new UserCriteria();
      user.userName = this.searchForm.value.username;
      user.firstName = this.searchForm.value.firstName;
      user.lastName = this.searchForm.value.lastName;
      user.creationDateDebut = this.searchForm.value.creationDateDebut;
      user.creationDateFin = this.searchForm.value.creationDateFin;
      this.service.searchUsers(user)
      .pipe(map((value: any)=> {
        value.data.map((d: User) => {
        d.url = 'z';
        return d;
        });
        return value;
      }))
      .subscribe({
        next: (result: any) => {
          this.listOfData = [];
          this.listOfData.push(...result.data!);
          this.total = Utils.size(this.listOfData);
        },
        error: (err: Error) => {
        },
        complete: () => {
          this.settingValue.loading = false;
        }
      });
    }
  }

  public exportCSV() {
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Liste des utilisateurs',
      useBom: true,
      noDownload: true,
      headers: ["ID", "Username", "Lastname", "Firstname"],
      useHeader: false,
      nullToEmptyString: true,
    };

    return new AngularCsv(this.listOfData, 'export_csv', options);
  }
}

