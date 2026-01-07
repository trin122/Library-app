import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-members',
  standalone: false,
  templateUrl: './members.html',
  styleUrl: './members.css',
})
export class Members implements OnInit {
  users: any[] = [];
  searchTerm: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<any[]>('http://localhost:3000/users').subscribe({
      next: (data) => (this.users = data),
      error: (err) => console.error('Lỗi tải thành viên:', err)
    });
  }

  // Logic tìm kiếm thành viên
  get filteredUsers() {
    if (!this.searchTerm) return this.users;
    return this.users.filter(u => 
      u.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Hàm xóa thành viên (nếu cần)
  deleteUser(id: number): void {
    Swal.fire({
      title: 'Xác nhận xóa?',
      text: "Dữ liệu thành viên này sẽ mất vĩnh viễn!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Xóa ngay'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:3000/users/${id}`).subscribe(() => {
          Swal.fire('Đã xóa!', 'Thành viên đã bị loại bỏ.', 'success');
          this.loadUsers();
        });
      }
    });
  }
}