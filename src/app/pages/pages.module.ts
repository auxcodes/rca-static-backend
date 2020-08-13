import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CardsModule } from '../cards/cards.module';
import { ContentDetailModule } from '../content-detail/content-detail.module';
import { SpinnersModule } from '../spinners/spinners.module';
import { InfiniteScrollComponent } from '../utils/infinite-scroll/infinite-scroll.component';
import { LoadMoreButtonComponent } from '../utils/load-more-button/load-more-button.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { AdminComponent } from './admin/admin.component';
import { ArtistPageComponent } from './artist-page/artist-page.component';
import { ArtistsComponent } from './artists/artists.component';
import { ArtworkComponent } from './artwork/artwork.component';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { GalleryComponent } from './gallery/gallery.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ReturnsComponent } from './returns/returns.component';
import { SitemapComponent } from './sitemap/sitemap.component';
import { TermsComponent } from './terms/terms.component';
import { ArtworkFeatureComponent } from '../menus/artwork-feature/artwork-feature.component';
import { FacebookShareComponent } from '../utils/facebook-share/facebook-share.component';
import { SinglePostComponent } from './blog/single-post/single-post.component';
import { AllPostsComponent } from './blog/all-posts/all-posts.component';
import { InnerHtmlComponent } from './components/inner-html/inner-html.component';
import { SortBarComponent } from './components/sort-bar/sort-bar.component';



@NgModule({
    declarations: [
        HomePageComponent,
        AboutPageComponent,
        GalleryComponent,
        ArtistsComponent,
        ContactPageComponent,
        PrivacyComponent,
        TermsComponent,
        SitemapComponent,
        AdminComponent,
        ResetPasswordComponent,
        ArtworkComponent,
        ReturnsComponent,
        InfiniteScrollComponent,
        LoadMoreButtonComponent,
        ArtistPageComponent,
        NotFoundPageComponent,
        ArtworkFeatureComponent,
        FacebookShareComponent,
        SinglePostComponent,
        AllPostsComponent,
        InnerHtmlComponent,
        SortBarComponent
    ],
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CardsModule,
        ContentDetailModule,
        SpinnersModule,
    ],
    exports: [
        InnerHtmlComponent
    ]
})
export class PagesModule { }
