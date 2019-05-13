import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { SkillService } from 'src/app/service/skill.service';
import { ProjectService } from 'src/app/service/project.service';
import { UserService } from 'src/app/service/user.service';
import { Router } from '@angular/router';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { ResTpl } from 'src/app/models/ResTpl';
import { ProjectStep } from 'src/app/models/ProjectStep';
import { Project } from 'src/app/models/Project';
import { ProjectStepService } from 'src/app/service/project-step.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  projectForm: FormGroup;
  skills: [];
  cycles = [];
  PSList: ProjectStep[];
  project: Project;
  selectType: string;
  selectPS: ProjectStep;

  get title(): AbstractControl {
    return this.projectForm.get('title')
  }
  get desc(): AbstractControl {
    return this.projectForm.get('desc')
  }
  get cycle(): AbstractControl {
    return this.projectForm.get('cycle')
  }
  get price(): AbstractControl {
    return this.projectForm.get('price')
  }

  constructor(
    private fb: FormBuilder,
    private skillService: SkillService,
    private projectSrv: ProjectService,
    private userSrv: UserService,
    private router: Router,
    private modal: NzModalService,
    private message: NzMessageService,
    private projStepSrv: ProjectStepService,
  ) { }

  ngOnInit() {
    this.cycles = this.projectSrv.cycles
    this.handleGetSkills()
    this.initForm()
    this.handleGetPS()
  }

  // 获取全部skill
  handleGetSkills() {
    this.skillService.getSkills().subscribe((res: ResTpl) => {
      this.skills = res.data
    })
  }
  // 获取全部PS
  handleGetPS() {
    this.projStepSrv.getProjectStep().subscribe(
      (resTpl: ResTpl) => {
        if (resTpl.code === 0) {
          this.PSList = resTpl.data
        }
      }
    )
  }
  // 项目初始化
  initForm() {
    this.projectForm = this.fb.group({
      title: ['', [
        Validators.required
      ]],
      desc: ['', [
        Validators.required
      ]],
      skills: [[]],
      cycle: ['', [
        Validators.required
      ]],
      price: ['', [
        Validators.required
      ]]
    })
  }
  // 提交表单
  onSubmit() {
    const data = this.projectForm.value
    // 项目发布
    this.projectSrv.addProject(data).subscribe((resTpl: ResTpl) => {
      if (resTpl.code === 0) {
        this.handleSetProjectType(resTpl.data._id)
        this.handleSetProjectFun(resTpl.data._id)
        this.modal.success({
          nzTitle: '提示',
          nzContent: '项目信息填写成功！请等待平台审核，审核通过后会为您推送通知并将项目展示在项目大厅',
          nzCancelDisabled: false,
          nzCancelText: '前往项目大厅',
          nzOkText: '查看项目',
          nzOnCancel: () => {
            this.router.navigate(['/project'], {
              replaceUrl: true
            })
          },
          nzOnOk: () => {
            this.router.navigate(['/project/detail', resTpl.data._id], {
              replaceUrl: true
            })
          }
        });
      }
    })
  }

  // 选择类型
  chooseProjectType(item: ProjectStep) {
    this.selectType = item.type
    this.selectPS = item
  }
  // 设置项目类型
  handleSetProjectType(pid) {
    if (!this.selectType) return this.message.warning('请选择项目类型')
    this.projectSrv.setProjectType(pid, this.selectType).subscribe(
      (resTpl: ResTpl) => {
        console.log('resTpl: ', resTpl);
        if (resTpl.code === 0) {

        }
      }
    )
  }

  // 选择第一层
  clickFun1(item, index) {
    this.toggleOn(item)
    const isAllChildOn = item.on ? true : false
    this.selectPS.data[index].children.forEach(fun2 => {
      this.toggleOn(fun2, isAllChildOn)
      fun2.children.forEach(fun3 => {
        this.toggleOn(fun3, isAllChildOn)
      });
    });
  }
  // 选择第二层
  clickFun2(item, index1, index2) {
    this.toggleOn(item)
    const isAllChildOn = item.on ? true : false
    this.selectPS.data[index1].children[index2].children.forEach(fun3 => {
      this.toggleOn(fun3, isAllChildOn)
    });
    // 
    if (this.selectPS.data[index1].children.some(i => !i.on)) {
      this.selectPS.data[index1].on = false
    } else {
      this.selectPS.data[index1].on = true
    }
  }
  // 选择第三层
  clickFun3(item, index1, index2, index3) {
    this.toggleOn(item)
    if (this.selectPS.data[index1].children[index2].children.some(i => !i.on)) {
      this.selectPS.data[index1].on = false
      this.selectPS.data[index1].children[index2].on = false
    } else {
      this.selectPS.data[index1].children[index2].on = true
      if (this.selectPS.data[index1].children.every(i => i.on)) {
        this.selectPS.data[index1].on = true
      }
    }
  }
  // 切换on
  toggleOn(item, isAllChildOn = undefined) {
    if (isAllChildOn === true) {
      item.on = true
    } else if (isAllChildOn === false) {
      item.on = false
    } else {
      if (!item.on) {
        item.on = true
      } else {
        item.on = false
      }
    }
  }
  // 设置项目功能
  handleSetProjectFun(pid) {
    const funs = []
    this.selectPS.data.forEach(level1 => {
      level1.children.forEach(level2 => {
        level2.children.forEach(level3 => {
          if (level3.on) {
            const func_line = [
              level1,
              level2,
              level3,
            ]
            funs.push(func_line)
          }
        })
      });
    })
    if (funs.length === 0) {
      return this.message.warning('请选择项目功能')
    }
    this.projectSrv.setProjectFun(pid, funs).subscribe(
      (resTpl: ResTpl) => {
        console.log('resTpl: ', resTpl);
        if (resTpl.code === 0) {
          this.router.navigate(['/project/detail', pid], {
            replaceUrl: false
          })
        }
      }
    )

  }
}
