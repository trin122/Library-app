import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  stats = {
    totalBooks: 0,
    totalUsers: 0,
    totalBorrows: 0
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.http.get<any>('http://localhost:3000/admin/stats').subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => console.error('Lỗi tải thống kê:', err)
    });
  }
}