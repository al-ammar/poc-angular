import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableQueryParams, NzTableSize } from 'ng-zorro-antd/table';
import { finalize, Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { SharedService } from 'src/app/services/shared.service';
import { ArrayUtils } from 'src/app/utils/ArrayUtils';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  pageSize = 10;
  pageIndex = 1;
  total = 1;
  settingForm?: UntypedFormGroup;
  listOfData:  User[] = [];
  displayData:  User[] = [];
  allChecked = false;
  indeterminate = false;
  fixedColumn = false;
  scrollX: string | null = null;
  scrollY: string | null = null;
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

  getUsers():  void {
    const data : User[] = [];
    this.settingValue.loading = true;
    this.service.getUsers()
    .pipe(
      finalize(() => {
        this.settingValue.loading = false;
        console.log('done getusers');
      })
    ).subscribe({
      next : (result : any)=>{
        this.listOfData.push(...result.data!.content!);
        this.total = 100;
      }
     })
  }

  updateUser(index: any){
    console.log(index);
  }

  deleteUser(index: string) : void{
    this.settingValue.loading = true;
    this.service.deleteUser(index)
    .pipe(
      finalize(() => {
        this.settingValue.loading = false;
        console.log('done delete');
      })
    )
    .subscribe({
      next: (res: any)=> { 
        const tmp = this.listOfData;
        ArrayUtils.remove(tmp, (p : User)=> p.id === index);
        // this.listOfData.splice(this.listOfData.findIndex(f => f.id === index), 1);
        this.listOfData = tmp;
        this.total = 100;
      }
    }
    );
  }


  

  constructor(
    private formBuilder: UntypedFormBuilder, 
    private service: SharedService) {}
  
    ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    // this.subs.add(
    //   this.service.getUsers().subscribe(
    //     (result : any)=>{
    //       const tmp : User[] = [];
    //       tmp.push(...result.data!.content!);
    //       console.log('chargement'+tmp);
    //       this.displayData = tmp;
    //     }
    //   )
    // )
    this.settingForm = this.formBuilder.group({
      bordered: false,
      loading: true,
      pagination: false,
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
    this.settingValue.loading = true;
    // this.listOfData = 
    this.getUsers();
    this.settingValue.loading = false;
    this.settingValue.noResult = false;
  }


  onQueryParamsChange(params: NzTableQueryParams): void {
    console.log(params);
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
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
