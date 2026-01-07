import { Component, afterNextRender } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-borrow-list',
  standalone: false,
  templateUrl: './user-borrow-list.html',
  styleUrl: './user-borrow-list.css',
})
export class UserBorrowList {
  allBooks: any[] = [];         
  borrowedBooks: any[] = [];    
  userId: string | null = null;
  itemsPerPage: number = 5;
  pageAllBooks: number = 1;
  pageMyBorrows: number = 1;
  searchTerm: string = ''; 

  constructor(private http: HttpClient) {
    afterNextRender(() => {
      // Vẫn lấy userId để biết AI đang mượn sách
      this.userId = localStorage.getItem('userId');
      
      this.loadAllBooks();     // Tải kho sách công khai
      if (this.userId) {
        this.loadUserBorrows();  // Tải sách cá nhân
      }
    });
  }
  
  gOnInit(): void {
    // 1. Lấy userId ngay lập tức
    this.userId = localStorage.getItem('userId');
    
    // 2. Tải kho sách (Công khai)
    this.loadAllBooks();

    // 3. Nếu có userId thì tải danh sách cá nhân
    if (this.userId) {
      this.loadUserBorrows();
    } else {
      console.warn('Không tìm thấy userId trong localStorage!');
    }
  }

  // 1. Lấy toàn bộ sách (Công khai)
  loadAllBooks(): void {
    this.http.get<any[]>('http://localhost:3000/books').subscribe({
      next: (data) => (this.allBooks = data),
      error: (err) => console.error('Lỗi tải kho sách:', err)
    });
  }

  // 2. Lấy danh sách sách đang mượn của user
  loadUserBorrows(): void {
    if (!this.userId) return;
    this.http.get<any[]>(`http://localhost:3000/borrows/user/${this.userId}`).subscribe({
      next: (data) => (this.borrowedBooks = data),
      error: (err) => console.error('Lỗi tải danh sách mượn:', err)
    });
  }

  // 3. Xử lý Mượn sách
  handleBorrow(bookId: number): void {
    if (!this.userId) {
      alert('Vui lòng đăng nhập trước khi mượn!');
      return;
    }

    const body = { 
      user_id: this.userId, 
      book_id: bookId 
    };

    // Không gửi headers chứa token nữa
    this.http.post('http://localhost:3000/borrows', body).subscribe({
      next: (res: any) => {
        alert('Mượn sách thành công!');
        location.reload();
      },
      error: (err) => {
        console.error(err);
        alert('Lỗi: ' + (err.error?.message || 'Không thể mượn'));
      }
    });
  }

  // 4. Xử lý Trả sách
  handleReturn(borrowId: number): void {
    if (confirm('Bạn chắc chắn muốn trả cuốn sách này?')) {
      // Không gửi headers chứa token nữa
      this.http.put(`http://localhost:3000/borrows/return/${borrowId}`, {}).subscribe({
        next: (res: any) => {
          alert(res.message || 'Đã trả sách thành công!');
          this.loadAllBooks();
          this.loadUserBorrows();
          window.location.reload();
        },
        error: (err) => alert('Lỗi khi thực hiện trả sách')
      });
    }
  }
  // --- LOGIC PHÂN TRANG CHO KHO SÁCH ---
  get filteredBooks() {
    if (!this.searchTerm) return this.allBooks;
    
    const term = this.searchTerm.toLowerCase();
    return this.allBooks.filter(book => 
      book.title.toLowerCase().includes(term) || 
      book.author.toLowerCase().includes(term)
    );
  }
  get pagedAllBooks() {
    const start = (this.pageAllBooks - 1) * this.itemsPerPage;
    return this.filteredBooks.slice(start, start + this.itemsPerPage);
  }

  get totalPagesAll() {
    return Math.ceil(this.filteredBooks.length / this.itemsPerPage);
  }
  onSearchChange() {
    this.pageAllBooks = 1;
  }

  // --- LOGIC PHÂN TRANG CHO SÁCH ĐANG MƯỢN ---
  get pagedMyBorrows() {
    const start = (this.pageMyBorrows - 1) * this.itemsPerPage;
    return this.borrowedBooks.slice(start, start + this.itemsPerPage);
  }

  get totalPagesMy() {
    return Math.ceil(this.borrowedBooks.length / this.itemsPerPage);
  }

  // Tạo mảng số trang helper
  getPagesArray(total: number) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  
}