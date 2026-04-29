import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * 头像数据接口
 */
export interface AvatarOption {
  id: number;
  url: string;
  category: string;
  name: string;
}

/**
 * 精美头像选择组件
 * 提供多种风格的预设头像供用户选择
 */
@Component({
  selector: 'app-avatar-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgFor],
  templateUrl: './avatar-picker.component.html',
  styleUrls: ['./avatar-picker.component.scss']
})
export class AvatarPickerComponent {
  @Input() visible = false;
  @Input() currentAvatar = '';
  @Input() currentNickname = '';
  @Input() userType: 'consumer' | 'business' | 'government' = 'consumer';
  
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<{ avatar: string; avatarIndex: number; nickname: string }>();
  @Output() cancel = new EventEmitter<void>();

  nickname = '';
  selectedAvatarIndex = 1;
  activeCategory = 'nature';
  customAvatarUrl = '';  // 自定义上传的头像
  isCustomAvatar = false;  // 是否使用自定义头像
  
  // 头像分类
  categories = [
    { id: 'upload', name: '📷 上传头像', icon: 'fa-upload' },
    { id: 'nature', name: '🌿 自然环保', icon: 'fa-leaf' },
    { id: 'animal', name: '🐾 可爱动物', icon: 'fa-paw' },
    { id: 'character', name: '👤 人物角色', icon: 'fa-user' },
    { id: 'abstract', name: '🎨 抽象艺术', icon: 'fa-palette' },
    { id: 'tech', name: '💻 科技未来', icon: 'fa-robot' }
  ];

