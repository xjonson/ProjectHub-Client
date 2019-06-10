import { Component, OnInit, ElementRef } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { Project } from 'src/app/models/Project';
import { ProjectService } from 'src/app/service/project.service';
import { ResTpl } from 'src/app/models/ResTpl';
import { User } from 'src/app/models/User';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, AbstractControl, Validators, ValidationErrors } from '@angular/forms';
import { NzModalService, NzMessageService, UploadFile } from 'ng-zorro-antd';
import { SkillService } from 'src/app/service/skill.service';
import { Observable, Observer } from 'rxjs';
import { UploadService } from 'src/app/service/upload.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss', '../../project/list/list.component.scss']
})
export class ProfileComponent implements OnInit {
  FormData1: FormGroup;
  FormData2 = this.fb.group({
    oldPwd: [''],
    pwd1: [''],
    pwd2: ['']
  });
  projects: Project[];
  userInfo: User;
  skills = [];
  loading = false;
  avatarUrl: string;

  get name(): AbstractControl {
    return this.FormData1.get('name')
  }
  get phone(): AbstractControl {
    return this.FormData1.get('phone')
  }
  get skill(): AbstractControl {
    return this.FormData1.get('skill')
  }
  constructor(
    public userSrv: UserService,
    private projectSrv: ProjectService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private modal: NzModalService,
    private skillSrv: SkillService,
    private router: Router,
    private message: NzMessageService,
    private elementRef: ElementRef,
    private uploadSrv: UploadService,
  ) { }

  ngOnInit() {
    this.getUserInfo()
  }

  // 获取用户信息
  getUserInfo() {
    this.route.params.subscribe(params => {
      const id = params['_id']
      this.userSrv.getUserInfo(id).subscribe((resTpl: ResTpl) => {
        if (resTpl.code === 0) {
          this.userInfo = resTpl.data
          this.handleGetProjects()
          // 是自己，初始化表单
          if (id == this.userSrv.userInfo._id) {
            this.initForm()
          }
        }
      })
    })
  }

  // 获取全部项目
  handleGetProjects() {
    this.projectSrv.getProjects().subscribe(
      (resTpl: ResTpl) => {
        if (resTpl.code === 0) {
          this.projects = resTpl.data.filter(item => {
            // 截取desc
            item.desc = item.desc.substr(0, 100) + '...'
            const user_id = this.userInfo._id
            if (item.dev_user) {
              return item.demand_user._id == user_id || item.dev_user._id == user_id
            } else {
              return item.demand_user._id == user_id
            }
          }).reverse()
        }
      }
    )
  }

  // -------------如果是自己主页则可操作-----------
  // 表单初始化
  initForm() {
    this.handleGetSkills()
    const skillValue = this.userInfo.skill.map(item => item.id)
    this.FormData1 = this.fb.group({
      skillValue: [skillValue],
      skill: [[]],
      desc: [this.userInfo.profile.desc],
      name: [this.userInfo.profile.name, [
        Validators.required,
        Validators.maxLength(10)
      ]],
      phone: [this.userInfo.profile.phone, [
        Validators.required,
        Validators.pattern(/^1(3|4|5|6|7|8|9)\d{9}$/)
      ]],
    })
  }

  // 获取全部skill
  handleGetSkills() {
    this.skillSrv.getSkills().subscribe((res: ResTpl) => {
      this.skills = res.data
    })
  }

  // 提交
  submitForm1() {
    const formDataValue = this.FormData1.value
    // 处理skill
    formDataValue.skill = []
    formDataValue.skillValue.forEach(sv => {
      this.skills.forEach(item => {
        if (item.id == sv) {
          formDataValue.skill.push(item)
        }
      });
    });
    this.userInfo.profile.name = formDataValue.name
    this.userInfo.profile.phone = formDataValue.phone
    this.userInfo.profile.desc = formDataValue.desc
    this.userInfo.skill = formDataValue.skill
    console.log('formDataValue: ', formDataValue);
    this.userSrv.updateUserInfo(this.userInfo).subscribe(res => {
      if (res.code === 0) {
        this.modal.info({
          nzContent: '修改成功'
        })
        this.getUserInfo()
      }
    })
  }

  // 修改密码
  submitForm2() {
    const form = this.FormData2.value
    if (form.pwd1 !== form.pwd2) {
      return this.modal.warning({
        nzContent: '两次密码不一致'
      })
    }
    this.userSrv.updatePassword(form.oldPwd, form.pwd1).subscribe(
      (res: ResTpl) => {
        if (res.code === 0) {
          this.modal.info({
            nzContent: '修改成功，请重新登录',
            nzOnOk: () => {
              localStorage.removeItem('ph-token')
              this.router.navigate(['/user/login'])
            }
          })
        }
      }
    )

  }

  // 选择图片
  handleChooseImg() {
    const input = this.elementRef.nativeElement.querySelector(`#avatar-input`)
    input.click()
  }

  // 头像上传
  uploadImg(e): void {
    const input = this.elementRef.nativeElement.querySelector(`#avatar-input`)
    const file = e.target.files[0]
    console.log('file: ', file);
    this.uploadSrv.uploadImg(file).pipe(
      map((res: ResTpl) => {
        if (res.code === 0) return res.data
      })
    ).subscribe(path => {
      // 设置头像路径
      this.userInfo.profile.avatar = '/api/' + path
      this.userSrv.updateUserInfo(this.userInfo).subscribe(
        (res: ResTpl) => {
          if (res.code === 0) {
            // 清空input
            if (input) input.value = '';
            this.message.info('头像更新成功')
          }
        }
      )
    })
  }
}
