import { BFooterComponent } from './../b-footer/b-footer.component';
import { Component } from '@angular/core';
import { BNavbarComponent } from '../b-navbar/b-navbar.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-b-about',
  imports: [BNavbarComponent, BFooterComponent, TranslateModule],
  templateUrl: './b-about.component.html',
  standalone: true,
  styleUrl: './b-about.component.css',
})
export class BAboutComponent {
  isDarkMode = false;
}
