import { Pipe, PipeTransform } from '@angular/core';
import { Status, Color, StatusText } from '../models/Project';

// 返回项目状态名称
@Pipe({name: 'projectStatus'})
export class ProjectStatusPipe implements PipeTransform {
  transform(value: number): string {
    return Status[value]
  }
}

// 返回项目状态详细
@Pipe({name: 'projectStatusText'})
export class ProjectStatusPipeText implements PipeTransform {
  transform(value: number): string {
    return StatusText[value]
  }
}

// 返回项目颜色
@Pipe({name: 'projectColor'})
export class ProjectColorPipe implements PipeTransform {
  transform(value: number): string {
    return Color[value]
  }
}