import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.html',
  styleUrl: './add-book.css',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
})
export class AddBook implements OnInit {
  books: any[] = [];
  newBook = { title: '', author: '', year: null };
  editBook: any = null;
  currentPage: number = 1;
  itemsPerPage: number = 6;
  searchTerm: string = '';

  // Sửa lại URL cho đúng với Route trong Node.js
  private apiUrl = 'http://localhost:3000/books'; 

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadBooks();
  }
  onSearchChange() {
    this.currentPage = 1; // Reset về trang 1 khi tìm kiếm
  }

  // Hàm bổ trợ để lấy Header có chứa Token (Giả sử bạn lưu token trong localStorage)
  private getOptions() {
    const token = localStorage.getItem('token'); 
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // 📋 LOAD DANH SÁCH
  loadBooks() {
    this.http.get<any[]>(this.apiUrl, this.getOptions()).subscribe({
      next: (data) => this.books = data,
      error: (err) => console.error('Lỗi load sách:', err)
    });
  }

  // ➕ THÊM SÁCH
  addBook() {
    if (!this.newBook.title || !this.newBook.author) {
      alert('❌ Vui lòng nhập đầy đủ thông tin');
      return;
    }

    this.http.post(this.apiUrl, this.newBook, this.getOptions()).subscribe({
      next: () => {
        alert('✅ Thêm sách thành công');
        this.newBook = { title: '', author: '', year: null }; // Reset form
        this.loadBooks(); // Load lại danh sách thay vì reload trang
      },
      error: (err) => alert('❌ Thêm sách thất bại: ' + err.error.message)
    });
  }

  // ✏️ BẮT ĐẦU SỬA
  startEdit(book: any) {
    this.editBook = { ...book };
  }

  // 💾 LƯU SỬA
  saveEdit() {
    this.http.put(`${this.apiUrl}/${this.editBook.id}`, this.editBook, this.getOptions())
      .subscribe({
        next: () => {
          alert('✏️ Cập nhật sách thành công');
          this.editBook = null;
          this.loadBooks();
        },
        error: (err) => alert('❌ Cập nhật thất bại')
      });
  }

  cancelEdit() {
    this.editBook = null;
  }

  // 🗑️ XÓA
  deleteBook(id: number) {
    if (confirm('Bạn có chắc muốn xóa sách này?')) {
      this.http.delete(`${this.apiUrl}/${id}`, this.getOptions())
        .subscribe({
          next: () => {
            alert('🗑️ Xóa sách thành công');
            this.loadBooks();
          },
          error: (err) => alert('❌ Xóa thất bại')
        });
    }
  }
  // Hàm này trả về danh sách sách chỉ dành cho trang hiện tại
  get pagedBooks() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  // Quan trọng: Phải slice từ filteredBooks để tìm kiếm và phân trang khớp nhau
  return this.filteredBooks.slice(startIndex, startIndex + this.itemsPerPage);
}

  // Tính tổng số trang
  get totalPages() {
  return Math.ceil(this.filteredBooks.length / this.itemsPerPage);
}
  // Chuyển trang
  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Tạo mảng số trang để hiển thị (ví dụ: [1, 2, 3])
  get pagesArray() {
  return Array.from({ length: this.totalPages }, (_, i) => i + 1);
}
  get filteredBooks() {
  if (!this.searchTerm) return this.books;
  
  const search = this.searchTerm.toLowerCase();
  return this.books.filter(book => 
    book.title.toLowerCase().includes(search) || 
    book.author.toLowerCase().includes(search)
  );
}
}