import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit {
  member: any = {
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  };

  userId: string | null = null;
  apiUrl = 'http://localhost:3000/users';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute ,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 3. Lấy ID từ URL (ví dụ: users/5 -> lấy được số 5)
    this.userId = this.route.snapshot.paramMap.get('id');
    
    // Nếu không thấy ID trên URL, mới lấy từ localStorage làm dự phòng
    if (!this.userId) {
      this.userId = localStorage.getItem('userId');
    }

    if (this.userId) {
      this.getProfile();
    } else {
      alert('Không xác định được ID người dùng!');
    }
  }

  getProfile(): void {
    this.http.get(`${this.apiUrl}/${this.userId}`).subscribe({
      next: (res: any) => {
        this.member = { ...res, password: '', confirmPassword: '' };
      },
      error: (err) => {
        console.error('Lỗi tải thông tin:', err);
        alert('Không thể tải thông tin cá nhân');
      }
    });
  }

  saveChanges(): void {
  // Tạo bản sao dữ liệu để gửi đi
  const updateData = {
    username: this.member.username,
    phone: this.member.phone,
    password: this.member.password // Sẽ gửi chuỗi trống nếu không nhập
  };

  if (this.member.password || this.member.confirmPassword) {
    if (this.member.password !== this.member.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
  }

  this.http.put(`${this.apiUrl}/${this.userId}`, updateData).subscribe({
    next: (res: any) => {
      alert('Cập nhật thông tin thành công!');
      this.member.password = '';
      this.member.confirmPassword = '';
      this.getProfile(); 
    },
    error: (err) => {
      alert(err.error?.message || 'Có lỗi xảy ra khi cập nhật');
    }
  });
}
  borrowedBooks: any[] = [];

// Gọi hàm này trong ngOnInit
getUserBorrows(): void {
  this.http.get(`http://localhost:3000/borrows/user/${this.userId}`).subscribe((res: any) => {
    this.borrowedBooks = res;
  });
}

handleReturn(borrowId: number): void {
  if (confirm('Bạn muốn trả cuốn sách này?')) {
    this.http.put(`http://localhost:3000/borrows/return/${borrowId}`, {}).subscribe({
      next: () => {
        alert('Trả sách thành công');
        this.getUserBorrows(); // Tải lại danh sách
      }
    });
  }
}
onLogout(): void {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      localStorage.clear(); // Xóa token, userId, role...
      this.router.navigate(['/'], { replaceUrl: true }); // Về trang login và xóa lịch sử back
    }
  }
}