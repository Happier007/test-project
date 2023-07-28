import {inject, Injectable} from '@angular/core';
import {LOCAL_STORAGE} from '@shared/token';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, map, Observable, Subject, switchMap} from 'rxjs';
import {Project, ProjectLinks} from '@shared/model';
import {PROJECTS_KEY} from '@shared/util';
import {Router} from '@angular/router';

@Injectable()
export class ProjectsStore {
    private readonly localStorage = inject(LOCAL_STORAGE);
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);

    private readonly json$ = new Subject<void>();
    private readonly projects$ = new BehaviorSubject<Project[]>([]);
    private readonly project$ = new BehaviorSubject<Project | undefined>(void 0);

    /***
     * Grab projects from local json file in case you don't want to copy/paste them from the task description
     */
    get projectsFromJson$(): Observable<string> {
        return this.json$.pipe(
            switchMap(() =>
                this.http.get<{Projects: Project[]}>('assets/projects.json').pipe(
                    map(({Projects}) =>
                        JSON.stringify(Projects, null, 2)
                    ),
                )
            )
        )
    }

    getProjects$(): Observable<Project[]> {
        return this.projects$.asObservable();
    }

    getProject$(): Observable<Project | undefined> {
        return this.project$.asObservable();
    }

    getProjectById(id: string): void {
        this.project$.next(this.projects$.getValue().find(project => project.id === id));
    }

    saveProjects(projects: string): void {
        this.localStorage.setItem(PROJECTS_KEY, projects);
        this.projects$.next(this.getProjects());

        void this.router.navigate([ProjectLinks.Projects]);
    }

    updateProject(project: Partial<Project>): void {
        const projects = this.projects$.getValue();
        const index = projects.findIndex(({id}) => id === project.id);

        if (index === -1) {
            return;
        }

        projects[index] = {...projects[index], ...project};

        this.localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
        this.projects$.next(projects);
    }

    fetchProjectsFromJson(): void {
        this.json$.next();
    }

    fetchProjectsFromStorage(): void {
        this.projects$.next(this.getProjects());
    }

    private getProjects(): Project[] {
        const projects = this.localStorage.getItem(PROJECTS_KEY);

        return projects ? JSON.parse(projects) : [];
    }
}
