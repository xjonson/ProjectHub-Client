import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/service/project.service';
import { UserService } from 'src/app/service/user.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { MsgService } from 'src/app/service/msg.service';
import { ResTpl } from 'src/app/models/ResTpl';
import { Action } from 'src/app/models/Msg';
import { Project, Apply } from 'src/app/models/Project';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  project: Project;
  commentContent: string;
  showHelp = false;
  submitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectSrv: ProjectService,
    public userSrv: UserService,
    private message: NzMessageService,
    private msgSrv: MsgService,
    private modal: NzModalService,
  ) { }

  ngOnInit() {
    this.handleGetProject()
  }

  // 获取项目详情
  handleGetProject(): void {
    this.route.params.subscribe(params => {
      const id = params['_id']
      this.projectSrv.getProject(id).subscribe((res: ResTpl) => {
        if (res.code === 0) {
          const proj: Project = res.data
          this.project = proj
        }
      })
    })
  }

  // 发布评论
  handleSubmitComment(): void {
    this.submitting = true;
    if (this.userSrv.userInfo.audit !== 1) {
      alert('您的账号正在审核，审核成功后才能评论')
    } else {
      this.projectSrv.addProjectComment(this.project._id, this.commentContent).subscribe(
        (res: ResTpl) => {
          if (res.code == 0) {
            const data = res.data
            this.handleGetProject()
            this.submitting = false;
            // 推送消息，不给自己推送消息
            if (this.project.demand_user._id !== this.userSrv.userInfo._id) {
              this.sendCommentMsg(this.commentContent, data.comments[data.comments.length - 1]._id)
            }
            this.commentContent = ''
          }
        }
      )
    }

  }

  // 申请订单
  applyProject(action): void {
    if (this.userSrv.userInfo.audit !== 1) {
      this.message.error('您的账号正在审核，审核成功后才能申请接单')
    } else {
      const userInfo = this.userSrv.userInfo
      // 如果applys中有相同用户id和aciton=status，说明已经申请过
      const hasApply = this.project.applys.filter((i: Apply) => {
        return i.user_id === userInfo._id && i.status == action && new Date().getTime() <= i.can_apply_time
      }).length

      if (hasApply) {
        this.message.info('您24小时之内已经申请过了，请等待需求方反馈')
      } else {
        // 发送申请消息
        const content = userInfo.profile.name + Action[action]
        this.sendCommentMsg(content, null, action)
      }
    }
  }

  // 推送需要操作的消息
  sendCommentMsg(content: string, project_comment_id, action: Action = 0): void {
    const data = {
      user_id: this.project.demand_user._id,
      project_id: this.project._id,
      project_comment_id,
      project_title: this.project.title,
      action,
      isAction: action == 0 ? false : true,
      content
    }
    // 发送消息
    this.msgSrv.sendMsg(data).subscribe((resTpl: ResTpl) => {
      if (resTpl.code === 0) {
        // 更新项目applys
        if (action != 0) {
          const apply: Apply = {
            user_id: this.userSrv.userInfo._id,
            status: action,
            can_apply_time: new Date().getTime() + (1 * 24 * 3600 * 1000)
          }
          // 更新申请列表
          this.projectSrv.updateProject(this.project._id, { apply }).subscribe(
            (resTpl: ResTpl) => {
              if (resTpl.code === 0) {
                this.project = resTpl.data
              }
            }
          )
        }
      }
    })
  }
}
