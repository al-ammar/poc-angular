import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  isCollapsed = false;
  constructor(private auth :AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  logout(){
    localStorage.removeItem('isAuth');
    this.auth.canUserAccess(false);
    this.router.navigate(['./login']).then();
  }

}