  // 精美头像库 - 使用SVG数据URI实现精美头像
  avatars: AvatarOption[] = [
    // 🌿 自然环保系列 (1-8)
    { id: 1, category: 'nature', name: '绿叶新芽', url: this.generateAvatarSvg('#22c55e', '#16a34a', 'leaf') },
    { id: 2, category: 'nature', name: '蓝天白云', url: this.generateAvatarSvg('#3b82f6', '#2563eb', 'cloud') },
    { id: 3, category: 'nature', name: '森林守护', url: this.generateAvatarSvg('#10b981', '#059669', 'tree') },
    { id: 4, category: 'nature', name: '海洋之心', url: this.generateAvatarSvg('#0ea5e9', '#0284c7', 'water') },
    { id: 5, category: 'nature', name: '阳光灿烂', url: this.generateAvatarSvg('#f59e0b', '#d97706', 'sun') },
    { id: 6, category: 'nature', name: '大地母亲', url: this.generateAvatarSvg('#84cc16', '#65a30d', 'earth') },
    { id: 7, category: 'nature', name: '彩虹桥', url: this.generateAvatarSvg('#ec4899', '#db2777', 'rainbow') },
    { id: 8, category: 'nature', name: '星空夜', url: this.generateAvatarSvg('#6366f1', '#4f46e5', 'star') },
    
    // 🐾 可爱动物系列 (9-16)
    { id: 9, category: 'animal', name: '小熊猫', url: this.generateAvatarSvg('#f97316', '#ea580c', 'panda') },
    { id: 10, category: 'animal', name: '小企鹅', url: this.generateAvatarSvg('#1e3a5f', '#0f172a', 'penguin') },
    { id: 11, category: 'animal', name: '小兔子', url: this.generateAvatarSvg('#f472b6', '#ec4899', 'rabbit') },
    { id: 12, category: 'animal', name: '小狐狸', url: this.generateAvatarSvg('#fb923c', '#f97316', 'fox') },
    { id: 13, category: 'animal', name: '小猫咪', url: this.generateAvatarSvg('#a78bfa', '#8b5cf6', 'cat') },
    { id: 14, category: 'animal', name: '小狗狗', url: this.generateAvatarSvg('#fbbf24', '#f59e0b', 'dog') },
    { id: 15, category: 'animal', name: '小鲸鱼', url: this.generateAvatarSvg('#38bdf8', '#0ea5e9', 'whale') },
    { id: 16, category: 'animal', name: '小蜜蜂', url: this.generateAvatarSvg('#fcd34d', '#fbbf24', 'bee') },
    
    // 👤 人物角色系列 (17-24)
    { id: 17, category: 'character', name: '环保卫士', url: this.generateAvatarSvg('#22c55e', '#16a34a', 'hero') },
    { id: 18, category: 'character', name: '科学家', url: this.generateAvatarSvg('#8b5cf6', '#7c3aed', 'scientist') },
    { id: 19, category: 'character', name: '园丁', url: this.generateAvatarSvg('#84cc16', '#65a30d', 'gardener') },
    { id: 20, category: 'character', name: '探险家', url: this.generateAvatarSvg('#f59e0b', '#d97706', 'explorer') },
    { id: 21, category: 'character', name: '艺术家', url: this.generateAvatarSvg('#ec4899', '#db2777', 'artist') },
    { id: 22, category: 'character', name: '工程师', url: this.generateAvatarSvg('#3b82f6', '#2563eb', 'engineer') },
    { id: 23, category: 'character', name: '志愿者', url: this.generateAvatarSvg('#14b8a6', '#0d9488', 'volunteer') },
    { id: 24, category: 'character', name: '领导者', url: this.generateAvatarSvg('#6366f1', '#4f46e5', 'leader') },
    
    // 🎨 抽象艺术系列 (25-32)
    { id: 25, category: 'abstract', name: '几何绿', url: this.generateAvatarSvg('#22c55e', '#15803d', 'geo1') },
    { id: 26, category: 'abstract', name: '渐变蓝', url: this.generateAvatarSvg('#3b82f6', '#1d4ed8', 'geo2') },
    { id: 27, category: 'abstract', name: '波浪紫', url: this.generateAvatarSvg('#a855f7', '#7c3aed', 'geo3') },
    { id: 28, category: 'abstract', name: '光晕橙', url: this.generateAvatarSvg('#f97316', '#c2410c', 'geo4') },
    { id: 29, category: 'abstract', name: '星云粉', url: this.generateAvatarSvg('#f472b6', '#db2777', 'geo5') },
    { id: 30, category: 'abstract', name: '极光青', url: this.generateAvatarSvg('#06b6d4', '#0891b2', 'geo6') },
    { id: 31, category: 'abstract', name: '晶体金', url: this.generateAvatarSvg('#eab308', '#ca8a04', 'geo7') },
    { id: 32, category: 'abstract', name: '漩涡红', url: this.generateAvatarSvg('#ef4444', '#dc2626', 'geo8') },
    
    // 💻 科技未来系列 (33-40)
    { id: 33, category: 'tech', name: '数据流', url: this.generateAvatarSvg('#22d3ee', '#06b6d4', 'data') },
    { id: 34, category: 'tech', name: '智能芯', url: this.generateAvatarSvg('#8b5cf6', '#6d28d9', 'chip') },
    { id: 35, category: 'tech', name: '网络云', url: this.generateAvatarSvg('#60a5fa', '#3b82f6', 'network') },
    { id: 36, category: 'tech', name: '机器人', url: this.generateAvatarSvg('#a3e635', '#84cc16', 'robot') },
    { id: 37, category: 'tech', name: '全息影', url: this.generateAvatarSvg('#c084fc', '#a855f7', 'hologram') },
    { id: 38, category: 'tech', name: '量子态', url: this.generateAvatarSvg('#2dd4bf', '#14b8a6', 'quantum') },
    { id: 39, category: 'tech', name: '虚拟界', url: this.generateAvatarSvg('#818cf8', '#6366f1', 'virtual') },
    { id: 40, category: 'tech', name: '未来城', url: this.generateAvatarSvg('#34d399', '#10b981', 'future') }
  ];

