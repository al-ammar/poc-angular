import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableQueryParams, NzTableSize } from 'ng-zorro-antd/table';
import { finalize, Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { SharedService } from 'src/app/services/shared.service';
import { Utils } from 'src/app/utils/ArrayUtils';

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
        })
      ).subscribe({
        next: (result: any) => {
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

  public onDoneCreation(done : boolean) {
    this.displayCreation = false;
    this.displayList = true;
    this.displayActions = true;
  }

  rechercher() {
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
    } else {
       const user :User = new User();
       user.userName = this.searchForm.value.username;
       user.firstName = this.searchForm.value.firstName;
       user.lastName = this.searchForm.value.lastName;
       this.service.searchUsers(user).subscribe({
        next:(result:any) =>{
          this.listOfData = [];
          this.listOfData.push(...result.data!);
          this.total = Utils.size(this.listOfData);
        },
        error:(err: Error) =>{
        }
      });
    }

  }

}

interface Setting {
  bordered: boolean;
  loading: boolean;
  pagination: boolean;
  sizeChanger: boolean;
  title: boolean;
  header: boolean;
  footer: boolean;
  expandable: boolean;
  checkbox: boolean;
  fixHeader: boolean;
  noResult: boolean;
  ellipsis: boolean;
  simple: boolean;
  size: NzTableSize;
  tableScroll: string;
  tableLayout: NzTableLayout;
  position: NzTablePaginationPosition;
  paginationType: NzTablePaginationType;
}