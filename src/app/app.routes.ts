import {Routes} from '@angular/router';
import {ProjectLinks} from '@shared/model';
import {ProjectsStore} from '@shared/data-access';

export const routes: Routes = [
    {
        path: '',
        providers: [ProjectsStore],
        children: [
            {
                path: ProjectLinks.Data,
                loadComponent: async () => import('@data/feature'),
            },
            {
                path: ProjectLinks.Projects,
                loadChildren: async () => import('@projects/feature'),
            },
            {
                path: ProjectLinks.Wildcard,
                redirectTo: ProjectLinks.Data,
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: ProjectLinks.Data,
            }
        ],
    },
];
