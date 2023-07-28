import {ChangeDetectionStrategy, Component, effect, inject} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProjectsStore} from '@shared/data-access';
import {toSignal} from '@angular/core/rxjs-interop';
import {jsonFormatValidator} from '@data/util';
import {map, shareReplay, startWith} from 'rxjs';
import {AsyncPipe, NgIf} from '@angular/common';

@Component({
    standalone: true,
    imports: [ReactiveFormsModule, AsyncPipe, NgIf],
    templateUrl: './data.component.html',
    styleUrls: ['./data.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DataComponent {
    private readonly projectsStore = inject(ProjectsStore);
    private readonly projectsFromJson = toSignal(this.projectsStore.projectsFromJson$);

    readonly jsonControl = new FormControl('', {
        validators: [Validators.required, jsonFormatValidator()],
        nonNullable: true,
    });

    readonly isInvalidJson$ = this.jsonControl.statusChanges.pipe(
        startWith('INVALID'),
        map(status => status === 'INVALID'),
        shareReplay({bufferSize: 1, refCount: true}),
    );

    constructor() {
        effect(() => {
            this.jsonControl.setValue(this.projectsFromJson() ?? '');
        });
    }

    onInsertFromJson(): void {
        this.projectsStore.fetchProjectsFromJson();
    }

    onSave(): void {
        if (this.jsonControl.invalid) {
            console.error('Please enter valid JSON');

            return;
        }

        this.projectsStore.saveProjects(this.jsonControl.value);
    }
}