  ngOnChanges(): void {
    if (this.visible) {
      this.nickname = this.currentNickname;
      // 根据当前头像找到对应索引
      const found = this.avatars.find(a => a.url === this.currentAvatar);
      this.selectedAvatarIndex = found ? found.id : 1;
    }
  }

  /**
   * 生成精美的SVG头像
   */
  private generateAvatarSvg(color1: string, color2: string, type: string): string {
    const patterns: { [key: string]: string } = {
      // 自然系列
      leaf: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><path d="M64 30 C40 45 35 75 50 95 C55 85 60 70 64 55 C68 70 73 85 78 95 C93 75 88 45 64 30Z" fill="white" opacity="0.9"/>`,
      cloud: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><ellipse cx="50" cy="70" rx="20" ry="15" fill="white" opacity="0.9"/><ellipse cx="70" cy="65" rx="25" ry="18" fill="white" opacity="0.9"/><ellipse cx="60" cy="55" rx="18" ry="14" fill="white" opacity="0.9"/>`,
      tree: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><rect x="58" y="70" width="12" height="30" fill="#8B4513" rx="2"/><circle cx="64" cy="50" r="25" fill="white" opacity="0.9"/><circle cx="50" cy="60" r="15" fill="white" opacity="0.85"/><circle cx="78" cy="60" r="15" fill="white" opacity="0.85"/>`,
      water: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><path d="M64 35 C45 55 40 75 64 95 C88 75 83 55 64 35Z" fill="white" opacity="0.9"/>`,
      sun: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><circle cx="64" cy="64" r="20" fill="white" opacity="0.95"/><g fill="white" opacity="0.8">${[0,45,90,135,180,225,270,315].map(a => `<rect x="62" y="25" width="4" height="12" rx="2" transform="rotate(${a} 64 64)"/>`).join('')}</g>`,
      earth: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><circle cx="64" cy="64" r="30" fill="white" opacity="0.2"/><path d="M45 50 Q55 45 65 50 Q75 55 70 65 Q65 75 55 70 Q45 65 45 50Z" fill="white" opacity="0.8"/><path d="M70 70 Q80 65 85 75 Q80 85 70 80 Q60 85 70 70Z" fill="white" opacity="0.7"/>`,
      rainbow: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><path d="M30 80 Q64 20 98 80" stroke="white" stroke-width="8" fill="none" opacity="0.9"/><path d="M38 80 Q64 30 90 80" stroke="white" stroke-width="5" fill="none" opacity="0.7"/>`,
      star: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><path d="M64 30 L68 50 L88 50 L72 62 L78 82 L64 70 L50 82 L56 62 L40 50 L60 50 Z" fill="white" opacity="0.95"/>`,
      
      // 动物系列
      panda: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><circle cx="64" cy="68" r="28" fill="white"/><circle cx="50" cy="55" r="12" fill="#333"/><circle cx="78" cy="55" r="12" fill="#333"/><circle cx="52" cy="53" r="4" fill="white"/><circle cx="76" cy="53" r="4" fill="white"/><ellipse cx="64" cy="72" rx="6" ry="4" fill="#333"/>`,
      penguin: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><ellipse cx="64" cy="70" rx="22" ry="28" fill="white"/><circle cx="54" cy="55" r="5" fill="white"/><circle cx="74" cy="55" r="5" fill="white"/><circle cx="55" cy="56" r="2" fill="#333"/><circle cx="73" cy="56" r="2" fill="#333"/><path d="M60 68 L64 75 L68 68" fill="#f97316"/>`,
      rabbit: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><ellipse cx="50" cy="35" rx="8" ry="20" fill="white"/><ellipse cx="78" cy="35" rx="8" ry="20" fill="white"/><circle cx="64" cy="70" r="25" fill="white"/><circle cx="54" cy="62" r="4" fill="#333"/><circle cx="74" cy="62" r="4" fill="#333"/><ellipse cx="64" cy="75" rx="4" ry="3" fill="#f472b6"/>`,
      fox: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><path d="M35 45 L50 70 L64 55 L78 70 L93 45 L78 75 L64 95 L50 75 Z" fill="white"/><circle cx="52" cy="60" r="4" fill="#333"/><circle cx="76" cy="60" r="4" fill="#333"/><ellipse cx="64" cy="75" rx="5" ry="3" fill="#333"/>`,
      cat: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><path d="M40 40 L50 65 L40 90 L64 80 L88 90 L78 65 L88 40 L64 55 Z" fill="white"/><circle cx="52" cy="60" r="5" fill="#333"/><circle cx="76" cy="60" r="5" fill="#333"/><path d="M60 72 L64 78 L68 72" fill="#f472b6"/>`,
      dog: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><ellipse cx="40" cy="50" rx="12" ry="18" fill="white" opacity="0.8"/><ellipse cx="88" cy="50" rx="12" ry="18" fill="white" opacity="0.8"/><ellipse cx="64" cy="72" rx="25" ry="22" fill="white"/><circle cx="54" cy="62" r="5" fill="#333"/><circle cx="74" cy="62" r="5" fill="#333"/><ellipse cx="64" cy="78" rx="8" ry="5" fill="#333"/>`,
      whale: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><ellipse cx="64" cy="68" rx="35" ry="25" fill="white" opacity="0.9"/><circle cx="48" cy="60" r="4" fill="#333"/><path d="M64 45 Q75 35 85 45" stroke="white" stroke-width="4" fill="none"/>`,
      bee: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><ellipse cx="64" cy="68" rx="22" ry="18" fill="white"/><rect x="48" y="60" width="32" height="5" fill="#333"/><rect x="48" y="70" width="32" height="5" fill="#333"/><circle cx="54" cy="55" r="3" fill="#333"/><circle cx="74" cy="55" r="3" fill="#333"/><ellipse cx="45" cy="50" rx="12" ry="8" fill="white" opacity="0.6" transform="rotate(-30 45 50)"/><ellipse cx="83" cy="50" rx="12" ry="8" fill="white" opacity="0.6" transform="rotate(30 83 50)"/>`,
      
      // 人物系列
      hero: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><circle cx="64" cy="50" r="20" fill="white"/><path d="M44 75 L64 65 L84 75 L84 95 L44 95 Z" fill="white"/><path d="M54 88 L64 78 L74 88" fill="${color1}"/>`,
      scientist: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><circle cx="64" cy="48" r="18" fill="white"/><rect x="46" y="66" width="36" height="30" rx="5" fill="white"/><circle cx="55" cy="46" r="8" stroke="${color1}" stroke-width="2" fill="none"/><circle cx="73" cy="46" r="8" stroke="${color1}" stroke-width="2" fill="none"/>`,
      gardener: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><circle cx="64" cy="50" r="18" fill="white"/><path d="M46 68 L82 68 L78 96 L50 96 Z" fill="white"/><path d="M64 35 L58 25 L64 15 L70 25 Z" fill="white"/>`,
      explorer: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><circle cx="64" cy="52" r="18" fill="white"/><path d="M46 70 L82 70 L80 96 L48 96 Z" fill="white"/><ellipse cx="64" cy="35" rx="22" ry="8" fill="white"/>`,
      artist: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><circle cx="64" cy="50" r="18" fill="white"/><path d="M44 68 L84 68 L80 96 L48 96 Z" fill="white"/><circle cx="64" cy="50" r="5" fill="${color1}"/>`,
      engineer: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><circle cx="64" cy="48" r="18" fill="white"/><rect x="44" y="66" width="40" height="30" rx="3" fill="white"/><rect x="50" y="38" width="28" height="8" rx="2" fill="white"/>`,
      volunteer: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><circle cx="64" cy="50" r="18" fill="white"/><path d="M46 68 L82 68 L78 96 L50 96 Z" fill="white"/><path d="M64 75 L58 85 L64 82 L70 85 Z" fill="${color1}"/>`,
      leader: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><circle cx="64" cy="52" r="18" fill="white"/><path d="M44 70 L84 70 L80 96 L48 96 Z" fill="white"/><path d="M52 35 L64 25 L76 35 L64 32 Z" fill="white"/>`,
      
      // 抽象系列
      geo1: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><polygon points="64,30 90,75 38,75" fill="white" opacity="0.9"/><polygon points="64,45 80,70 48,70" fill="${color2}" opacity="0.5"/>`,
      geo2: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><rect x="40" y="40" width="48" height="48" rx="8" fill="white" opacity="0.9" transform="rotate(45 64 64)"/>`,
      geo3: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><circle cx="64" cy="64" r="30" fill="none" stroke="white" stroke-width="8" opacity="0.9"/><circle cx="64" cy="64" r="15" fill="white" opacity="0.8"/>`,
      geo4: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><path d="M64 30 Q94 64 64 98 Q34 64 64 30" fill="white" opacity="0.9"/>`,
      geo5: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/>${[0,60,120,180,240,300].map(a => `<ellipse cx="64" cy="40" rx="8" ry="20" fill="white" opacity="0.8" transform="rotate(${a} 64 64)"/>`).join('')}`,
      geo6: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><path d="M30 64 Q47 30 64 64 Q81 98 98 64 Q81 30 64 64 Q47 98 30 64" fill="white" opacity="0.85"/>`,
      geo7: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><polygon points="64,25 95,50 85,90 43,90 33,50" fill="white" opacity="0.9"/>`,
      geo8: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><path d="M64 30 A34 34 0 0 1 98 64 A34 34 0 0 1 64 98 A34 34 0 0 1 30 64 A34 34 0 0 1 64 30 M64 45 A19 19 0 0 0 45 64 A19 19 0 0 0 64 83 A19 19 0 0 0 83 64 A19 19 0 0 0 64 45" fill="white" opacity="0.9"/>`,
      
      // 科技系列
      data: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><rect x="35" y="50" width="8" height="30" rx="2" fill="white" opacity="0.9"/><rect x="48" y="40" width="8" height="40" rx="2" fill="white" opacity="0.9"/><rect x="61" y="55" width="8" height="25" rx="2" fill="white" opacity="0.9"/><rect x="74" y="35" width="8" height="45" rx="2" fill="white" opacity="0.9"/><rect x="87" y="45" width="8" height="35" rx="2" fill="white" opacity="0.9"/>`,
      chip: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><rect x="44" y="44" width="40" height="40" rx="4" fill="white" opacity="0.9"/><rect x="54" y="54" width="20" height="20" rx="2" fill="${color2}"/>${[0,1,2,3].map(i => `<rect x="${39+i*12}" y="38" width="4" height="8" fill="white" opacity="0.8"/><rect x="${39+i*12}" y="82" width="4" height="8" fill="white" opacity="0.8"/><rect x="38" y="${39+i*12}" width="8" height="4" fill="white" opacity="0.8"/><rect x="82" y="${39+i*12}" width="8" height="4" fill="white" opacity="0.8"/>`).join('')}`,
      network: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><circle cx="64" cy="45" r="10" fill="white" opacity="0.9"/><circle cx="45" cy="75" r="8" fill="white" opacity="0.9"/><circle cx="83" cy="75" r="8" fill="white" opacity="0.9"/><line x1="64" y1="55" x2="50" y2="68" stroke="white" stroke-width="3"/><line x1="64" y1="55" x2="78" y2="68" stroke="white" stroke-width="3"/><line x1="53" y1="75" x2="75" y2="75" stroke="white" stroke-width="3"/>`,
      robot: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><rect x="44" y="40" width="40" height="35" rx="6" fill="white" opacity="0.9"/><rect x="49" y="75" width="30" height="20" rx="4" fill="white" opacity="0.9"/><circle cx="54" cy="55" r="6" fill="${color2}"/><circle cx="74" cy="55" r="6" fill="${color2}"/><rect x="54" y="65" width="20" height="4" rx="2" fill="${color2}"/>`,
      hologram: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><ellipse cx="64" cy="64" rx="35" ry="15" fill="none" stroke="white" stroke-width="2" opacity="0.6"/><ellipse cx="64" cy="64" rx="25" ry="35" fill="none" stroke="white" stroke-width="2" opacity="0.6"/><circle cx="64" cy="64" r="12" fill="white" opacity="0.9"/>`,
      quantum: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><circle cx="64" cy="64" r="25" fill="none" stroke="white" stroke-width="2" opacity="0.7"/><circle cx="64" cy="64" r="6" fill="white"/><circle cx="64" cy="39" r="5" fill="white" opacity="0.9"/><circle cx="85" cy="76" r="5" fill="white" opacity="0.9"/><circle cx="43" cy="76" r="5" fill="white" opacity="0.9"/>`,
      virtual: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><rect x="40" y="50" width="48" height="28" rx="4" fill="white" opacity="0.9"/><rect x="45" y="55" width="38" height="18" rx="2" fill="${color2}" opacity="0.8"/><rect x="55" y="78" width="18" height="8" rx="2" fill="white" opacity="0.9"/>`,
      future: `<circle cx="64" cy="64" r="60" fill="url(#grad)"/><path d="M40 85 L40 55 L50 45 L50 85 Z" fill="white" opacity="0.9"/><path d="M55 85 L55 40 L65 30 L65 85 Z" fill="white" opacity="0.85"/><path d="M70 85 L70 50 L80 40 L80 85 Z" fill="white" opacity="0.8"/><path d="M85 85 L85 60 L95 50 L95 85 Z" fill="white" opacity="0.75"/>`
    };

    const pattern = patterns[type] || patterns['leaf'];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
      </defs>
      ${pattern}
    </svg>`;
    
    return 'data:image/svg+xml;base64,' + btoa(svg);
  }

  get filteredAvatars(): AvatarOption[] {
    return this.avatars.filter(a => a.category === this.activeCategory);
  }

  selectCategory(categoryId: string): void {
    this.activeCategory = categoryId;
  }


  getSelectedAvatar(): AvatarOption | undefined {
    return this.avatars.find(a => a.id === this.selectedAvatarIndex);
  }

  /**
   * 处理图片上传
   */
  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // 限制文件大小（5MB）
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过5MB');
        return;
      }

