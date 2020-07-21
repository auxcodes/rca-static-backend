import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ArtistPageComponent } from './pages/artist-page/artist-page.component';
import { ArtistsComponent } from './pages/artists/artists.component';
import { ArtworkComponent } from './pages/artwork/artwork.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { ReturnsComponent } from './pages/returns/returns.component';
import { SitemapComponent } from './pages/sitemap/sitemap.component';
import { TermsComponent } from './pages/terms/terms.component';
import { AllPostsComponent } from './pages/blog/all-posts/all-posts.component';
import { SinglePostComponent } from './pages/blog/single-post/single-post.component';


const routes: Routes = [
    { path: 'about', component: AboutPageComponent },
    { path: 'manage', component: AdminComponent },
    { path: 'artists', component: ArtistsComponent },
    { path: 'artists/:name', component: ArtistsComponent },
    { path: 'artist/:id', component: ArtistPageComponent },
    { path: 'artwork/:id', component: ArtworkComponent },
    {
        path: 'blog', 
        children: [
            { path: '', component: AllPostsComponent },
            { path: 'post/:id', component: SinglePostComponent }]
    },
    { path: 'contact', component: ContactPageComponent },
    { path: 'gallery', component: GalleryComponent },
    {
        path: 'gallery',
        children: [
            { path: '__', component: GalleryComponent },
            { path: 'artist/:id', component: GalleryComponent }]
    },
    { path: 'home', component: HomePageComponent },
    { path: 'privacy', component: PrivacyComponent },
    { path: 'reset-password/:id', component: HomePageComponent },
    { path: 'terms', component: TermsComponent },
    { path: 'returns', component: ReturnsComponent },
    { path: 'sitemap', component: SitemapComponent },
    {
        path: 'not-found',
        children: [
            { path: '', component: NotFoundPageComponent },
            { path: ':error', component: NotFoundPageComponent }]
    },
    { path: '', component: HomePageComponent},
    { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
];

const routerOptions: ExtraOptions = {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
}

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
