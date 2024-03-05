import { test, expect, Route, Page } from '@playwright/test';

interface Story {
  title: string;
  url: string;
  author: string;
  num_comments: number;
  points: number;
  objectID: number;
}

const STORY_ONE: Story = {
  title: 'React',
  url: 'https://reactjs.org/',
  author: 'Jordan Walke',
  num_comments: 3,
  points: 4,
  objectID: 0,
};

const STORY_TWO: Story = {
  title: 'Redux',
  url: 'https://redux.js.org/',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 1,
};

test('all the things', async ({ page }: { page: Page }) => {
  const loadingIndicator = page.getByText(/Loading/);

  // mock API response
  await page.route('**/api/v1/search?query=*', async (route: Route) => {
    await loadingIndicator.isVisible();

    const getJson = (route: Route): { hits: Story[] } => {
      const url = new URL(route.request().url());
      const searchTerm = url.searchParams.get('query');

      switch (searchTerm) {
        case 'React':
          return { hits: [STORY_ONE] };
        case 'Redux':
          return { hits: [STORY_TWO] };
        default:
          throw new Error(`Unhandled search term "${searchTerm}".`);
      }
    };

    await route.fulfill({ json: getJson(route) });
  });

  await page.goto('.');

  // initial state
  await expect(loadingIndicator).toBeVisible();

  const title = page.getByRole('heading', { name: /My Hacker Stories/ });
  await expect(title).toBeVisible();
  const searchLabel = page.getByText(/Search/);
  await expect(searchLabel).toBeVisible();
  const searchInput = page.getByLabel(/Search/);
  await expect(searchInput).toBeVisible();
  await expect(searchInput).toHaveValue('React');

  // after fetch finished
  await expect(loadingIndicator).not.toBeVisible();
  await expect(page.getByText(STORY_ONE.author)).toBeVisible();
  const removeButtons = page.getByRole('button', { name: /Remove/ });
  await expect(removeButtons).toBeVisible();
  await expect(await removeButtons.count()).toBe(1);

  // remove item
  await removeButtons.first().click();

  await expect(page.getByText(STORY_ONE.author)).not.toBeVisible();
  await expect(removeButtons).not.toBeVisible();
  await expect(await removeButtons.count()).toBe(0);

  // change search query
  await searchInput.fill('Redux');

  await expect(loadingIndicator).toBeVisible();

  // after fetch finished
  await expect(loadingIndicator).not.toBeVisible();
  await expect(page.getByText(STORY_TWO.author)).toBeVisible();
  await expect(removeButtons).toBeVisible();
  await expect(await removeButtons.count()).toBe(1);
});
