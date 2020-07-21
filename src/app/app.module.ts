import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, Title } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardsModule } from './cards/cards.module';
import { BurgerMenuComponent } from './menus/burger-menu/burger-menu.component';
import { CartMenuComponent } from './menus/cart-menu/cart-menu.component';
import { FooterComponent } from './menus/footer/footer.component';
import { NavbarComponent } from './menus/navbar/navbar.component';
import { SiteNavigationComponent } from './menus/site-navigation/site-navigation.component';
import { UserMenuComponent } from './menus/user-menu/user-menu.component';
import { PagesModule } from './pages/pages.module';
import { CmsAuthenticationService } from './services/cms/cms-authentication.service';
import { FacebookSdkComponent } from './utils/facebook-sdk/facebook-sdk.component';


@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        SiteNavigationComponent,
        UserMenuComponent,
        CartMenuComponent,
        FooterComponent,
        BurgerMenuComponent,
        FacebookSdkComponent
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        PagesModule,
        CardsModule,
    ],
    providers: [
        Title,
        CmsAuthenticationService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
