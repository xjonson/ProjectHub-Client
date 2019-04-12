import { Skill } from './Skill';

export interface User {
  // id
  _id: string, 
  // 邮箱
  email: string, 
  password: string,
  // 角色
  role: Role, 
  // 信息
  profile: profile, 
  // 技能
  skill: Skill[], 
  // 注册时间
  create_time: string, 
  // 是否审核
  audit: 0 | 1 | 2, 
}



// 用户身份
export enum Role {
  admin = 1,
  demander = 2,
  developer = 3
}

// 用户个人信息
export interface profile {
  name: string,
  phone: string,
  avatar?: string,
  desc?: string
}