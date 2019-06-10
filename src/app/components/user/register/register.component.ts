import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { UserService } from 'src/app/service/user.service';
import { SkillService } from 'src/app/service/skill.service';
import { ResTpl } from 'src/app/models/ResTpl';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../login/login.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  skills: [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private message: NzMessageService,
    private fb: FormBuilder,
    private userSrv: UserService,
    private skillService: SkillService,
    private modal: NzModalService,
  ) { }


  ngOnInit() {
    this.handleGetSkills()
    this.initForm()
  }

  get email(): AbstractControl {
    return this.registerForm.get('email')
  }
  get password(): AbstractControl {
    return this.registerForm.get('pwd.password')
  }
  get password2(): AbstractControl {
    return this.registerForm.get('pwd.password2')
  }
  get pwd(): FormGroup {
    return this.registerForm.get('pwd') as FormGroup
  }
  get name(): AbstractControl {
    return this.registerForm.get('profile').get('name')
  }
  get phone(): AbstractControl {
    return this.registerForm.get('profile').get('phone')
  }
  get skill(): AbstractControl {
    return this.registerForm.get('skill')
  }
  // 表单初始化
  initForm() {
    this.registerForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      pwd: this.fb.group({
        password: ['', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(15)
        ]],
        password2: ['', [
          Validators.required,
        ]]
      }, { validator: this.passwordRepeat }),
      role: [2, [Validators.required]],
      audit: [0],
      create_time: [new Date()],
      skill: [[]],
      profile: this.fb.group({
        name: ['', [
          Validators.required,
          Validators.maxLength(10)
        ]],
        phone: ['', [
          Validators.required,
          Validators.pattern(/^1(3|4|5|6|7|8|9)\d{9}$/)
        ]],
      }),
      agree: [true, [Validators.requiredTrue]]
    })
    console.log(this.registerForm)
  }

  // 两次密码
  passwordRepeat(group: FormGroup): ValidationErrors | null {
    const password = group.get('password')
    const password2 = group.get('password2')
    return password.value === password2.value ? null : { notEqual: '两次密码不一致' }
  }

  // 获取全部skill
  handleGetSkills() {
    this.skillService.getSkills().subscribe((res: ResTpl) => {
      this.skills = res.data
    })
  }

  // 提交表单
  submitForm() {
    const formData = this.registerForm.value
    console.log('formData: ', formData);
    const newUser = {
      email: formData.email,
      password: formData.pwd.password,
      password2: formData.pwd.password2,
      role: formData.role,
      profile: formData.profile,
      skill: formData.skill,
    }
    this.userSrv.register(newUser).subscribe(res => {
      if (res.code === 0) {
        this.modal.success({
          nzContent: '注册成功！',
          nzOkText: '去登录',
          nzOnOk: () => {
            this.router.navigate(['/user/login'])
          }
        })
      } else {
        this.message.info(res.msg)
      }
    })
  }

}
