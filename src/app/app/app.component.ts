import { Component } from '@angular/core';
import { DashboardService } from '../service/dashboard.service';
import { UserService } from '../service/user.service';
import { AuthService } from '../service/auth.service';
import { User } from '../models/User';
import { MsgService } from '../service/msg.service';

interface Dashboard {
  user: DashboardDate[],
  page: DashboardDate[],
  project: DashboardDate[],
}
interface DashboardDate {
  date: string,
  value: number
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private dashboardSrv: DashboardService,
    public userSrv: UserService,
    private authSrv: AuthService,
    public msgSrv: MsgService,
  ) { }

  ngOnInit(): void {
    this.pageViewCount()
  }
  // 记录页面访问记录
  pageViewCount() {
    this.dashboardSrv.addPageView().subscribe()
  }
  // 登出
  handleLogOut() {
    this.userSrv.logout()
  }
}
