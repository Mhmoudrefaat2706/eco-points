import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { User } from '../../../models/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  pagedUsers: User[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  selectedStatus = '';
  selectedRole = ''; // Add this line for role filtering
  sortColumn = 'id';
  sortDirection = 'asc';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalUsers = 0;
  totalPages = 1;

  // Delete modal
  selectedUserId: number | null = null;
  selectedUserName = '';

  @ViewChild('deleteModal') deleteModal!: TemplateRef<any>;
  isDeleting = false;
  statusLoading: { [key: number]: boolean } = {};
  deleteLoading = false;
  Math = Math;
  adminCount = 0;

  constructor(
    private adminService: AdminService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Update the loadUsers method
  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.adminService.getUsers().subscribe({
      next: (response) => {
        this.users = response.users;
        this.adminCount = response.admin_count;
        this.totalUsers = response.users.length;
        this.filterUsers();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage =
          'Failed to load users. ' +
          (error.error?.message || error.message || 'Please try again later.');
        this.isLoading = false;
      },
    });
  }

  // Remove the adminCount check from filterUsers method
  filterUsers(): void {
    let filtered = [...this.users];

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.first_name.toLowerCase().includes(term) ||
          user.last_name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.role.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (this.selectedStatus) {
      filtered = filtered.filter((user) => user.status === this.selectedStatus);
    }

    // Apply role filter
    if (this.selectedRole) {
      filtered = filtered.filter((user) => user.role === this.selectedRole);
    }

    this.filteredUsers = filtered;
    this.totalUsers = filtered.length;
    this.currentPage = 1;
    this.updatePagination();
    this.sortUsers();
  }

  // Update this method
  isOnlyAdmin(user: User): boolean {
    return user.role === 'admin' && this.adminCount <= 1;
  }

  // Add this new method to check if user can be deleted
  canDeleteUser(user: User): boolean {
    // Allow deleting non-admin users
    if (user.role !== 'admin') return true;

    // Only allow deleting admin if there are multiple admins
    return this.adminCount > 1;
  }

  confirmDelete(): void {
    if (!this.selectedUserId) return;

    this.deleteLoading = true;

    this.adminService.deleteUser(this.selectedUserId).subscribe({
      next: () => {
        this.users = this.users.filter(
          (user) => user.id !== this.selectedUserId
        );
        // Decrement admin count if the deleted user was an admin
        const deletedUser = this.users.find(
          (u) => u.id === this.selectedUserId
        );
        if (deletedUser && deletedUser.role === 'admin') {
          this.adminCount--;
        }
        this.filterUsers();
        this.deleteLoading = false;
        this.selectedUserId = null;
        this.modalService.dismissAll();
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        this.errorMessage =
          error.error?.message || 'Failed to delete user. Please try again.';
        this.deleteLoading = false;
      },
    });
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortUsers();
  }

  sortUsers(): void {
    this.filteredUsers.sort((a, b) => {
      const valueA = this.getSortableValue(a, this.sortColumn);
      const valueB = this.getSortableValue(b, this.sortColumn);

      if (valueA === undefined && valueB === undefined) return 0;
      if (valueA === undefined) return this.sortDirection === 'asc' ? 1 : -1;
      if (valueB === undefined) return this.sortDirection === 'asc' ? -1 : 1;

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.pagedUsers = this.filteredUsers.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
  }

  getPageNumbers(): number[] {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(
      1,
      this.currentPage - Math.floor(maxVisiblePages / 2)
    );
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  private getSortableValue(
    user: User,
    column: string
  ): string | number | Date | undefined {
    switch (column) {
      case 'id':
        return user.id;
      case 'first_name':
        return user.first_name?.toLowerCase() || '';
      case 'last_name':
        return user.last_name?.toLowerCase() || '';
      case 'email':
        return user.email?.toLowerCase() || '';
      case 'role':
        return user.role?.toLowerCase() || '';
      case 'status':
        return user.status?.toLowerCase() || '';
      case 'created_at':
        return new Date(user.created_at || '');
      default:
        return undefined;
    }
  }

  getFullName(user: User): string {
    return `${user.first_name} ${user.last_name}`;
  }

  updateUserStatus(userId: number, status: 'active' | 'blocked'): void {
    const user = this.users.find((u) => u.id === userId);
    if (!user) return;

    this.statusLoading[userId] = true;

    const action =
      status === 'active'
        ? this.adminService.unblockUser(userId)
        : this.adminService.blockUser(userId);

    action.subscribe({
      next: () => {
        user.status = status;
        this.filterUsers();
        this.statusLoading[userId] = false;
      },
      error: (error) => {
        console.error('Error updating user status:', error);
        user.status = status === 'active' ? 'blocked' : 'active';
        this.statusLoading[userId] = false;
      },
    });
  }

  openDeleteModal(userId: number, userName: string): void {
    this.selectedUserId = userId;
    this.selectedUserName = userName;
    this.modalService.open(this.deleteModal);
  }
}
