import { Component } from '@angular/core';
import { DashboardService } from '../service/dashboard.service';

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
  ) { }

  ngOnInit(): void {
    this.pageViewCount()

  }
  pageViewCount() {
    this.dashboardSrv.addPageView().subscribe()
  }
}
