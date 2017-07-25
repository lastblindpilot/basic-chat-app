import { Chatapp4Page } from './app.po';

describe('chatapp4 App', () => {
  let page: Chatapp4Page;

  beforeEach(() => {
    page = new Chatapp4Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
