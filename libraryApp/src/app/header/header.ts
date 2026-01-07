import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  
  constructor(private router: Router) {}

  onLogout() {
    // 1. Xóa Token hoặc thông tin người dùng trong LocalStorage/SessionStorage
    localStorage.removeItem('token'); 
    localStorage.removeItem('userRole'); // Nếu bạn có lưu role
localStorage.clear(); 
    // 2. Thông báo (Tùy chọn)
    alert('Bạn đã đăng xuất thành công!');

    // 3. Chuyển hướng về trang đăng nhập (login)
    this.router.navigate(['']);
  }
}