      // 限制文件类型
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.customAvatarUrl = e.target?.result as string;
        this.isCustomAvatar = true;
        this.selectedAvatarIndex = 0;  // 0表示自定义头像
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * 选择预设头像
   */
  selectAvatar(avatar: AvatarOption): void {
    this.selectedAvatarIndex = avatar.id;
    this.isCustomAvatar = false;
  }

  /**
   * 使用自定义头像
   */
  useCustomAvatar(): void {
    if (this.customAvatarUrl) {
      this.isCustomAvatar = true;
      this.selectedAvatarIndex = 0;
    }
  }

  onSave(): void {
    const nickname = this.nickname.trim();
    if (!nickname) {
      alert('请输入昵称');
      return;
    }

    if (this.isCustomAvatar && this.customAvatarUrl) {
      // 使用自定义上传的头像
      this.save.emit({
        avatar: this.customAvatarUrl,
        avatarIndex: 0,
        nickname: nickname
      });
    } else {
      // 使用预设头像
      const selected = this.getSelectedAvatar();
      if (selected) {
        this.save.emit({
          avatar: selected.url,
          avatarIndex: selected.id,
          nickname: nickname
        });
      }
    }
    this.close();
  }

  close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.cancel.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  // 获取用户类型对应的默认昵称
  getDefaultNickname(): string {
    const defaults: { [key: string]: string } = {
      consumer: '环保达人',
      business: '企业管理员',
      government: '政府管理员'
    };
    return defaults[this.userType] || '用户';
  }
}
