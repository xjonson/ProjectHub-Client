import { Component, OnInit } from '@angular/core';
import { Msg } from 'src/app/models/Msg';
import { UserService } from 'src/app/service/user.service';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/service/project.service';
import { MsgService } from 'src/app/service/msg.service';
import { ResTpl } from 'src/app/models/ResTpl';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-msgs',
  templateUrl: './msgs.component.html',
  styleUrls: ['./msgs.component.scss']
})
export class MsgsComponent implements OnInit {
  msgs: Msg[] = [];
  operableMsg: Msg[] = [];
  noticeMsg: Msg[] = [];
  operableMsgLength = 0;
  noticeMsgLength = 0;

  constructor(
    private userSrv: UserService,
    private router: Router,
    private projectSrv: ProjectService,
    private msgSrv: MsgService,
    private modal: NzModalService,
  ) { }

  ngOnInit() {
    this.handleGetMsgs()
  }

  // 获取信息
  handleGetMsgs() {
    this.msgSrv.getMsgs().subscribe(
      (res: ResTpl) => {
        if (res.code === 0) {
          this.msgs = res.data.filter((msg: Msg) => {
            return msg.user_id == this.userSrv.userInfo._id
          })
          this.operableMsg = this.msgs.filter(item => item.isAction)
          this.operableMsgLength = this.operableMsg.filter(item => !item.checked).length
          this.noticeMsg = this.msgs.filter(item => !item.isAction)
          this.noticeMsgLength = this.noticeMsg.filter(item => !item.checked).length
        }
      }
    )
  }

  // 删除已读
  delChecked(id?) {
    this.modal.confirm({
      nzContent: '删除后不可恢复！确认删除？',
      nzOnOk: () => {
        if (id) {
          this.msgSrv.delOneMsg(id).subscribe(
            () => {
              this.handleGetMsgs()
            }
          )
        } else {
          this.msgSrv.delReadMsg().subscribe(
            () => {
              this.handleGetMsgs()
            }
          )
        }
      }
    })
  }

  // 标记为已读并跳转到项目
  navigateToProject(msg: Msg): void {
    msg.checked = true
    this.msgSrv.readMsg(msg._id).subscribe(
      (res: ResTpl) => {
        if (res.code === 0) {
          this.router.navigate(['/project/detial', msg.project_id], {
            queryParams: { 'project_comment_id': msg.project_comment_id }
          })
        }
      }
    )
  }

  // 需求方操作通知
  actionMsg(msg: Msg, confirm: boolean) {
    // 确认：更新项目状态
    if (confirm) {
      this.projectSrv.updateProjectStatus(msg.project_id, msg.action, msg.from_user).subscribe(
        (resTpl: ResTpl) => {
          if (resTpl.code === 0) {
            switch (msg.action) {
              case 1:
                // 申请接单

                break;
              case 2:
                // 申请验收

                break;
              case 3:
                // 申请结款

                break;
            }
          }
        }
      )
    }

    // 确认&取消的统一操作：
    // 已读
    this.msgSrv.readMsg(msg._id).subscribe()
    // 发送反馈信息
    this.handleSendMsg(msg, confirm)
    // 刷新
    this.handleGetMsgs()
  }

  // 查看通知消息
  routeToProject(msg) {
    // 已读
    this.msgSrv.readMsg(msg._id).subscribe()
    this.router.navigate(['/project/detail', msg.project_id])
  }

  // 发送消息
  handleSendMsg(msg: Msg, confirm) {
    // 发送反馈消息
    const data = {
      user_id: msg.from_user._id,
      project_id: msg.project_id,
      project_comment_id: null,
      action: 0,
      isAction: false,
      content: this.userSrv.userInfo.profile.name + `${confirm ? '通过' : '驳回'}了您的更新项目进度申请`
    }
    this.msgSrv.sendMsg(data).subscribe()
  }
}
