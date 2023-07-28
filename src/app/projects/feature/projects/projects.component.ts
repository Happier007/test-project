import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {ProjectsStore} from '@shared/data-access';
import {toSignal} from '@angular/core/rxjs-interop';
import {Project} from '@shared/model';
import {MapperPipe} from '@shared/pipe';

@Component({
    standalone: true,
    imports: [RouterOutlet, NgIf, NgForOf, MapperPipe, RouterLink],
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss'],
    providers: [DatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProjectsComponent {
    private readonly datePipe = inject(DatePipe);
    private readonly projectsStore = inject(ProjectsStore);

    readonly projects = toSignal(this.projectsStore.getProjects$(), {
        initialValue: [] as Project[],
    });

    readonly formatDate = (project: Project): string => {
        const {startDate, endDate} = project;

        // in real project is good to check if dates are valid,
        // but skip for simplicity
        return [
            this.datePipe.transform(startDate),
            this.datePipe.transform(endDate),
        ]
            .filter(Boolean)
            .join(' - ');
    }

    constructor() {
        this.projectsStore.fetchProjectsFromStorage();
    }
}
