import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SvgIconComponent } from '../../../shared/components/svg-icons/svg-icons.component';

@Component({
  selector: 'app-ar-recognition',
  standalone: true,
  imports: [CommonModule, SvgIconComponent],
  templateUrl: './ar-recognition.html',
  styleUrls: ['./ar-recognition.scss']
})
export class ArRecognitionComponent implements OnInit {
  isScanning = false;
  recognitionResult: any = null;
  scanHistory = [
    {
      id: 1,
      item: '塑料瓶',
      category: '可回收垃圾',
      points: 5,
      time: '2024-01-15 14:30',
      image: 'plastic-bottle.jpg'
    },
    {
      id: 2,
      item: '废纸',
      category: '可回收垃圾',
      points: 3,
      time: '2024-01-15 10:20',
      image: 'paper.jpg'
    },
    {
      id: 3,
      item: '电池',
      category: '有害垃圾',
      points: 10,
      time: '2024-01-14 16:45',
      image: 'battery.jpg'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  goBack() {
    this.router.navigate(['/consumer/home']);
  }

  startScanning() {
    this.isScanning = true;
    this.recognitionResult = null;
    
    // 模拟扫描过程
    setTimeout(() => {
      this.simulateRecognition();
    }, 3000);
  }

  stopScanning() {
    this.isScanning = false;
  }

  simulateRecognition() {
    this.isScanning = false;
    this.recognitionResult = {
      item: '塑料瓶',
      category: '可回收垃圾',
      points: 5,
      confidence: 95,
      tips: [
        '请清洗干净后投放',
        '可获得 5 积分奖励',
        '建议压扁后投放节省空间'
      ],
      recyclingInfo: {
        material: 'PET塑料',
        recyclable: true,
        process: '可制成纤维、地毯等产品'
      }
    };
  }

  confirmRecognition() {
    if (this.recognitionResult) {
      // 添加到历史记录
      this.scanHistory.unshift({
        id: Date.now(),
        item: this.recognitionResult.item,
        category: this.recognitionResult.category,
        points: this.recognitionResult.points,
        time: new Date().toLocaleString('zh-CN'),
        image: 'scanned-item.jpg'
      });
      
      this.recognitionResult = null;
      
      // 显示成功提示
      alert(`识别成功！获得 ${this.recognitionResult?.points || 0} 积分`);
    }
  }

  retryScanning() {
    this.recognitionResult = null;
    this.startScanning();
  }

  viewHistory() {
    // 可以导航到历史记录页面或展开历史记录
  }

  getCategoryColor(category: string): string {
    switch (category) {
      case '可回收垃圾':
        return '#4CAF50';
      case '有害垃圾':
        return '#F44336';
      case '厨余垃圾':
        return '#FF9800';
      case '其他垃圾':
        return '#9E9E9E';
      default:
        return '#2196F3';
    }
  }
}