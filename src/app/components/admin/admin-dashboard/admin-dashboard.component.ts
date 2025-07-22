import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { DashboardStats } from '../../../models/dashboard.model';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
// import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxChartsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStats | null = null;
  isLoading = true;
  errorMessage = '';
  private statsSubscription!: Subscription;

  // Chart data
  materialsStatusChartData: any[] = [];
  categoriesChartData: any[] = [];

  // Chart options
  view: [number, number] = [700, 300];
  colorScheme = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  gradient = false;
  showLegend = false;
  showLabels = true;
  isDoughnut = false;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.statsSubscription = timer(0)
      .pipe(switchMap(() => this.adminService.getDashboardStats()))
      .subscribe({
        next: (stats) => {
          this.stats = stats;
          this.prepareChartData(stats);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading dashboard stats:', error);
          this.errorMessage = 'Failed to load dashboard statistics';
          this.isLoading = false;
        },
      });
  }

  private prepareChartData(stats: DashboardStats): void {
    // Materials status chart data
    this.materialsStatusChartData = [
      {
        name: 'Active',
        value: stats.active_materials || 0
      },
      {
        name: 'Blocked',
        value: stats.blocked_materials || 0
      },
      {
        name: 'Pending',
        value: stats.pending_materials || 0
      }
    ];

    // Categories chart data
    if (stats.materials_by_category) {
      this.categoriesChartData = stats.materials_by_category.map(category => ({
        name: category.category,
        value: category.count
      }));
    }
  }

  ngOnDestroy(): void {
    if (this.statsSubscription) {
      this.statsSubscription.unsubscribe();
    }
  }
}
