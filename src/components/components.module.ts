import { NgModule } from '@angular/core';
import { CallButtonComponent } from './call-button/call-button';
import { FooterComponent } from './footer/footer';
@NgModule({
	declarations: [CallButtonComponent,
    FooterComponent],
	imports: [],
	exports: [CallButtonComponent,
    FooterComponent]
})
export class ComponentsModule {}
