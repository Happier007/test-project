import {ChangeDetectionStrategy, Component, computed, inject, Input, signal} from '@angular/core';
import {ProjectsStore} from '@shared/data-access';
import {toSignal} from '@angular/core/rxjs-interop';
import {DatePipe, NgIf, NgTemplateOutlet} from '@angular/common';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

enum ViewMode {
    View,
    Edit,
}

@Component({
    standalone: true,
    imports: [
        NgIf,
        DatePipe,
        NgTemplateOutlet,
        ReactiveFormsModule
    ],
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProjectComponent {
    private readonly projectsStore = inject(ProjectsStore);

    @Input()
    set id(id: string) {
        this.projectsStore.getProjectById(id);
    }

    readonly project = toSignal(this.projectsStore.getProject$());
    readonly dateFormat = 'dd.MM.yyyy';

    readonly viewMode = signal(ViewMode.View);
    readonly isViewMode = computed(() => this.viewMode() === ViewMode.View);

    readonly form = new FormGroup({
        id: new FormControl('', {nonNullable: true}),
        subject: new FormControl('', {nonNullable: true}),
        startDate: new FormControl('', {nonNullable: true}),
        endDate: new FormControl('', {nonNullable: true}),
        createdBy: new FormControl('', {nonNullable: true}),
        description: new FormControl('', {nonNullable: true}),
    });

    get startDate(): AbstractControl {
        return this.form.get('startDate')!;
    }

    get endDate(): AbstractControl {
        return this.form.get('endDate')!;
    }

    get createdBy(): AbstractControl {
        return this.form.get('createdBy')!;
    }

    get description(): AbstractControl {
        return this.form.get('description')!;
    }

    onEdit(): void {
        this.viewMode.set(ViewMode.Edit);
        this.form.patchValue(this.project() || {});
    }

    onSubmit(): void {
        this.projectsStore.updateProject(this.form.value);
        this.viewMode.set(ViewMode.View);
    }
}
