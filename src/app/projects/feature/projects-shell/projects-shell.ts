import {Routes} from '@angular/router';

export default [
    {
        path: '',
        loadComponent: () => import('../projects/projects.component'),
        children: [
            {
                path: ':id',
                loadComponent: () => import('../project/project.component'),
            },
        ],
    },
] as Routes;
