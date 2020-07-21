import { CMSImage } from './cms-image.model';
import { MenuItem } from './menu-item.model';

export interface Navbar {
    logo: CMSImage;
    menuItems: MenuItem[];
}
