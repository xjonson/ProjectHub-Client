import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';
import { AuthService } from 'src/app/service/auth.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/User';
import { ResTpl } from 'src/app/models/ResTpl';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formData: FormGroup;


  constructor(
    private fb: FormBuilder,
    private userSrv: UserService,
    private authSrv: AuthService,
    private nzMessage: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
  ) { }

  // on init
  ngOnInit() {
    this.formData = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

  // 提交表单
  submitForm() {
    this.userSrv.login(this.formData.value).subscribe((resTpl: ResTpl) => {
      if (resTpl.code === 0) {
        const user = resTpl.data
        this.message.info(`登录成功！欢迎您，${user.profile.name}`);
        // 重定向到授权前的路由
        this.router.navigate([this.authSrv.redirectUrl], {
          replaceUrl: true,
        })
      } else {
        this.message.info(resTpl.msg)
      }
    })
  }
}
