import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface RecycleOrder {
  id: string;
  type: string;
  weight: number;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  date: Date;
  location: string;
}

export interface EarningsRecord {
  id: string;
  amount: number;
  type: 'recycle' | 'bonus' | 'referral';
  date: Date;
  description: string;
}

export interface PointsItem {
  id: string;
  name: string;
  points: number;
  image: string;
  category: string;
  stock: number;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  readTime: number;
  publishDate: Date;
  image: string;
}

export interface Device {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  capacity: number;
  currentLoad: number;
  lastMaintenance: Date;
}

export interface BusinessStats {
  totalOrders: number;
  totalRevenue: number;
  activeDevices: number;
  customerSatisfaction: number;
}

export interface GovernmentStats {
  totalRecycleVolume: number;
  subsidyDistributed: number;
  activeBusinesses: number;
  environmentalImpact: number;
}

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  // C端消费者数据
  getRecycleOrders(): Observable<RecycleOrder[]> {
    const orders: RecycleOrder[] = [
      {
        id: '1',
        type: '塑料瓶',
        weight: 2.5,
        price: 5.0,
        status: 'completed',
        date: new Date('2024-01-15'),
        location: '北京市朝阳区'
      },
      {
        id: '2',
        type: '废纸',
        weight: 10.0,
        price: 15.0,
        status: 'pending',
        date: new Date('2024-01-20'),
        location: '北京市海淀区'
      }
    ];
    return of(orders);
  }

  getEarningsRecords(): Observable<EarningsRecord[]> {
    const earnings: EarningsRecord[] = [
      {
        id: '1',
        amount: 5.0,
        type: 'recycle',
        date: new Date('2024-01-15'),
        description: '塑料瓶回收收益'
      },
      {
        id: '2',
        amount: 2.0,
        type: 'bonus',
        date: new Date('2024-01-16'),
        description: '环保行为奖励'
      }
    ];
    return of(earnings);
  }

  getPointsItems(): Observable<PointsItem[]> {
    const items: PointsItem[] = [
      {
        id: '1',
        name: '环保购物袋',
        points: 100,
        image: '/assets/images/eco-bag.jpg',
        category: '生活用品',
        stock: 50
      },
      {
        id: '2',
        name: '竹制餐具套装',
        points: 200,
        image: '/assets/images/bamboo-utensils.jpg',
        category: '餐具',
        stock: 30
      }
    ];
    return of(items);
  }

  getKnowledgeArticles(): Observable<KnowledgeArticle[]> {
    const articles: KnowledgeArticle[] = [
      {
        id: '1',
        title: '垃圾分类小知识',
        content: '正确的垃圾分类可以有效提高回收效率...',
        category: '环保知识',
        readTime: 5,
        publishDate: new Date('2024-01-10'),
        image: '/assets/images/waste-sorting.jpg'
      },
      {
        id: '2',
        title: '塑料回收的重要性',
        content: '塑料回收对环境保护具有重要意义...',
        category: '回收知识',
        readTime: 8,
        publishDate: new Date('2024-01-12'),
        image: '/assets/images/plastic-recycle.jpg'
      }
    ];
    return of(articles);
  }

  // B端企业数据
  getBusinessStats(): Observable<BusinessStats> {
    const stats: BusinessStats = {
      totalOrders: 1250,
      totalRevenue: 125000,
      activeDevices: 15,
      customerSatisfaction: 4.8
    };
    return of(stats);
  }

  getDevices(): Observable<Device[]> {
    const devices: Device[] = [
      {
        id: '1',
        name: '智能回收机-001',
        location: '朝阳区建国门',
        status: 'online',
        capacity: 1000,
        currentLoad: 750,
        lastMaintenance: new Date('2024-01-01')
      },
      {
        id: '2',
        name: '智能回收机-002',
        location: '海淀区中关村',
        status: 'maintenance',
        capacity: 1000,
        currentLoad: 200,
        lastMaintenance: new Date('2024-01-15')
      }
    ];
    return of(devices);
  }

  // G端政府数据
  getGovernmentStats(): Observable<GovernmentStats> {
    const stats: GovernmentStats = {
      totalRecycleVolume: 50000,
      subsidyDistributed: 2000000,
      activeBusinesses: 120,
      environmentalImpact: 85
    };
    return of(stats);
  }

  getIndustryAnalysis(): Observable<any> {
    const analysis = {
      monthlyGrowth: 15.5,
      recycleTypes: [
        { type: '塑料', percentage: 35 },
        { type: '纸类', percentage: 28 },
        { type: '金属', percentage: 20 },
        { type: '玻璃', percentage: 17 }
      ],
      regionStats: [
        { region: '朝阳区', volume: 12000 },
        { region: '海淀区', volume: 10500 },
        { region: '西城区', volume: 8900 },
        { region: '东城区', volume: 7600 }
      ]
    };
    return of(analysis);
  }
}
