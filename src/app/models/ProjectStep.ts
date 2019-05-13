import { NzTreeNode } from 'ng-zorro-antd';

export interface ProjectStep {
  _id: string,
  type: 'web' | 'mp' | 'android',
  data: [NzTreeNode],
  on: boolean
}