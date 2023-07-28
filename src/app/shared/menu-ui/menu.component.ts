import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NgForOf} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NavigationItem} from '@shared/model';

@Component({
    standalone: true,
    imports: [
        NgForOf,
        RouterLink,
        RouterLinkActive
    ],
    selector: 'app-menu',
    template: `
        <nav class="menu">
            <div
                *ngFor="let item of navigationItems"
                class="menu__item"
                routerLinkActive="menu__item--active"
                [routerLink]="item.link"
            >
                {{item.name}}
            </div>
        </nav>
    `,
    styleUrls: ['./menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
    readonly navigationItems: NavigationItem[] = [
        {
            name: 'Данные',
            link: 'data',
        },
        {
            name: 'Проекты',
            link: 'projects',
        }
    ];
}
