import { User } from './User';

/**
 * @description 信息
 */
export interface Msg {
  // id
  _id: string,
  // 项目id
  project_id: string, 
  // 当前评论在原项目中的id，便于查看时自动滚动到指定位置
  project_comment_id?: string, 
  // 信息来自的用户信息
  from_user: Partial<User>,
  // 内容
  content: string,
  // 是否已读
  checked: boolean,
  // 创建时间
  create_time: string,
  // 是否是可操作信息
  isAction: boolean, 
  // 操作
  action: Action,
}

/**
 * @description 操作
 */
export enum Action {
  '管理员审核消息' = 0, // 比如项目审核不通过
  '开发者申请接单' = 1, // 开发者申请接单
  '开发者申请验收' = 2, // 开发者申请验收
  '开发者申请结款' = 3, // 开发者申请结款
}