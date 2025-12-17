import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

export interface DetectionResult {
  class: string;
  score: number;
  bbox: [number, number, number, number];
}

export interface WasteRecognitionResult {
  item: string;
  category: string;
  points: number;
  confidence: number;
  tips: string[];
  recyclingInfo: {
    material: string;
    recyclable: boolean;
    process: string;
  };
  bbox?: [number, number, number, number];
}

export type CameraMode = 'user' | 'environment';

@Injectable({
  providedIn: 'root'
})
export class ArScannerService {
  private model: cocoSsd.ObjectDetection | null = null;
  private isModelLoaded = false;
  private stream: MediaStream | null = null;
  private useSimulationMode = false;
  private currentCameraMode: CameraMode = 'user';

  constructor() {}

  async initializeModel(): Promise<void> {
    if (this.isModelLoaded) return;
    
    try {
      console.log('🚀 开始加载 TensorFlow.js...');
      
      // 设置后端
      await tf.setBackend('webgl');
      await tf.ready();
      console.log('✅ TensorFlow.js WebGL 后端就绪');
      
      console.log('📦 正在加载 COCO-SSD 模型...');
      console.log('💡 提示: 如果加载失败，请开启 VPN 或使用代理');
      
      // 尝试加载模型（需要能访问 Google Storage）
      this.model = await Promise.race([
        cocoSsd.load({ base: 'lite_mobilenet_v2' }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('模型加载超时(30秒)，请检查网络或开启VPN')), 30000)
        )
      ]);
      
