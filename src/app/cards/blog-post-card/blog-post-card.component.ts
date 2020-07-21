import { Component, OnInit, Input} from '@angular/core';
import { BlogPost } from '../../models/blog-post.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-blog-post-card',
    templateUrl: './blog-post-card.component.html',
    styleUrls: ['./blog-post-card.component.scss']
})
export class BlogPostCardComponent implements OnInit {

    @Input() postData: BlogPost = {
        id: 1,
        author: '',
        description: '',
        thumbnail: ''
    };

    constructor(private router: Router) { }

    ngOnInit(): void {
    }

    openBlogPost() {
        this.router.navigate(['/blog/post/' + this.postData.id]);
    }

}
