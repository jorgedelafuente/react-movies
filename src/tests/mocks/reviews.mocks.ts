export const MOCK_REVIEWS = {
   id: 533535,
   page: 1,
   results: [
      {
         author: 'oldtimer',
         author_details: {
            name: '',
            username: 'oldtimer',
            avatar_path:
               '/https://secure.gravatar.com/avatar/0123456789abcdef0123456789abcdef.jpg',
            rating: 6,
         },
         content: 'Short and sweet. Worth a watch.',
         created_at: '2024-07-25T10:00:00.000Z',
         id: 'review-oldest',
         updated_at: '2024-07-25T10:00:00.000Z',
         url: 'https://www.themoviedb.org/review/review-oldest',
      },
      {
         author: 'CinemaSerf',
         author_details: {
            name: 'Cinema Serf',
            username: 'CinemaSerf',
            avatar_path: '/yz2HPme8NPLne0mM8tBnZ5ZWJzf.jpg',
            rating: null,
         },
         content:
            'Paragraph one of a long review that goes on for quite a while, discussing the plot, the performances, the direction and the score in enough detail to need clamping on the page.\n\nParagraph two continues in the same vein and adds a few more observations about pacing and tone.\n\nParagraph three wraps things up with a verdict and a recommendation for who might enjoy it most.',
         created_at: '2024-07-27T09:30:00.000Z',
         id: 'review-long',
         updated_at: '2024-07-28T11:00:00.000Z',
         url: 'https://www.themoviedb.org/review/review-long',
      },
      {
         author: 'newcomer',
         author_details: {
            name: 'New Comer',
            username: 'newcomer',
            avatar_path: null,
            rating: 9.5,
         },
         content: 'Loved it. Best of the year so far.',
         created_at: '2024-08-01T18:45:00.000Z',
         id: 'review-newest',
         updated_at: '2024-08-01T18:45:00.000Z',
         url: 'https://www.themoviedb.org/review/review-newest',
      },
   ],
   total_pages: 1,
   total_results: 3,
};

/** `/search/multi?query=severance`: a series, a film and a person. */
