import { AbstractControl, ValidatorFn } from '@angular/forms';
import {Project} from '@shared/model';

export function jsonFormatValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const jsonString = control.value;

    try {
      const parsedJson = JSON.parse(jsonString);

      if (!Array.isArray(parsedJson)) {
        return { jsonFormat: 'Invalid JSON format. The top-level structure must be an array.' };
      }

      const isValidFormat = parsedJson.every((project: Project) => {
        return (
          'id' in project &&
          'subject' in project &&
          'description' in project &&
          'createdBy' in project &&
          'startDate' in project &&
          'endDate' in project &&
          'cost' in project
        );
      });

      if (!isValidFormat) {
        return { jsonFormat: 'Invalid JSON format. The array elements do not match the specified structure.' };
      }

      return null;
    } catch (error) {
      return { jsonFormat: 'Invalid JSON format.' };
    }
  };
}
