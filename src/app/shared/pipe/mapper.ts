import {Pipe, PipeTransform} from '@angular/core';

export type Mapper<T, G> = (item: T, ...args: unknown[]) => G;

@Pipe({name: 'mapper', standalone: true})
export class MapperPipe implements PipeTransform {
    transform<T, G>(value: T, mapper: Mapper<T, G>, ...args: unknown[]): G {
        return mapper(value, ...args);
    }
}
