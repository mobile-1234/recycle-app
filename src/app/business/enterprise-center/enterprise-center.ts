import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Employee {
  id: string;
  name: string;
  role: string;
  phone: string;
  status: 'active' | 'inactive';
}

interface Contract {
  id: string;
  title: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'pending';
}

@Component({
  selector: 'app-enterprise-center',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './enterprise-center.html',
  styleUrl: './enterprise-center.scss'
})
export class EnterpriseCenter {
  activeTab: 'info' | 'employee' | 'contract' | 'subscription' | 'settings' = 'info';

  // 企业信息
  enterpriseInfo = {
    name: '智回环保科技有限公司',
    code: '91110000MA01234567',
    type: '有限责任公司',
    legalPerson: '张三',
    phone: '010-12345678',
    email: 'contact@zhihui-eco.com',
    address: '北京市朝阳区建国路88号SOHO现代城',
    registeredCapital: '1000万元',
    establishDate: '2020-01-15'
  };

  // 员工列表
  employees: Employee[] = [
    { id: 'EMP-001', name: '张三', role: '管理员', phone: '138****1234', status: 'active' },
    { id: 'EMP-002', name: '李四', role: '回收员', phone: '139****5678', status: 'active' },
    { id: 'EMP-003', name: '王五', role: '回收员', phone: '137****9012', status: 'active' },
    { id: 'EMP-004', name: '赵六', role: '财务', phone: '136****3456', status: 'active' },
    { id: 'EMP-005', name: '孙七', role: '回收员', phone: '135****7890', status: 'inactive' }
  ];

  // 合同列表
  contracts: Contract[] = [
    { id: 'CON-001', title: '朝阳区回收服务合同', amount: 50000, startDate: '2023-01-01', endDate: '2023-12-31', status: 'active' },
    { id: 'CON-002', title: '海淀区回收服务合同', amount: 80000, startDate: '2023-03-01', endDate: '2024-02-29', status: 'active' },
    { id: 'CON-003', title: '设备采购合同', amount: 120000, startDate: '2022-06-01', endDate: '2022-12-31', status: 'expired' }
  ];

  // 订阅信息
  subscription = {
    plan: '企业专业版',
    expireDate: '2024-12-31',
    users: 50,
    usedUsers: 12,
    storage: '500GB',
    usedStorage: '125GB'
  };

  switchTab(tab: 'info' | 'employee' | 'contract' | 'subscription' | 'settings'): void {
    this.activeTab = tab;
  }

  getEmployeeCount(): number {
    return this.employees.filter(e => e.status === 'active').length;
  }

  getActiveContractCount(): number {
    return this.contracts.filter(c => c.status === 'active').length;
  }

  getStatusText(status: string): string {
    const statusMap: {[key: string]: string} = {
      'active': '在职',
      'inactive': '离职',
      'pending': '待确认',
      'expired': '已过期'
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  editInfo(): void {
    alert('编辑企业信息');
  }

  addEmployee(): void {
    alert('添加员工');
  }

  editEmployee(employee: Employee): void {
    alert(`编辑员工: ${employee.name}`);
  }

  deleteEmployee(employee: Employee): void {
    if (confirm(`确定要删除员工 ${employee.name} 吗？`)) {
      alert('员工已删除');
    }
  }

  viewContract(contract: Contract): void {
    alert(`查看合同: ${contract.title}`);
  }

  renewContract(contract: Contract): void {
    alert(`续签合同: ${contract.title}`);
  }

  upgradePlan(): void {
    alert('升级订阅计划');
  }

  logout(): void {
    if (confirm('确定要退出登录吗？')) {
      alert('已退出登录');
    }
  }

  constructor() {}
}