      this.isModelLoaded = true;
      this.useSimulationMode = false;
      console.log('✅ AI模型加载成功！使用真实识别模式');
      
    } catch (error) {
      console.error('❌ AI模型加载失败:', error);
      console.log('');
      console.log('='.repeat(50));
      console.log('⚠️ 模型加载失败，可能原因：');
      console.log('1. 无法访问 Google Storage (storage.googleapis.com)');
      console.log('2. 网络连接超时');
      console.log('');
      console.log('🔧 解决方案：');
      console.log('1. 开启 VPN/代理 后刷新页面');
      console.log('2. 或使用备用识别模式（点击下方按钮）');
      console.log('='.repeat(50));
      
      this.useSimulationMode = false; // 不自动启用模拟模式
      this.isModelLoaded = false;
      
      throw new Error('AI模型加载失败，请开启VPN后刷新页面，或使用备用识别模式');
    }
  }

  isUsingSimulationMode(): boolean {
    return this.useSimulationMode;
  }

  enableSimulation(): void {
    this.useSimulationMode = true;
    console.log('🎮 已启用备用识别模式');
  }

  getCameraMode(): CameraMode {
    return this.currentCameraMode;
  }

  async startCamera(videoElement: HTMLVideoElement, cameraMode?: CameraMode): Promise<MediaStream> {
    try {
      // 如果已有流，先停止
      this.stopCamera();
      
      if (cameraMode) {
        this.currentCameraMode = cameraMode;
      }
      
      console.log(`📷 请求${this.currentCameraMode === 'user' ? '前置' : '后置'}摄像头权限...`);
      
      const constraints = {
        video: {
          facingMode: this.currentCameraMode,
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoElement.srcObject = this.stream;
      
      console.log('✅ 摄像头访问成功');
      
      return new Promise((resolve, reject) => {
        videoElement.onloadedmetadata = () => {
          videoElement.play()
            .then(() => {
              console.log('✅ 视频播放开始');
              resolve(this.stream!);
            })
            .catch(reject);
        };
        
        setTimeout(() => reject(new Error('视频加载超时')), 10000);
      });
    } catch (error) {
      console.error('❌ 摄像头访问失败:', error);
      throw new Error(`无法访问摄像头: ${error instanceof Error ? error.message : '请检查权限设置'}`);
    }
  }

  async switchCamera(videoElement: HTMLVideoElement): Promise<MediaStream> {
    this.currentCameraMode = this.currentCameraMode === 'user' ? 'environment' : 'user';
    console.log(`🔄 切换到${this.currentCameraMode === 'user' ? '前置' : '后置'}摄像头`);
    return this.startCamera(videoElement, this.currentCameraMode);
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  // 只过滤人类，保留动物和所有其他物体
  private excludedClasses = ['person'];

  async detectObjects(videoElement: HTMLVideoElement): Promise<DetectionResult[]> {
    // 模拟识别模式
    if (this.useSimulationMode) {
      return this.simulateDetection(videoElement);
    }

    // 真实AI识别模式
    if (!this.model || !this.isModelLoaded) {
      console.warn('模型未加载，使用模拟模式');
      return this.simulateDetection(videoElement);
    }

    try {
      // 检测阈值设为0.35，提高检测灵敏度
      const predictions = await this.model.detect(videoElement, 5, 0.35);
      
      // 只过滤人类，保留动物和其他所有物体
      const filteredPredictions = predictions.filter(pred => 
        !this.excludedClasses.includes(pred.class.toLowerCase())
      );
      
      // 按置信度排序，保留较高置信度结果
      const sortedPredictions = filteredPredictions
        .filter(pred => pred.score >= 0.35)
        .sort((a, b) => b.score - a.score);
      
      // 如果检测到水果类，可能是果皮/果核
      const results = sortedPredictions.map(pred => {
        if (['apple', 'orange', 'banana'].includes(pred.class.toLowerCase())) {
          console.log(`🍎 检测到水果类: ${pred.class} (${Math.round(pred.score * 100)}%)`);
        }
        
        return {
          class: pred.class,
          score: pred.score,
          bbox: pred.bbox
        };
      });
      
      return results;
    } catch (error) {
      console.error('检测错误，切换到模拟模式:', error);
      return this.simulateDetection(videoElement);
    }
  }

  private simulateDetection(videoElement: HTMLVideoElement): DetectionResult[] {
    // 基于视频帧分析的智能模拟识别
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];

    canvas.width = videoElement.videoWidth || 640;
    canvas.height = videoElement.videoHeight || 480;
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // 获取图像数据进行简单颜色分析
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const analysis = this.analyzeImageColors(imageData);

    // 基于颜色分析返回模拟结果
    const detectedItems = this.getSimulatedItems(analysis);
    
    if (detectedItems.length > 0) {
      const item = detectedItems[Math.floor(Math.random() * detectedItems.length)];
      const centerX = canvas.width * 0.2;
      const centerY = canvas.height * 0.2;
      const boxWidth = canvas.width * 0.6;
      const boxHeight = canvas.height * 0.6;

      return [{
        class: item.class,
        score: item.score,
        bbox: [centerX, centerY, boxWidth, boxHeight] as [number, number, number, number]
      }];
    }

    return [];
  }

  private analyzeImageColors(imageData: ImageData): { brightness: number; dominantColor: string; hasObject: boolean } {
    const data = imageData.data;
    let totalR = 0, totalG = 0, totalB = 0, totalBrightness = 0;
    const pixelCount = data.length / 4;
    
    // 采样分析（每10个像素取一个）
    for (let i = 0; i < data.length; i += 40) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      totalR += r;
      totalG += g;
      totalB += b;
      totalBrightness += (r + g + b) / 3;
    }

    const sampleCount = pixelCount / 10;
    const avgR = totalR / sampleCount;
    const avgG = totalG / sampleCount;
    const avgB = totalB / sampleCount;
    const brightness = totalBrightness / sampleCount;

    // 判断主色调
    let dominantColor = 'neutral';
    if (avgR > avgG + 20 && avgR > avgB + 20) dominantColor = 'red';
    else if (avgG > avgR + 20 && avgG > avgB + 20) dominantColor = 'green';
    else if (avgB > avgR + 20 && avgB > avgG + 20) dominantColor = 'blue';
    else if (avgR > 180 && avgG > 180 && avgB > 180) dominantColor = 'white';
    else if (avgR < 80 && avgG < 80 && avgB < 80) dominantColor = 'dark';

    // 检测是否有明显物体（基于亮度变化）
    const hasObject = brightness > 50 && brightness < 220;

    return { brightness, dominantColor, hasObject };
  }

  private getSimulatedItems(analysis: { brightness: number; dominantColor: string; hasObject: boolean }): { class: string; score: number }[] {
    if (!analysis.hasObject) return [];

    // 基于颜色分析返回可能的物品
    const itemsByColor: { [key: string]: { class: string; score: number }[] } = {
      'blue': [
        { class: 'bottle', score: 0.85 + Math.random() * 0.1 },
        { class: 'cup', score: 0.75 + Math.random() * 0.1 }
      ],
      'white': [
        { class: 'cup', score: 0.80 + Math.random() * 0.1 },
        { class: 'book', score: 0.70 + Math.random() * 0.1 }
      ],
      'green': [
        { class: 'bottle', score: 0.82 + Math.random() * 0.1 },
        { class: 'apple', score: 0.75 + Math.random() * 0.1 }
      ],
      'red': [
        { class: 'apple', score: 0.88 + Math.random() * 0.1 },
        { class: 'cup', score: 0.70 + Math.random() * 0.1 }
      ],
      'dark': [
        { class: 'cell phone', score: 0.85 + Math.random() * 0.1 },
        { class: 'laptop', score: 0.78 + Math.random() * 0.1 },
        { class: 'remote', score: 0.72 + Math.random() * 0.1 }
      ],
      'neutral': [
        { class: 'bottle', score: 0.75 + Math.random() * 0.1 },
        { class: 'cup', score: 0.72 + Math.random() * 0.1 },
        { class: 'book', score: 0.70 + Math.random() * 0.1 }
      ]
    };

    return itemsByColor[analysis.dominantColor] || itemsByColor['neutral'];
  }

  mapToWasteCategory(detections: DetectionResult[]): WasteRecognitionResult | null {
    if (!detections || detections.length === 0) return null;

    // 选择置信度最高的非动物检测结果
    const sortedDetections = [...detections].sort((a, b) => b.score - a.score);
    const detection = sortedDetections[0];
    const wasteMapping = this.getWasteMapping();
    
    const classKey = detection.class.toLowerCase();
    const mappedItem = wasteMapping[classKey];
    
    if (mappedItem) {
      console.log(`📦 映射成功: ${detection.class} → ${mappedItem.item} (${mappedItem.points}积分)`);
      return {
        item: mappedItem.item,
        category: mappedItem.category,
        points: mappedItem.points,
        tips: mappedItem.tips,
        recyclingInfo: mappedItem.recyclingInfo,
        confidence: Math.round(detection.score * 100),
        bbox: detection.bbox
      };
    }

    console.log(`⚠️ 未找到映射: ${detection.class}，使用默认分类`);
    return {
      item: detection.class,
      category: '其他垃圾',
      points: 2,
      confidence: Math.round(detection.score * 100),
      tips: [
        '请确认物品类别',
        '如不确定，请咨询客服',
        '可获得 2 积分奖励'
      ],
      recyclingInfo: {
        material: '未知材质',
        recyclable: false,
        process: '请按一般垃圾处理'
      },
      bbox: detection.bbox
    };
  }

  private getWasteMapping(): { [key: string]: Omit<WasteRecognitionResult, 'confidence' | 'bbox'> } {
    return {
      'bottle': {
        item: '塑料瓶',
        category: '可回收垃圾',
        points: 5,
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
      },
      'cup': {
        item: '纸杯/塑料杯',
        category: '可回收垃圾',
        points: 3,
        tips: [
          '纸杯需去除塑料涂层',
          '可获得 3 积分奖励',
          '请清洗后投放'
        ],
        recyclingInfo: {
          material: '纸质或塑料',
          recyclable: true,
          process: '可制成再生纸或塑料制品'
        }
      },
      'cell phone': {
        item: '手机',
        category: '可回收垃圾',
        points: 50,
        tips: [
          '含有贵重金属',
          '可获得 50 积分奖励',
          '建议专业回收机构处理'
        ],
        recyclingInfo: {
          material: '电子产品',
          recyclable: true,
          process: '可提取金、银、铜等金属'
        }
      },
      'book': {
        item: '书籍/纸张',
        category: '可回收垃圾',
        points: 3,
        tips: [
          '保持干燥',
          '可获得 3 积分奖励',
          '去除塑料封面'
        ],
        recyclingInfo: {
          material: '纸质',
          recyclable: true,
          process: '可制成再生纸'
        }
      },
      'laptop': {
        item: '笔记本电脑',
        category: '可回收垃圾',
        points: 100,
        tips: [
          '含有贵重金属和电池',
          '可获得 100 积分奖励',
          '必须专业回收'
        ],
        recyclingInfo: {
          material: '电子产品',
          recyclable: true,
          process: '可提取金属和塑料'
        }
      },
      'keyboard': {
        item: '键盘',
        category: '可回收垃圾',
        points: 10,
        tips: [
          '电子废品',
          '可获得 10 积分奖励',
          '请拆除电池'
        ],
        recyclingInfo: {
          material: '塑料和电子元件',
          recyclable: true,
          process: '可分离塑料和金属'
        }
      },
      'mouse': {
        item: '鼠标',
        category: '可回收垃圾',
        points: 8,
        tips: [
          '电子废品',
          '可获得 8 积分奖励',
          '请拆除电池'
        ],
        recyclingInfo: {
          material: '塑料和电子元件',
          recyclable: true,
          process: '可分离塑料和金属'
        }
      },
      'scissors': {
        item: '剪刀',
        category: '可回收垃圾',
        points: 5,
        tips: [
          '金属制品',
          '可获得 5 积分奖励',
          '注意锋利边缘'
        ],
        recyclingInfo: {
          material: '金属',
          recyclable: true,
          process: '可熔炼再造'
        }
      },
      'apple': {
        item: '苹果/苹果核/果皮',
        category: '厨余垃圾',
        points: 2,
        tips: [
          '🍎 水果及果皮果核都属于厨余垃圾',
          '可获得 2 积分奖励',
          '可用于堆肥制成有机肥料'
        ],
        recyclingInfo: {
          material: '有机物',
          recyclable: true,
          process: '可制成有机肥料'
        }
      },
      'orange': {
        item: '橙子/橘子皮/果皮',
        category: '厨余垃圾',
        points: 2,
        tips: [
          '🍊 水果及果皮都属于厨余垃圾',
          '可获得 2 积分奖励',
          '橘子皮可晒干再利用'
        ],
        recyclingInfo: {
          material: '有机物',
          recyclable: true,
          process: '可制成有机肥料'
        }
      },
      'banana': {
        item: '香蕉/香蕉皮',
        category: '厨余垃圾',
        points: 2,
        tips: [
          '🍌 香蕉皮属于厨余垃圾',
          '可获得 2 积分奖励',
          '香蕉皮可用于堆肥'
        ],
        recyclingInfo: {
          material: '有机物',
          recyclable: true,
          process: '可制成有机肥料'
        }
      },
      'fork': {
        item: '餐具',
        category: '可回收垃圾',
        points: 3,
        tips: [
          '金属或塑料餐具',
          '可获得 3 积分奖励',
          '请清洗后投放'
        ],
        recyclingInfo: {
          material: '金属或塑料',
          recyclable: true,
          process: '根据材质分类回收'
        }
      },
      'knife': {
        item: '刀具',
        category: '可回收垃圾',
        points: 5,
        tips: [
          '金属制品',
          '可获得 5 积分奖励',
          '注意安全包装'
        ],
        recyclingInfo: {
          material: '金属',
          recyclable: true,
          process: '可熔炼再造'
        }
      },
      'spoon': {
        item: '勺子',
        category: '可回收垃圾',
        points: 3,
        tips: [
          '金属或塑料餐具',
          '可获得 3 积分奖励',
          '请清洗后投放'
        ],
        recyclingInfo: {
          material: '金属或塑料',
          recyclable: true,
          process: '根据材质分类回收'
        }
      },
      'bowl': {
        item: '碗',
        category: '其他垃圾',
        points: 2,
        tips: [
          '陶瓷制品',
          '可获得 2 积分奖励',
          '破损陶瓷不可回收'
        ],
        recyclingInfo: {
          material: '陶瓷',
          recyclable: false,
          process: '作为其他垃圾处理'
        }
      },
      'clock': {
        item: '钟表',
        category: '可回收垃圾',
        points: 15,
        tips: [
          '含电子元件和电池',
          '可获得 15 积分奖励',
          '请取出电池单独投放'
        ],
        recyclingInfo: {
          material: '电子产品',
          recyclable: true,
          process: '可分离金属和塑料'
        }
      },
      'vase': {
        item: '花瓶',
        category: '其他垃圾',
        points: 2,
        tips: [
          '陶瓷或玻璃制品',
          '可获得 2 积分奖励',
          '破损需小心包装'
        ],
        recyclingInfo: {
          material: '陶瓷或玻璃',
          recyclable: false,
          process: '作为其他垃圾处理'
        }
      },
      'toothbrush': {
        item: '牙刷',
        category: '其他垃圾',
        points: 1,
        tips: [
          '个人卫生用品',
          '可获得 1 积分奖励',
          '不可回收'
        ],
        recyclingInfo: {
          material: '塑料',
          recyclable: false,
          process: '作为其他垃圾处理'
        }
      },
      'backpack': {
        item: '背包',
        category: '可回收垃圾',
        points: 10,
        tips: [
          '纺织品',
          '可获得 10 积分奖励',
          '可捐赠或回收利用'
        ],
        recyclingInfo: {
          material: '纺织品',
          recyclable: true,
          process: '可制成再生纤维'
        }
      },
      'handbag': {
        item: '手提包',
        category: '可回收垃圾',
        points: 10,
        tips: [
          '纺织品或皮革',
          '可获得 10 积分奖励',
          '可捐赠或回收利用'
        ],
        recyclingInfo: {
          material: '纺织品或皮革',
          recyclable: true,
          process: '可制成再生材料'
        }
      },
      'umbrella': {
        item: '雨伞',
        category: '可回收垃圾',
        points: 8,
        tips: [
          '金属和布料组合',
          '可获得 8 积分奖励',
          '需拆解分类投放'
        ],
        recyclingInfo: {
          material: '金属和纺织品',
          recyclable: true,
          process: '需分离不同材质'
        }
      },
      'shoe': {
        item: '鞋子',
        category: '可回收垃圾',
        points: 8,
        tips: [
          '纺织品和橡胶',
          '可获得 8 积分奖励',
          '可捐赠或回收利用'
        ],
        recyclingInfo: {
          material: '纺织品和橡胶',
          recyclable: true,
          process: '可制成再生材料'
        }
      },
      'remote': {
        item: '遥控器',
        category: '可回收垃圾',
        points: 8,
        tips: [
          '电子产品',
          '可获得 8 积分奖励',
          '请取出电池单独投放'
        ],
        recyclingInfo: {
          material: '塑料和电子元件',
          recyclable: true,
          process: '可分离塑料和金属'
        }
      },
      // ===== 动物类别 =====
      'cat': {
        item: '猫咪',
        category: '宠物',
        points: 0,
        tips: [
          '🐱 这是一只可爱的猫咪',
          '请善待小动物',
          '宠物不属于垃圾分类范畴'
        ],
        recyclingInfo: {
          material: '生命体',
          recyclable: false,
          process: '请好好照顾它'
        }
      },
      'dog': {
        item: '狗狗',
        category: '宠物',
        points: 0,
        tips: [
          '🐕 这是一只可爱的狗狗',
          '请善待小动物',
          '宠物不属于垃圾分类范畴'
        ],
        recyclingInfo: {
          material: '生命体',
          recyclable: false,
          process: '请好好照顾它'
        }
      },
      'bird': {
        item: '鸟类',
        category: '动物',
        points: 0,
        tips: [
          '🐦 这是一只鸟',
          '请保护野生动物',
          '动物不属于垃圾分类范畴'
        ],
        recyclingInfo: {
          material: '生命体',
          recyclable: false,
          process: '请保护野生动物'
        }
      },
      'horse': {
        item: '马',
        category: '动物',
        points: 0,
        tips: [
          '🐴 这是一匹马',
          '请保护动物',
          '动物不属于垃圾分类范畴'
        ],
        recyclingInfo: {
          material: '生命体',
          recyclable: false,
          process: '请保护动物'
        }
      },
      'sheep': {
        item: '羊',
        category: '动物',
        points: 0,
        tips: [
          '🐑 这是一只羊',
          '请保护动物',
          '动物不属于垃圾分类范畴'
        ],
        recyclingInfo: {
          material: '生命体',
          recyclable: false,
          process: '请保护动物'
        }
      },
      'cow': {
        item: '牛',
        category: '动物',
        points: 0,
        tips: [
          '🐄 这是一头牛',
          '请保护动物',
          '动物不属于垃圾分类范畴'
        ],
        recyclingInfo: {
          material: '生命体',
          recyclable: false,
          process: '请保护动物'
        }
      },
      'elephant': {
        item: '大象',
        category: '动物',
        points: 0,
        tips: [
          '🐘 这是一头大象',
          '请保护野生动物',
          '动物不属于垃圾分类范畴'
        ],
        recyclingInfo: {
          material: '生命体',
          recyclable: false,
          process: '请保护野生动物'
        }
      },
      'bear': {
        item: '熊',
        category: '动物',
        points: 0,
        tips: [
          '🐻 这是一只熊',
          '请保护野生动物',
          '动物不属于垃圾分类范畴'
        ],
        recyclingInfo: {
          material: '生命体',
          recyclable: false,
          process: '请保护野生动物'
        }
      },
      'zebra': {
        item: '斑马',
        category: '动物',
        points: 0,
        tips: [
          '🦓 这是一只斑马',
          '请保护野生动物',
          '动物不属于垃圾分类范畴'
        ],
        recyclingInfo: {
          material: '生命体',
          recyclable: false,
          process: '请保护野生动物'
        }
      },
      'giraffe': {
        item: '长颈鹿',
        category: '动物',
        points: 0,
        tips: [
          '🦒 这是一只长颈鹿',
          '请保护野生动物',
          '动物不属于垃圾分类范畴'
        ],
        recyclingInfo: {
          material: '生命体',
          recyclable: false,
          process: '请保护野生动物'
        }
      },
      // ===== 更多厨余垃圾 =====
      'broccoli': {
        item: '西兰花/蔬菜',
        category: '厨余垃圾',
        points: 2,
        tips: [
          '有机蔬菜垃圾',
          '可获得 2 积分奖励',
          '可用于堆肥'
        ],
        recyclingInfo: {
          material: '有机物',
          recyclable: true,
          process: '可制成有机肥料'
        }
      },
      'carrot': {
        item: '胡萝卜/蔬菜',
        category: '厨余垃圾',
        points: 2,
        tips: [
          '有机蔬菜垃圾',
          '可获得 2 积分奖励',
          '可用于堆肥'
        ],
        recyclingInfo: {
          material: '有机物',
          recyclable: true,
          process: '可制成有机肥料'
        }
      },
      'hot dog': {
        item: '食物残渣',
        category: '厨余垃圾',
        points: 2,
        tips: [
          '食物垃圾',
          '可获得 2 积分奖励',
          '请沥干水分后投放'
        ],
        recyclingInfo: {
          material: '有机物',
          recyclable: true,
          process: '可制成有机肥料'
        }
      },
      'pizza': {
        item: '食物残渣',
        category: '厨余垃圾',
        points: 2,
        tips: [
          '食物垃圾',
          '可获得 2 积分奖励',
          '请去除包装后投放'
        ],
        recyclingInfo: {
          material: '有机物',
          recyclable: true,
          process: '可制成有机肥料'
        }
      },
      'donut': {
        item: '食物残渣',
        category: '厨余垃圾',
        points: 2,
        tips: [
          '食物垃圾',
          '可获得 2 积分奖励',
          '可用于堆肥'
        ],
        recyclingInfo: {
          material: '有机物',
          recyclable: true,
          process: '可制成有机肥料'
        }
      },
      'cake': {
        item: '蛋糕/食物残渣',
        category: '厨余垃圾',
        points: 2,
        tips: [
          '食物垃圾',
          '可获得 2 积分奖励',
          '请去除包装后投放'
        ],
        recyclingInfo: {
          material: '有机物',
          recyclable: true,
          process: '可制成有机肥料'
        }
      },
      'sandwich': {
        item: '三明治/食物残渣',
        category: '厨余垃圾',
        points: 2,
        tips: [
          '食物垃圾',
          '可获得 2 积分奖励',
          '请去除包装后投放'
        ],
        recyclingInfo: {
          material: '有机物',
          recyclable: true,
          process: '可制成有机肥料'
        }
      },
      // ===== 更多可回收物品 =====
      'wine glass': {
        item: '玻璃杯',
        category: '可回收垃圾',
        points: 3,
        tips: [
          '玻璃制品',
          '可获得 3 积分奖励',
          '请小心破碎'
        ],
        recyclingInfo: {
          material: '玻璃',
          recyclable: true,
          process: '可熔化再制玻璃制品'
        }
      },
      'tv': {
        item: '电视机',
        category: '可回收垃圾',
        points: 80,
        tips: [
          '大型电子废品',
          '可获得 80 积分奖励',
          '需专业回收处理'
        ],
        recyclingInfo: {
          material: '电子产品',
          recyclable: true,
          process: '可提取金属和塑料'
        }
      },
      'refrigerator': {
        item: '冰箱',
        category: '可回收垃圾',
        points: 150,
        tips: [
          '大型家电',
          '可获得 150 积分奖励',
          '需预约上门回收'
        ],
        recyclingInfo: {
          material: '金属和塑料',
          recyclable: true,
          process: '需专业拆解回收'
        }
      },
      'microwave': {
        item: '微波炉',
        category: '可回收垃圾',
        points: 30,
        tips: [
          '小型家电',
          '可获得 30 积分奖励',
          '需专业回收处理'
        ],
        recyclingInfo: {
          material: '金属和电子元件',
          recyclable: true,
          process: '可分离金属和塑料'
        }
      },
      'oven': {
        item: '烤箱',
        category: '可回收垃圾',
        points: 40,
        tips: [
          '小型家电',
          '可获得 40 积分奖励',
          '需专业回收处理'
        ],
        recyclingInfo: {
          material: '金属和电子元件',
          recyclable: true,
          process: '可分离金属和塑料'
        }
      },
      'toaster': {
        item: '烤面包机',
        category: '可回收垃圾',
        points: 15,
        tips: [
          '小型家电',
          '可获得 15 积分奖励',
          '请清洁后投放'
        ],
        recyclingInfo: {
          material: '金属和塑料',
          recyclable: true,
          process: '可分离金属和塑料'
        }
      },
      'sink': {
        item: '水槽',
        category: '可回收垃圾',
        points: 20,
        tips: [
          '金属制品',
          '可获得 20 积分奖励',
          '需拆卸后投放'
        ],
        recyclingInfo: {
          material: '不锈钢',
          recyclable: true,
          process: '可熔炼再造'
        }
      },
      'chair': {
        item: '椅子',
        category: '可回收垃圾',
        points: 15,
        tips: [
          '家具',
          '可获得 15 积分奖励',
          '可捐赠或回收'
        ],
        recyclingInfo: {
          material: '木材/塑料/金属',
          recyclable: true,
          process: '根据材质分类回收'
        }
      },
      'couch': {
        item: '沙发',
        category: '可回收垃圾',
        points: 50,
        tips: [
          '大型家具',
          '可获得 50 积分奖励',
          '需预约上门回收'
        ],
        recyclingInfo: {
          material: '纺织品和木材',
          recyclable: true,
          process: '可分离不同材质回收'
        }
      },
      'bed': {
        item: '床',
        category: '可回收垃圾',
        points: 60,
        tips: [
          '大型家具',
          '可获得 60 积分奖励',
          '需预约上门回收'
        ],
        recyclingInfo: {
          material: '木材和纺织品',
          recyclable: true,
          process: '可分离不同材质回收'
        }
      },
      'potted plant': {
        item: '盆栽植物',
        category: '厨余垃圾',
        points: 3,
        tips: [
          '植物和土壤',
          '可获得 3 积分奖励',
          '花盆需单独投放'
        ],
        recyclingInfo: {
          material: '有机物',
          recyclable: true,
          process: '植物可堆肥，花盆根据材质回收'
        }
      },
      'toilet': {
        item: '马桶',
        category: '其他垃圾',
        points: 10,
        tips: [
          '陶瓷制品',
          '可获得 10 积分奖励',
          '需专业拆卸'
        ],
        recyclingInfo: {
          material: '陶瓷',
          recyclable: false,
          process: '作为建筑垃圾处理'
        }
      },
      'suitcase': {
        item: '行李箱',
        category: '可回收垃圾',
        points: 15,
        tips: [
          '纺织品和塑料',
          '可获得 15 积分奖励',
          '可捐赠或回收'
        ],
        recyclingInfo: {
          material: '塑料和纺织品',
          recyclable: true,
          process: '可分离不同材质回收'
        }
      },
      'tie': {
        item: '领带',
        category: '可回收垃圾',
        points: 2,
        tips: [
          '纺织品',
          '可获得 2 积分奖励',
          '可捐赠或回收'
        ],
        recyclingInfo: {
          material: '纺织品',
          recyclable: true,
          process: '可制成再生纤维'
        }
      },
      'tennis racket': {
        item: '网球拍',
        category: '可回收垃圾',
        points: 10,
        tips: [
          '体育用品',
          '可获得 10 积分奖励',
          '可捐赠或回收'
        ],
        recyclingInfo: {
          material: '复合材料',
          recyclable: true,
          process: '可分离不同材质回收'
        }
      },
      'baseball bat': {
        item: '棒球棒',
        category: '可回收垃圾',
        points: 8,
        tips: [
          '体育用品',
          '可获得 8 积分奖励',
          '可捐赠或回收'
        ],
        recyclingInfo: {
          material: '木材或金属',
          recyclable: true,
          process: '根据材质分类回收'
        }
      },
      'skateboard': {
        item: '滑板',
        category: '可回收垃圾',
        points: 10,
        tips: [
          '体育用品',
          '可获得 10 积分奖励',
          '可捐赠或回收'
        ],
        recyclingInfo: {
          material: '木材和金属',
          recyclable: true,
          process: '可分离不同材质回收'
        }
      },
      'bicycle': {
        item: '自行车',
        category: '可回收垃圾',
        points: 50,
        tips: [
          '交通工具',
          '可获得 50 积分奖励',
          '可捐赠或回收'
        ],
        recyclingInfo: {
          material: '金属和橡胶',
          recyclable: true,
          process: '可分离金属和橡胶回收'
        }
      },
      'motorcycle': {
        item: '摩托车',
        category: '可回收垃圾',
        points: 200,
        tips: [
          '机动车辆',
          '可获得 200 积分奖励',
          '需到指定地点报废'
        ],
        recyclingInfo: {
          material: '金属和塑料',
          recyclable: true,
          process: '需专业拆解回收'
        }
      },
      'car': {
        item: '汽车',
        category: '可回收垃圾',
        points: 500,
        tips: [
          '机动车辆',
          '可获得 500 积分奖励',
          '需到指定地点报废'
        ],
        recyclingInfo: {
          material: '金属和塑料',
          recyclable: true,
          process: '需专业拆解回收'
        }
      },
      'truck': {
        item: '卡车',
        category: '可回收垃圾',
        points: 800,
        tips: [
          '机动车辆',
          '可获得 800 积分奖励',
          '需到指定地点报废'
        ],
        recyclingInfo: {
          material: '金属和塑料',
          recyclable: true,
          process: '需专业拆解回收'
        }
      },
      'bus': {
        item: '公交车',
        category: '可回收垃圾',
        points: 1000,
        tips: [
          '大型机动车辆',
          '可获得 1000 积分奖励',
          '需专业报废处理'
        ],
        recyclingInfo: {
          material: '金属和塑料',
          recyclable: true,
          process: '需专业拆解回收'
        }
      },
      'airplane': {
        item: '飞机',
        category: '可回收垃圾',
        points: 5000,
        tips: [
          '航空器',
          '可获得 5000 积分奖励',
          '需专业报废处理'
        ],
        recyclingInfo: {
          material: '金属合金',
          recyclable: true,
          process: '需专业拆解回收'
        }
      },
      'boat': {
        item: '船',
        category: '可回收垃圾',
        points: 300,
        tips: [
          '水上交通工具',
          '可获得 300 积分奖励',
          '需专业报废处理'
        ],
        recyclingInfo: {
          material: '金属或木材',
          recyclable: true,
          process: '根据材质分类回收'
        }
      },
      // ===== 补充完整 COCO-SSD 80类 =====
      'train': {
        item: '火车',
        category: '可回收垃圾',
        points: 2000,
        tips: [
          '大型交通工具',
          '可获得 2000 积分奖励',
          '需专业报废处理'
        ],
        recyclingInfo: {
          material: '金属',
          recyclable: true,
          process: '需专业拆解回收'
        }
      },
      'traffic light': {
        item: '交通信号灯',
        category: '可回收垃圾',
        points: 30,
        tips: [
          '市政设施',
          '可获得 30 积分奖励',
          '需专业回收处理'
        ],
        recyclingInfo: {
          material: '金属和电子元件',
          recyclable: true,
          process: '可分离金属和塑料'
        }
      },
      'fire hydrant': {
        item: '消防栓',
        category: '可回收垃圾',
        points: 50,
        tips: [
          '市政设施',
          '可获得 50 积分奖励',
          '需专业回收处理'
        ],
        recyclingInfo: {
          material: '金属',
          recyclable: true,
          process: '可熔炼再造'
        }
      },
      'stop sign': {
        item: '停车标志',
        category: '可回收垃圾',
        points: 15,
        tips: [
          '金属标志牌',
          '可获得 15 积分奖励',
          '需专业回收处理'
        ],
        recyclingInfo: {
          material: '金属',
          recyclable: true,
          process: '可熔炼再造'
        }
      },
      'parking meter': {
        item: '停车计时器',
        category: '可回收垃圾',
        points: 25,
        tips: [
          '电子设备',
          '可获得 25 积分奖励',
          '需专业回收处理'
        ],
        recyclingInfo: {
          material: '金属和电子元件',
          recyclable: true,
          process: '可分离金属和电子元件'
        }
      },
      'bench': {
        item: '长椅/长凳',
        category: '可回收垃圾',
        points: 20,
        tips: [
          '公共设施',
          '可获得 20 积分奖励',
          '可捐赠或回收'
        ],
        recyclingInfo: {
          material: '木材或金属',
          recyclable: true,
          process: '根据材质分类回收'
        }
      },
      'frisbee': {
        item: '飞盘',
        category: '可回收垃圾',
        points: 3,
        tips: [
          '塑料玩具',
          '可获得 3 积分奖励',
          '可回收再利用'
        ],
        recyclingInfo: {
          material: '塑料',
          recyclable: true,
          process: '可制成再生塑料'
        }
      },
      'skis': {
        item: '滑雪板',
        category: '可回收垃圾',
        points: 15,
        tips: [
          '体育用品',
          '可获得 15 积分奖励',
          '可捐赠或回收'
        ],
        recyclingInfo: {
          material: '复合材料',
          recyclable: true,
          process: '需分离不同材质回收'
        }
      },
      'snowboard': {
        item: '滑雪板',
        category: '可回收垃圾',
        points: 15,
        tips: [
          '体育用品',
          '可获得 15 积分奖励',
          '可捐赠或回收'
        ],
        recyclingInfo: {
          material: '复合材料',
          recyclable: true,
          process: '需分离不同材质回收'
        }
      },
      'sports ball': {
        item: '运动球类',
        category: '其他垃圾',
        points: 2,
        tips: [
          '橡胶或皮革制品',
          '可获得 2 积分奖励',
          '可捐赠再利用'
        ],
        recyclingInfo: {
          material: '橡胶或皮革',
          recyclable: false,
          process: '作为其他垃圾处理'
        }
      },
      'kite': {
        item: '风筝',
        category: '其他垃圾',
        points: 2,
        tips: [
          '塑料和布料',
          '可获得 2 积分奖励',
          '不易回收'
        ],
        recyclingInfo: {
          material: '塑料和纺织品',
          recyclable: false,
          process: '作为其他垃圾处理'
        }
      },
      'baseball glove': {
        item: '棒球手套',
        category: '可回收垃圾',
        points: 5,
        tips: [
          '皮革制品',
          '可获得 5 积分奖励',
          '可捐赠再利用'
        ],
        recyclingInfo: {
          material: '皮革',
          recyclable: true,
          process: '可制成再生皮革'
        }
      },
      'surfboard': {
        item: '冲浪板',
        category: '可回收垃圾',
        points: 20,
        tips: [
          '体育用品',
          '可获得 20 积分奖励',
          '可捐赠或回收'
        ],
        recyclingInfo: {
          material: '复合材料',
          recyclable: true,
          process: '需分离不同材质回收'
        }
      },
      'dining table': {
        item: '餐桌',
        category: '可回收垃圾',
        points: 40,
        tips: [
          '大型家具',
          '可获得 40 积分奖励',
          '可捐赠或回收'
        ],
        recyclingInfo: {
          material: '木材或金属',
          recyclable: true,
          process: '根据材质分类回收'
        }
      },
      'teddy bear': {
        item: '玩具熊/毛绒玩具',
        category: '其他垃圾',
        points: 2,
        tips: [
          '毛绒玩具',
          '可获得 2 积分奖励',
          '可捐赠再利用'
        ],
        recyclingInfo: {
          material: '纺织品和填充物',
          recyclable: false,
          process: '建议捐赠，否则作为其他垃圾'
        }
      },
      'hair drier': {
        item: '吹风机',
        category: '可回收垃圾',
        points: 10,
        tips: [
          '小型家电',
          '可获得 10 积分奖励',
          '需专业回收处理'
        ],
        recyclingInfo: {
          material: '塑料和电子元件',
          recyclable: true,
          process: '可分离塑料和金属'
        }
      },
      // ===== 食物残渣/果皮类（映射到相近物品）=====
      'food waste': {
        item: '食物残渣/果皮',
        category: '厨余垃圾',
        points: 2,
        tips: [
          '🍎 果皮、果核、剩菜剩饭',
          '可获得 2 积分奖励',
          '请沥干水分后投放'
        ],
        recyclingInfo: {
          material: '有机物',
          recyclable: true,
          process: '可制成有机肥料'
        }
      }
    };
  }

  isModelReady(): boolean {
    return this.isModelLoaded;
  }

  async dispose(): Promise<void> {
    this.stopCamera();
    if (this.model) {
      this.model.dispose();
      this.model = null;
      this.isModelLoaded = false;
    }
  }
}
