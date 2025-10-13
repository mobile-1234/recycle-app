import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface SubsidyApplication {
  id: string;
  enterpriseName: string;
  type: string;
  amount: number;
  applyDate: string;
  status: 'pending' | 'approved' | 'rejected';
  blockchainStatus: 'verified' | 'verifying' | 'failed';
}

interface PaymentRecord {
  id: string;
  enterpriseName: string;
  amount: number;
  date: string;
  purpose: string;
  effectiveness: number;
}

@Component({
  selector: 'app-subsidy-management',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './subsidy-management.html',
  styleUrl: './subsidy-management.scss'
})
export class SubsidyManagement {
  activeTab: 'applications' | 'payments' | 'evaluation' = 'applications';
  filterStatus: 'all' | 'pending' | 'approved' | 'rejected' = 'all';
  selectedApplication: SubsidyApplication | null = null;
  selectedPayment: PaymentRecord | null = null;
  showDetailModal = false;
  showPaymentModal = false;

  applications: SubsidyApplication[] = [
    {
      id: 'SUB-2023-001',
      enterpriseName: '智回环保科技有限公司',
      type: '回收设备补贴',
      amount: 50000,
      applyDate: '2023-05-20',
      status: 'pending',
      blockchainStatus: 'verified'
    },
    {
      id: 'SUB-2023-002',
      enterpriseName: '绿色循环资源公司',
      type: '环保技术补贴',
      amount: 80000,
      applyDate: '2023-05-19',
      status: 'pending',
      blockchainStatus: 'verifying'
    },
    {
      id: 'SUB-2023-003',
      enterpriseName: '城市再生资源中心',
      type: '运营补贴',
      amount: 120000,
      applyDate: '2023-05-18',
      status: 'approved',
      blockchainStatus: 'verified'
    },
    {
      id: 'SUB-2023-004',
      enterpriseName: '环保回收企业',
      type: '设备采购补贴',
      amount: 30000,
      applyDate: '2023-05-17',
      status: 'rejected',
      blockchainStatus: 'failed'
    }
  ];

  payments: PaymentRecord[] = [
    {
      id: 'PAY-001',
      enterpriseName: '城市再生资源中心',
      amount: 120000,
      date: '2023-05-15',
      purpose: '运营补贴',
      effectiveness: 92
    },
    {
      id: 'PAY-002',
      enterpriseName: '绿色循环资源公司',
      amount: 60000,
      date: '2023-05-10',
      purpose: '技术升级',
      effectiveness: 88
    }
  ];

  get filteredApplications(): SubsidyApplication[] {
    if (this.filterStatus === 'all') {
      return this.applications;
    }
    return this.applications.filter(app => app.status === this.filterStatus);
  }

  get stats() {
    return {
      pending: this.applications.filter(a => a.status === 'pending').length,
      approved: this.applications.filter(a => a.status === 'approved').length,
      rejected: this.applications.filter(a => a.status === 'rejected').length,
      totalAmount: this.payments.reduce((sum, p) => sum + p.amount, 0)
    };
  }

  switchTab(tab: 'applications' | 'payments' | 'evaluation'): void {
    this.activeTab = tab;
  }

  setFilter(status: 'all' | 'pending' | 'approved' | 'rejected'): void {
    this.filterStatus = status;
  }

  getStatusText(status: string): string {
    const statusMap: {[key: string]: string} = {
      'pending': '待审核',
      'approved': '已通过',
      'rejected': '已驳回',
      'verified': '已验证',
      'verifying': '验证中',
      'failed': '验证失败'
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  viewApplicationDetail(application: SubsidyApplication): void {
    this.selectedApplication = application;
    this.showDetailModal = true;
  }

  closeDetail(): void {
    this.showDetailModal = false;
    this.selectedApplication = null;
  }

  approveApplication(application: SubsidyApplication, event?: Event): void {
    if (event) event.stopPropagation();
    if (confirm(`确定通过 ${application.enterpriseName} 的补贴申请吗？`)) {
      application.status = 'approved';
      alert('申请已通过');
    }
  }

  rejectApplication(application: SubsidyApplication, event?: Event): void {
    if (event) event.stopPropagation();
    const reason = prompt('请输入驳回原因：');
    if (reason) {
      application.status = 'rejected';
      alert('申请已驳回');
    }
  }

  viewPaymentDetail(payment: PaymentRecord): void {
    this.selectedPayment = payment;
    this.showPaymentModal = true;
  }

  closePaymentDetail(): void {
    this.showPaymentModal = false;
    this.selectedPayment = null;
  }

  exportPaymentReport(payment: PaymentRecord): void {
    alert(`导出 ${payment.enterpriseName} 的付款报告`);
  }

  verifyBlockchain(application: SubsidyApplication): void {
    application.blockchainStatus = 'verifying';
    setTimeout(() => {
      application.blockchainStatus = 'verified';
      alert('区块链验证完成');
    }, 1500);
  }

  constructor() {}
}
