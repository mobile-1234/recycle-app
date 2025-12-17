import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SvgIconComponent } from '../../../shared/components/svg-icons/svg-icons.component';
import { ArScannerService, WasteRecognitionResult, CameraMode } from '../../../core/services/ar-scanner.service';

@Component({
  selector: 'app-ar-recognition',
  standalone: true,
  imports: [CommonModule, SvgIconComponent],
  templateUrl: './ar-recognition.html',
  styleUrls: ['./ar-recognition.scss']
})
export class ArRecognitionComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement', { static: false }) canvasElement!: ElementRef<HTMLCanvasElement>;

  isScanning = false;
  isModelLoading = true;
  cameraError = false;
  errorMessage = '';
  recognitionResult: WasteRecognitionResult | null = null;
  detectionInterval: any = null;
  isSimulationMode = false;
  currentCameraMode: CameraMode = 'user';
  
  // 多帧稳定性验证
  private detectionHistory: Map<string, number> = new Map();
  private readonly STABILITY_THRESHOLD = 2; // 需要连续2帧检测到同一物体（更快）
  private readonly CONFIDENCE_THRESHOLD = 40; // 最低置信度要求40%
  
  scanHistory: any[] = [];

  constructor(
    private router: Router,
    private arScannerService: ArScannerService
  ) {}

  async ngOnInit() {
    this.loadScanHistory();
    
    console.log('🚀 开始初始化 AR 识别功能...');
    
    try {
      await this.arScannerService.initializeModel();
      this.isSimulationMode = this.arScannerService.isUsingSimulationMode();
      this.isModelLoading = false;
      console.log('🤖 使用AI真实识别模式');
    } catch (error) {
      console.error('初始化失败:', error);
      this.isModelLoading = false;
      this.cameraError = true;
      this.errorMessage = '⚠️ AI模型加载失败\n\n请开启VPN后刷新页面\n或点击下方使用备用模式';
    }
  }

  enableSimulationMode() {
    this.arScannerService.enableSimulation();
    this.isSimulationMode = true;
    this.cameraError = false;
    this.errorMessage = '';
    console.log('🎮 已启用备用识别模式');
  }

  ngOnDestroy() {
    this.stopScanning();
    this.arScannerService.dispose();
  }

  goBack() {
    this.stopScanning();
    this.router.navigate(['/consumer/home']);
  }

  async startScanning() {
    if (this.isModelLoading) {
      alert('⏳ 模型正在加载中，请稍候...');
      return;
    }

    try {
      console.log('📷 开始启动摄像头...');
      this.isScanning = true;
      this.cameraError = false;
      this.errorMessage = '';
      this.recognitionResult = null;

      await this.arScannerService.startCamera(this.videoElement.nativeElement);
      
      console.log('🔍 开始物体检测...');
      this.startDetection();
    } catch (error) {
      console.error('❌ 摄像头启动失败:', error);
      this.cameraError = true;
      this.isScanning = false;
      
      if (error instanceof Error) {
        this.errorMessage = `⚠️ ${error.message}`;
      } else {
        this.errorMessage = '❌ 无法访问摄像头，请检查权限设置';
      }
    }
  }

  stopScanning() {
    this.isScanning = false;
    
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
      this.detectionInterval = null;
    }
    
    this.arScannerService.stopCamera();
    
    if (this.canvasElement && this.canvasElement.nativeElement) {
      const canvas = this.canvasElement.nativeElement;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }

  // 动物类别列表 - 这些不会触发识别成功，只显示提示
  private animalClasses = ['cat', 'dog', 'bird', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe'];

  private startDetection() {
    // 重置检测历史
    this.detectionHistory.clear();
    
    this.detectionInterval = setInterval(async () => {
      if (!this.isScanning || !this.videoElement) return;

      try {
        const detections = await this.arScannerService.detectObjects(
          this.videoElement.nativeElement
        );

        if (detections && detections.length > 0) {
          console.log('🎯 检测到物体:', detections.map(d => `${d.class}(${Math.round(d.score * 100)}%)`).join(', '));
          this.drawDetections(detections);
          
          // 过滤掉动物和低置信度结果，优先识别废品
          const wasteDetections = detections.filter(d => 
            !this.animalClasses.includes(d.class.toLowerCase()) &&
            d.score * 100 >= this.CONFIDENCE_THRESHOLD
          );
          
          // 如果有非动物的高置信度检测结果
          if (wasteDetections.length > 0) {
            // 选择置信度最高的结果
            const bestDetection = wasteDetections.reduce((a, b) => a.score > b.score ? a : b);
            const detectionKey = bestDetection.class.toLowerCase();
            
            // 更新检测历史计数
            const currentCount = this.detectionHistory.get(detectionKey) || 0;
            this.detectionHistory.set(detectionKey, currentCount + 1);
            
            // 清除其他物体的计数（只保留当前检测到的）
            for (const key of this.detectionHistory.keys()) {
              if (key !== detectionKey) {
                this.detectionHistory.set(key, Math.max(0, (this.detectionHistory.get(key) || 0) - 1));
              }
            }
            
            console.log(`📊 稳定性: ${detectionKey} = ${this.detectionHistory.get(detectionKey)}/${this.STABILITY_THRESHOLD}`);
            
            // 检查是否达到稳定性阈值
            if (this.detectionHistory.get(detectionKey)! >= this.STABILITY_THRESHOLD) {
              const result = this.arScannerService.mapToWasteCategory([bestDetection]);
              if (result) {
                console.log('✅ 识别成功 (稳定):', result.item, result.confidence + '%');
                console.log(`💰 积分: ${result.points}, 类别: ${result.category}`);
                this.stopScanning();
                this.recognitionResult = result;
                this.detectionHistory.clear();
                return;
              }
            }
          } else {
            // 没有检测到有效废品，逐渐降低历史计数
            for (const key of this.detectionHistory.keys()) {
              this.detectionHistory.set(key, Math.max(0, (this.detectionHistory.get(key) || 0) - 1));
            }
          }
          
          // 如果只检测到动物，显示提示但不停止扫描
          const animalDetections = detections.filter(d => 
            this.animalClasses.includes(d.class.toLowerCase())
          );
          if (animalDetections.length > 0 && wasteDetections.length === 0) {
            const animal = animalDetections[0];
            console.log(`🐾 检测到动物: ${animal.class} - 继续扫描废品...`);
          }
        } else {
          this.clearCanvas();
          // 清空检测历史
          for (const key of this.detectionHistory.keys()) {
            this.detectionHistory.set(key, Math.max(0, (this.detectionHistory.get(key) || 0) - 1));
          }
        }
      } catch (error) {
        console.error('❌ 检测错误:', error);
      }
    }, 200); // 更快的检测间隔
  }

  private drawDetections(detections: any[]) {
    if (!this.canvasElement || !this.videoElement) return;

    const canvas = this.canvasElement.nativeElement;
    const video = this.videoElement.nativeElement;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    detections.forEach(detection => {
      const [x, y, width, height] = detection.bbox;
      const isAnimal = this.animalClasses.includes(detection.class.toLowerCase());
      
      // 动物用蓝色边框，废品用绿色边框
      const color = isAnimal ? '#2196F3' : '#4CAF50';
      const label = isAnimal ? `🐾 ${detection.class}` : detection.class;
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);
      
      ctx.fillStyle = color;
      ctx.fillRect(x, y - 30, Math.max(width, 120), 30);
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(
        `${label} ${Math.round(detection.score * 100)}%`,
        x + 5,
        y - 10
      );
    });
  }

  private clearCanvas() {
    if (!this.canvasElement) return;
    
    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  confirmRecognition() {
    if (this.recognitionResult) {
      const points = this.recognitionResult.points;
      
      this.scanHistory.unshift({
        id: Date.now(),
        item: this.recognitionResult.item,
        category: this.recognitionResult.category,
        points: points,
        time: new Date().toLocaleString('zh-CN'),
        image: 'scanned-item.jpg'
      });
      
      this.saveScanHistory();
      
      alert(`识别成功！获得 ${points} 积分`);
      
      this.recognitionResult = null;
    }
  }

  retryScanning() {
    this.recognitionResult = null;
    this.startScanning();
  }

  async switchCamera() {
    if (!this.isScanning) return;
    
    try {
      console.log('🔄 切换摄像头...');
      await this.arScannerService.switchCamera(this.videoElement.nativeElement);
      this.currentCameraMode = this.arScannerService.getCameraMode();
      console.log(`✅ 已切换到${this.currentCameraMode === 'user' ? '前置' : '后置'}摄像头`);
    } catch (error) {
      console.error('❌ 切换摄像头失败:', error);
    }
  }

  getCameraModeText(): string {
    return this.currentCameraMode === 'user' ? '前置' : '后置';
  }

  viewHistory() {
    console.log('View scan history');
  }

  private loadScanHistory() {
    const saved = localStorage.getItem('scanHistory');
    if (saved) {
      try {
        this.scanHistory = JSON.parse(saved);
      } catch (e) {
        this.scanHistory = [];
      }
    }
  }

  private saveScanHistory() {
    try {
      localStorage.setItem('scanHistory', JSON.stringify(this.scanHistory.slice(0, 50)));
    } catch (e) {
      console.error('Error saving scan history:', e);
    }
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