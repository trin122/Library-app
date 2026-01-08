import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-borrows',
  standalone: false,
  templateUrl: './borrows.html',
  styleUrl: './borrows.css',
})
export class Borrows implements OnInit {
  allBorrows: any[] = [];
  filterStatus: string = 'all'; // 'all', 'borrowing', 'returned'

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBorrows();
  }

  loadBorrows(): void {
    this.http.get<any[]>('http://localhost:3000/borrows/admin/all').subscribe({
      next: (data) => (this.allBorrows = data),
      error: (err) => console.error('Lỗi tải danh sách mượn:', err)
    });
  }

  get filteredBorrows() {
    if (this.filterStatus === 'borrowing') {
      return this.allBorrows.filter(b => !b.return_date);
    } else if (this.filterStatus === 'returned') {
      return this.allBorrows.filter(b => b.return_date);
    }
    return this.allBorrows;
  }
}