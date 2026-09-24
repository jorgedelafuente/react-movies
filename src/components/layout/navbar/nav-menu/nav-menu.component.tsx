import './nav-menu.styles.css';

import { useNavigate } from '@tanstack/react-router';
import { type Key, useState } from 'react';
import {
   Button,
   Menu,
   MenuItem,
   MenuTrigger,
   Popover,
} from 'react-aria-components';

import { THEME_OPTIONS } from '@/types/theme.types';
import { useTheme } from '@/utils/hooks/useTheme';

type NavMenuLink = {
   path: string;
   text: string;
};

type NavMenuProps = {
   label: string;
   links: NavMenuLink[];
};

const NavMenu = ({ label, links }: NavMenuProps) => {
   const navigate = useNavigate();
   const theme = useTheme((state) => state.theme);
   const [portalContainer, setPortalContainer] =
      useState<HTMLDivElement | null>(null);

   const handleAction = (key: Key) => {
      navigate({ to: String(key) });
   };

   return (
      <div
         ref={setPortalContainer}
         className={`nav-menu ${theme === THEME_OPTIONS.DARK ? 'dark' : ''}`.trim()}
      >
         <MenuTrigger>
            <Button className="nav-menu__trigger" aria-label={`${label} menu`}>
               {label}
               <span aria-hidden="true" className="nav-menu__caret">
                  ▾
               </span>
            </Button>
            <Popover
               className="nav-menu__popover"
               UNSTABLE_portalContainer={portalContainer ?? undefined}
            >
               <Menu className="nav-menu__list" onAction={handleAction}>
                  {links.map((link) => (
                     <MenuItem
                        key={link.path}
                        id={link.path}
                        className="nav-menu__item"
                     >
                        {link.text}
                     </MenuItem>
                  ))}
               </Menu>
            </Popover>
         </MenuTrigger>
      </div>
   );
};

export default NavMenu;
