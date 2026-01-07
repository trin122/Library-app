import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Thêm CommonModule để dùng if/else nếu cần

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, HttpClientModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  username: string = '';
  password: string = '';
  errorMsg: string = '';
  showPassword: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login(event: Event): void {
    event.preventDefault();

    if (!this.username || !this.password) {
      this.errorMsg = 'Vui lòng nhập đầy đủ thông tin';
      return;
    }

    const api = 'http://localhost:3000/auth/users/login';

    this.http.post<any>(api, { username: this.username, password: this.password })
      .subscribe({
        next: (res) => {
          // 1. Lưu Token để xác thực
          localStorage.setItem('token', res.token);
          
          // 2. Lưu userId để trang Profile có thể lấy dữ liệu (Rất quan trọng)
          // Hãy đảm bảo Backend trả về trường "id" trong JSON
          localStorage.setItem('userId', res.id); 

          // 3. Điều hướng dựa trên role
          if (res.role === 0) {

            this.router.navigate(['/admin']);
          } else if (res.role === 1) {
            // Kiểm tra chính xác path trong App Routing của bạn nhé
            this.router.navigate(['/users', res.id]);
           // this.router.navigate(['/users']); 
          } else {
            this.errorMsg = 'Tài khoản chưa được phân quyền';
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          this.errorMsg = err.error?.message || 'Tên đăng nhập hoặc mật khẩu sai';
        }
      });
  }
}