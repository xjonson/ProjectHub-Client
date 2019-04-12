import { Pipe, PipeTransform } from '@angular/core';
import { Skill } from '../models/Skill';

@Pipe({name: 'skill'})
export class SkillPipe implements PipeTransform {
  transform(value: number): any {
    return Skill[value]
  }
}