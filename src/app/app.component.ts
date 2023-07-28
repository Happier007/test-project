import {ChangeDetectionStrategy, Component} from '@angular/core';
import {imports} from './app.imports';

@Component({
    selector: 'app-root',
    standalone: true,
    imports,
    template: `
        <section class="main">
            <app-menu class="main__navigation"/>

            <main class="main__content">
                <router-outlet></router-outlet>
            </main>
        </section>
    `,
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
