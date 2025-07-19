import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { DashboardStats } from '../../../models/dashboard.model';
import {
  Chart,
  ChartConfiguration,
  ChartData,
  ChartOptions,
  registerables,
} from 'chart.js';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RouterModule } from '@angular/router';

// Update your chart data interfaces
interface MaterialsChartData extends ChartData<'doughnut'> {
  labels: ['Active', 'Blocked', 'Pending'];
  datasets: [
    {
      data: number[];
      backgroundColor: string[];
    }
  ];
}

interface CategoriesChartData extends ChartData<'pie'> {
  labels: string[];
  datasets: [
    {
      data: number[];
      backgroundColor: string[];
    }
  ];
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStats | null = null;
  isLoading = true;
  errorMessage = '';
  private statsSubscription!: Subscription;

  @ViewChild('materialsChart') materialsChartRef!: ElementRef;
  @ViewChild('categoriesChart') categoriesChartRef!: ElementRef;
  materialsChart: Chart | null = null;
  categoriesChart: Chart | null = null;
  private loadTimeout: any;

  // Update chart declarations
  materialsChartData: MaterialsChartData = {
    labels: ['Active', 'Blocked', 'Pending'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#4CAF50', '#F44336', '#FFC107'],
      },
    ],
  };

  categoriesChartData: CategoriesChartData = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  };

  constructor(private adminService: AdminService) {}

  loadDashboardStats(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Set a timeout (e.g., 10 seconds)
    this.loadTimeout = setTimeout(() => {
      if (this.isLoading) {
        this.errorMessage =
          'Request is taking longer than expected. Please try again.';
        this.isLoading = false;
      }
    }, 10000);

    this.adminService.getDashboardStats().subscribe({
      next: (stats) => {
        clearTimeout(this.loadTimeout);
        this.stats = stats;
        this.updateChartsData(stats);
        this.createCharts();
        this.isLoading = false;
      },
      error: (error) => {
        clearTimeout(this.loadTimeout);
        console.error('Error loading dashboard stats:', error);
        this.errorMessage = 'Failed to load dashboard statistics';
        this.isLoading = false;
      },
    });
  }

  ngOnDestroy(): void {
    if (this.loadTimeout) {
      clearTimeout(this.loadTimeout);
    }
    this.destroyCharts();
  }

  ngOnInit(): void {
    // Add a small delay to allow view initialization
    this.statsSubscription = timer(0)
      .pipe(switchMap(() => this.adminService.getDashboardStats()))
      .subscribe({
        next: (stats) => {
          this.stats = stats;
          this.updateChartsData(stats);
          this.createCharts();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading dashboard stats:', error);
          this.errorMessage = 'Failed to load dashboard statistics';
          this.isLoading = false;
        },
      });
  }

  private updateChartsData(stats: DashboardStats): void {
    // Materials status chart
    this.materialsChartData.datasets[0].data = [
      stats.active_materials,
      stats.blocked_materials,
      stats.pending_materials || 0,
    ];

    // Categories distribution chart
    if (stats.materials_by_category) {
      this.categoriesChartData.labels = stats.materials_by_category.map(
        (c) => c.category
      );
      this.categoriesChartData.datasets[0].data =
        stats.materials_by_category.map((c) => c.count);
      this.categoriesChartData.datasets[0].backgroundColor =
        this.generateColors(stats.materials_by_category.length);
    }
  }

  private createCharts(): void {
    this.destroyCharts();

    // Ensure Chart.js is properly registered
    if (!Chart || !Chart.register) {
      console.error('Chart.js not properly initialized');
      return;
    }

    const commonOptions: ChartOptions<'doughnut' | 'pie'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    };

    // Materials Chart (Doughnut)
    if (this.materialsChartRef?.nativeElement) {
      const ctx = this.materialsChartRef.nativeElement.getContext('2d');
      if (ctx) {
        this.materialsChart = new Chart(ctx, {
          type: 'doughnut',
          data: this.materialsChartData,
          options: commonOptions,
        });
      }
    }

    // Categories Chart (Pie)
    if (
      this.categoriesChartRef?.nativeElement &&
      this.categoriesChartData.labels.length
    ) {
      const ctx = this.categoriesChartRef.nativeElement.getContext('2d');
      if (ctx) {
        this.categoriesChart = new Chart(ctx, {
          type: 'pie',
          data: this.categoriesChartData,
          options: commonOptions,
        });
      }
    }
  }

  private destroyCharts(): void {
    if (this.materialsChart) {
      this.materialsChart.destroy();
      this.materialsChart = null;
    }
    if (this.categoriesChart) {
      this.categoriesChart.destroy();
      this.categoriesChart = null;
    }
  }

  private generateColors(count: number): string[] {
    const colors = [];
    const hueStep = 360 / count;
    for (let i = 0; i < count; i++) {
      colors.push(`hsl(${i * hueStep}, 70%, 60%)`);
    }
    return colors;
  }
}
