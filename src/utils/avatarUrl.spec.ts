import { baseImagePathAvatar } from '@/services/config';

import { resolveAvatarUrl } from './avatarUrl';

describe('resolveAvatarUrl', () => {
   it('returns null when the reviewer has no avatar', () => {
      expect(resolveAvatarUrl(null)).toBeNull();
      expect(resolveAvatarUrl('')).toBeNull();
   });

   it('prefixes a TMDB profile path with the avatar image CDN', () => {
      expect(resolveAvatarUrl('/yz2HPme8NPLne0mM8tBnZ5ZWJzf.jpg')).toBe(
         `${baseImagePathAvatar}yz2HPme8NPLne0mM8tBnZ5ZWJzf.jpg`
      );
   });

   it('unwraps a Gravatar URL hidden behind a leading slash', () => {
      expect(
         resolveAvatarUrl('/https://secure.gravatar.com/avatar/abc.jpg')
      ).toBe('https://secure.gravatar.com/avatar/abc.jpg');
   });

   it('passes a bare absolute URL through untouched', () => {
      expect(resolveAvatarUrl('http://example.com/a.png')).toBe(
         'http://example.com/a.png'
      );
   });
});
