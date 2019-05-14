import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/service/project.service';
import { ResTpl } from 'src/app/models/ResTpl';
import { ProjectStepService } from 'src/app/service/project-step.service';
import { Project } from 'src/app/models/Project';
import { ProjectStep } from 'src/app/models/ProjectStep';
import { SkillService } from 'src/app/service/skill.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  projects: Project[];
  cycles = [];
  skillList = [];
  PSList: ProjectStep[] = [];
  formData = {
    cycle: [],
    skills: [],
    project_type: '',
    price: [0, 10000],
    project_assess: [0, 10000],
  };
  marks: any = {
    0: '￥0',
    5000: '￥5000',
    10000: '￥10000'
  };


  constructor(
    private projectSrv: ProjectService,
    private projStepSrv: ProjectStepService,
    private skillSrv: SkillService,
    public userSrv: UserService,
  ) { }

  ngOnInit() {
    console.log(this.userSrv.userInfo)
    this.cycles = this.projectSrv.cycles
    this.handleGetSkills()
    this.handleGetPS()
  }

  // 获取全部skill
  handleGetSkills() {
    this.skillSrv.getSkills().subscribe((res: ResTpl) => {
      this.skillList = res.data.map(item => {
        item.label = item.name
        item.value = item.id
        return item
      })
      this.handleGetProjects()
    })
  }

  // 获取全部项目
  handleGetProjects() {
    console.log('this.formData: ', this.formData);
    this.projectSrv.getProjects(this.formData).subscribe(
      (resTpl: ResTpl) => {
        if (resTpl.code === 0) {
          this.projects = resTpl.data.filter(item => {
            // 截取desc
            item.desc = item.desc.substr(0, 100) + '...'
            // 审核通过&状态是0
            return item.audit === 1 // && item.status === 0
          }).reverse()
        }
      }
    )
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

  // 格式
  formatterPrice(value: number): string {
    return `￥${value}`;
  }

  // 选择project-step
  selectPS(item) {
    if (item === 0) {
      this.formData.project_type = ''
    } else {
      this.formData.project_type = item.type
    }
  }
  // 选择周期
  selectCycle(item) {
    if (item === 0) {
      this.formData.cycle = []
      this.cycles.forEach(i => i.on = false)
    } else {
      item.on = true
      this.formData.cycle.push(item.value)
    }
  }
  // 选择技能
  selectSkill(item) {
    if (item === 0) {
      this.formData.skills = []
      this.skillList.forEach(i => i.on = false)
    } else {
      item.on = true
      this.formData.skills.push(item.id)
    }
  }

}
