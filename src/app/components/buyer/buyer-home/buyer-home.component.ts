
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BFooterComponent } from './b-footer/b-footer.component';
import { BNavbarComponent } from './b-navbar/b-navbar.component';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-buyer-home',
  imports: [CommonModule, TranslateModule, BFooterComponent, BNavbarComponent],
  templateUrl: './buyer-home.component.html',
  styleUrls: ['./buyer-home.component.css'],
})
export class BuyerHomeComponent {
  translate = inject(TranslateService);

}
