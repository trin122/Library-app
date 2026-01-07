import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false, // Giữ nguyên theo code của bạn
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  // Đối tượng chứa dữ liệu form
  user = {
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  onRegister() {
    // 1. Kiểm tra mật khẩu khớp nhau
    if (this.user.password !== this.user.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    // 2. Kiểm tra các trường bắt buộc
    if (!this.user.username || !this.user.email || !this.user.password) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // 3. Gửi request đến Backend (đúng route /auth/users/register bạn đã khai báo)
    const apiUrl = 'http://localhost:3000/auth/users/register';
    
    this.http.post(apiUrl, this.user).subscribe({
      next: (res: any) => {
        alert('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
        this.router.navigate(['/']); // Chuyển về trang login (path '')
      },
      error: (err) => {
        alert(err.error?.message || 'Đăng ký thất bại, vui lòng thử lại.');
        console.error('Lỗi đăng ký:', err);
      }
    });
  }
}